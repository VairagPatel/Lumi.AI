package in.LumiAI.api.service;

import in.LumiAI.api.client.ReplicateClient;
import in.LumiAI.api.client.StabilityAIClient;
import in.LumiAI.api.dto.TextToImageRequest;
import in.LumiAI.api.entity.ImageGeneration;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.BadRequestException;
import in.LumiAI.api.repository.ImageGenerationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageGenerationService {

    private final StabilityAIClient stabilityAIClient;
    private final ReplicateClient replicateClient;
    private final PromptService promptService;
    private final CloudinaryService cloudinaryService;
    private final CreditService creditService;
    private final ImageGenerationRepository imageGenerationRepository;

    @Value("${stability.api.key}")
    private String stabilityApiKey;

    @Value("${replicate.api.key}")
    private String replicateApiKey;

    private static final int CREDITS_PER_GENERATION = 10;

    @Transactional
    public ImageGeneration generateWithStabilityAI(User user, String prompt, String style) {
        // Check credits
        if (!creditService.hasEnoughCredits(user, CREDITS_PER_GENERATION)) {
            throw new BadRequestException("Insufficient credits");
        }

        // Enhance prompt with Gemini
        String enhancedPrompt = promptService.enhancePrompt(prompt);
        
        // Create generation record
        ImageGeneration generation = ImageGeneration.builder()
                .user(user)
                .prompt(prompt)
                .enhancedPrompt(enhancedPrompt)
                .style(style)
                .model("STABILITY_AI")
                .generationType("TEXT_TO_IMAGE")
                .status("PROCESSING")
                .creditsUsed(CREDITS_PER_GENERATION)
                .build();
        generation = imageGenerationRepository.save(generation);

        try {
            // Generate image
            final String engineId = "stable-diffusion-xl-1024-v1-0";
            final String stylePreset = style != null ? style : "anime";
            final String finalPrompt = enhancedPrompt + ", in the beautiful, detailed anime style of studio ghibli.";

            TextToImageRequest payload = new TextToImageRequest(finalPrompt, stylePreset);
            byte[] imageBytes = stabilityAIClient.generateImageFromText("Bearer " + stabilityApiKey, engineId, payload);

            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageBytes, "lumi-ai/generations");
            String imageUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            // Update generation record
            generation.setImageUrl(imageUrl);
            generation.setCloudinaryPublicId(publicId);
            generation.setSuccess(true);
            generation.setStatus("COMPLETED");

            // Deduct credits
            creditService.deductCredits(user, CREDITS_PER_GENERATION);

            log.info("Image generated successfully for user: {}", user.getEmail());
            return imageGenerationRepository.save(generation);

        } catch (Exception e) {
            log.error("Image generation failed", e);
            generation.setSuccess(false);
            generation.setStatus("FAILED");
            generation.setErrorMessage(e.getMessage());
            imageGenerationRepository.save(generation);
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    @Transactional
    public ImageGeneration generateWithReplicate(User user, String prompt, String modelVersion) {
        // Check credits
        if (!creditService.hasEnoughCredits(user, CREDITS_PER_GENERATION)) {
            throw new BadRequestException("Insufficient credits");
        }

        // Enhance prompt
        String enhancedPrompt = promptService.enhancePrompt(prompt);

        // Create generation record
        ImageGeneration generation = ImageGeneration.builder()
                .user(user)
                .prompt(prompt)
                .enhancedPrompt(enhancedPrompt)
                .model("REPLICATE")
                .generationType("TEXT_TO_IMAGE")
                .status("PROCESSING")
                .creditsUsed(CREDITS_PER_GENERATION)
                .build();
        generation = imageGenerationRepository.save(generation);

        try {
            // Create prediction
            Map<String, Object> request = Map.of(
                "version", modelVersion != null ? modelVersion : "stability-ai/sdxl",
                "input", Map.of(
                    "prompt", enhancedPrompt,
                    "num_outputs", 1
                )
            );

            Map<String, Object> response = replicateClient.createPrediction("Token " + replicateApiKey, request);
            String predictionId = (String) response.get("id");

            // Poll for completion (simplified - in production use webhooks)
            Map<String, Object> result = waitForPrediction(predictionId);
            
            if ("succeeded".equals(result.get("status"))) {
                @SuppressWarnings("unchecked")
                java.util.List<String> outputs = (java.util.List<String>) result.get("output");
                String imageUrl = outputs.get(0);

                // Download and upload to Cloudinary
                byte[] imageBytes = downloadImage(imageUrl);
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(imageBytes, "lumi-ai/generations");
                String cloudinaryUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");

                generation.setImageUrl(cloudinaryUrl);
                generation.setCloudinaryPublicId(publicId);
                generation.setSuccess(true);
                generation.setStatus("COMPLETED");

                // Deduct credits
                creditService.deductCredits(user, CREDITS_PER_GENERATION);

                return imageGenerationRepository.save(generation);
            } else {
                throw new RuntimeException("Prediction failed");
            }

        } catch (Exception e) {
            log.error("Replicate generation failed", e);
            generation.setSuccess(false);
            generation.setStatus("FAILED");
            generation.setErrorMessage(e.getMessage());
            imageGenerationRepository.save(generation);
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    private Map<String, Object> waitForPrediction(String predictionId) throws InterruptedException {
        int maxAttempts = 60; // 60 seconds max
        for (int i = 0; i < maxAttempts; i++) {
            Map<String, Object> result = replicateClient.getPrediction("Token " + replicateApiKey, predictionId);
            String status = (String) result.get("status");
            
            if ("succeeded".equals(status) || "failed".equals(status)) {
                return result;
            }
            
            Thread.sleep(1000); // Wait 1 second
        }
        throw new RuntimeException("Prediction timeout");
    }

    private byte[] downloadImage(String url) {
        // Implementation to download image from URL
        // Use RestTemplate or WebClient
        return new byte[0]; // Placeholder
    }

    @Transactional
    public void deleteGeneration(User user, Long generationId) {
        ImageGeneration generation = imageGenerationRepository.findById(generationId)
                .orElseThrow(() -> new BadRequestException("Generation not found"));

        if (!generation.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        try {
            if (generation.getCloudinaryPublicId() != null) {
                cloudinaryService.deleteImage(generation.getCloudinaryPublicId());
            }
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary", e);
        }

        imageGenerationRepository.delete(generation);
        log.info("Generation deleted: {}", generationId);
    }
}
