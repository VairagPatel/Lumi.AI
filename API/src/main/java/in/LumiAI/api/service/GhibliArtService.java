package in.LumiAI.api.service;

import in.LumiAI.api.client.StabilityAIClient;
import in.LumiAI.api.dto.TextToImageRequest;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class GhibliArtService {

    private final StabilityAIClient stabilityAIClient;
    private final GenerationHistoryService generationHistoryService;
    private final CreditService creditService;
    private final MockImageGenerationService mockImageGenerationService;
    private final PollinationsAIService pollinationsAIService;
    private final CloudinaryService cloudinaryService;
    private final PopularContentService popularContentService;

    @Value("${stability.api.key}")
    private String apiKey;
    
    @Value("${credits.per-generation:1}")
    private int creditsPerGeneration;
    
    @Value("${app.use-mock-generation:false}")
    private boolean useMockGeneration;
    
    @Value("${app.use-pollinations:true}")
    private boolean usePollinations;

    public byte[] createGhibliArt(MultipartFile image, String prompt, User user) {
        validateImage(image);
        
        // Check and deduct credits BEFORE generation starts
        if (!creditService.hasEnoughCredits(user, creditsPerGeneration)) {
            throw new BadRequestException("Insufficient credits. You need " + creditsPerGeneration + " credit(s) to generate an image.");
        }

        // Deduct credits immediately before generation
        creditService.deductCredits(user, creditsPerGeneration);
        log.info("Credits deducted for user: {}. Proceeding with image-to-image generation.", user.getEmail());

        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset = "anime";
        final double imageStrength = 0.35;

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            byte[] result;
            
            if (useMockGeneration) {
                log.info("Using mock image generation (mock mode enabled)");
                result = mockImageGenerationService.generateMockImage(finalPrompt, stylePreset);
            } else if (usePollinations) {
                log.info("Using Pollinations.ai for image-to-image (free API)");
                result = pollinationsAIService.generateImage(finalPrompt);
            } else {
                result = stabilityAIClient.generateImageFromImage(
                        "Bearer " + apiKey,
                        engineId,
                        image,
                        finalPrompt,
                        stylePreset,
                        imageStrength
                );
                log.info("Successfully generated image using Stability AI");
            }

            // Upload to Cloudinary
            String imageUrl = null;
            try {
                var uploadResult = cloudinaryService.uploadImage(result, "lumi-ai/image-to-image");
                imageUrl = (String) uploadResult.get("secure_url");
                log.info("Image uploaded to Cloudinary: {}", imageUrl);
            } catch (Exception e) {
                log.warn("Failed to upload to Cloudinary, continuing with byte array: {}", e.getMessage());
            }

            // Track popular content in Redis
            popularContentService.trackPromptUsage(prompt);
            popularContentService.trackStyleUsage(stylePreset);

            // Save to history with Cloudinary URL
            generationHistoryService.saveHistory(
                    user, finalPrompt, stylePreset, "IMAGE_TO_IMAGE", imageUrl, true, null
            );

            return result;
        } catch (Exception e) {
            log.error("Image-to-image generation failed after credits were deducted", e);
            
            // Refund credits if generation failed
            try {
                creditService.addCredits(user, creditsPerGeneration);
                log.info("Credits refunded to user: {} due to generation failure", user.getEmail());
            } catch (Exception refundError) {
                log.error("Failed to refund credits to user: {}", user.getEmail(), refundError);
            }
            
            generationHistoryService.saveHistory(
                    user, finalPrompt, stylePreset, "IMAGE_TO_IMAGE", null, false, e.getMessage()
            );
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    public byte[] createGhibliArtFromText(String prompt, String style, User user) {
        // Check and deduct credits BEFORE generation starts
        if (!creditService.hasEnoughCredits(user, creditsPerGeneration)) {
            throw new BadRequestException("Insufficient credits. You need " + creditsPerGeneration + " credit(s) to generate an image.");
        }

        // Deduct credits immediately before generation
        creditService.deductCredits(user, creditsPerGeneration);
        log.info("Credits deducted for user: {}. Proceeding with text-to-image generation.", user.getEmail());
        
        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset =
                (style == null || style.isBlank() || "general".equals(style))
                        ? "anime"
                        : style.replace("_", "-");

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            byte[] result;
            
            if (useMockGeneration) {
                log.info("Using mock image generation (mock mode enabled)");
                result = mockImageGenerationService.generateMockImage(finalPrompt, stylePreset);
            } else if (usePollinations) {
                log.info("Using Pollinations.ai (free API, no key required)");
                result = pollinationsAIService.generateImage(finalPrompt);
            } else {
                TextToImageRequest payload = new TextToImageRequest(finalPrompt, stylePreset);
                result = stabilityAIClient.generateImageFromText("Bearer " + apiKey, engineId, payload);
                log.info("Successfully generated image using Stability AI");
            }

            // Upload to Cloudinary
            String imageUrl = null;
            try {
                var uploadResult = cloudinaryService.uploadImage(result, "lumi-ai/text-to-image");
                imageUrl = (String) uploadResult.get("secure_url");
                log.info("Image uploaded to Cloudinary: {}", imageUrl);
            } catch (Exception e) {
                log.warn("Failed to upload to Cloudinary, continuing with byte array: {}", e.getMessage());
            }

            // Track popular content in Redis
            popularContentService.trackPromptUsage(prompt);
            popularContentService.trackStyleUsage(style);

            // Save to history with Cloudinary URL
            generationHistoryService.saveHistory(
                    user, finalPrompt, stylePreset, "TEXT_TO_IMAGE", imageUrl, true, null
            );

            return result;
        } catch (Exception e) {
            log.error("Text-to-image generation failed after credits were deducted", e);
            
            // Refund credits if generation failed
            try {
                creditService.addCredits(user, creditsPerGeneration);
                log.info("Credits refunded to user: {} due to generation failure", user.getEmail());
            } catch (Exception refundError) {
                log.error("Failed to refund credits to user: {}", user.getEmail(), refundError);
            }
            
            generationHistoryService.saveHistory(
                    user, finalPrompt, stylePreset, "TEXT_TO_IMAGE", null, false, e.getMessage()
            );
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    // Guest user methods (no credit checking)
    public byte[] createGhibliArtForGuest(MultipartFile image, String prompt) {
        validateImage(image);

        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset = "anime";
        final double imageStrength = 0.35;

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            byte[] result;
            
            if (useMockGeneration) {
                log.info("Using mock image generation for guest (mock mode enabled)");
                result = mockImageGenerationService.generateMockImage(finalPrompt, stylePreset);
            } else if (usePollinations) {
                log.info("Using Pollinations.ai for guest image-to-image (free API)");
                result = pollinationsAIService.generateImage(finalPrompt);
            } else {
                result = stabilityAIClient.generateImageFromImage(
                        "Bearer " + apiKey,
                        engineId,
                        image,
                        finalPrompt,
                        stylePreset,
                        imageStrength
                );
                log.info("Successfully generated image for guest using Stability AI");
            }

            log.info("Guest user image-to-image generation successful");
            return result;
        } catch (Exception e) {
            log.error("Guest image-to-image generation failed", e);
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    public byte[] createGhibliArtFromTextForGuest(String prompt, String style) {
        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset =
                (style == null || style.isBlank() || "general".equals(style))
                        ? "anime"
                        : style.replace("_", "-");

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            byte[] result;
            
            if (useMockGeneration) {
                log.info("Using mock image generation for guest (mock mode enabled)");
                result = mockImageGenerationService.generateMockImage(finalPrompt, stylePreset);
            } else if (usePollinations) {
                log.info("Using Pollinations.ai for guest (free API)");
                result = pollinationsAIService.generateImage(finalPrompt);
            } else {
                TextToImageRequest payload = new TextToImageRequest(finalPrompt, stylePreset);
                result = stabilityAIClient.generateImageFromText("Bearer " + apiKey, engineId, payload);
                log.info("Successfully generated image for guest using Stability AI");
            }

            log.info("Guest user text-to-image generation successful");
            return result;
        } catch (Exception e) {
            log.error("Guest text-to-image generation failed", e);
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }

    @Cacheable(value = "prompts", key = "'suggestion'")
    public String getPromptSuggestion() {
        // This can be enhanced with AI-based suggestions
        return "A magical forest with floating lanterns in Studio Ghibli style";
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image");
        }

        // Max 20MB
        if (image.getSize() > 20 * 1024 * 1024) {
            throw new BadRequestException("Image size must not exceed 20MB");
        }
    }

    private String getErrorBody(feign.FeignException e) {
        try {
            return e.contentUTF8();
        } catch (Exception ignore) {
            return "Unknown error";
        }
    }
}
