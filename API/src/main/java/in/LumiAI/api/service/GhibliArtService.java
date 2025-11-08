// in.LumiAI.api.service.GhibliArtService
package in.LumiAI.api.service;

import in.LumiAI.api.client.StabilityAIClient;
import in.LumiAI.api.dto.TextToImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GhibliArtService {

    private static final Logger log = LoggerFactory.getLogger(GhibliArtService.class);

    private final StabilityAIClient stabilityAIClient;
    private final String apiKey;

    public GhibliArtService(StabilityAIClient stabilityAIClient,
                            @Value("${stability.api.key}") String apiKey) {
        this.stabilityAIClient = stabilityAIClient;
        this.apiKey = apiKey;
    }

    public byte[] createGhibliArt(MultipartFile image, String prompt) {
        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset = "anime";
        final double imageStrength = 0.35; // typical value 0.0–1.0

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            return stabilityAIClient.generateImageFromImage(
                    "Bearer " + apiKey,
                    engineId,

                    // 👇 now sent as init_image (correct name)
                    image,

                    // 👇 prompt goes in text_prompts[0][text]
                    finalPrompt,

                    stylePreset,
                    imageStrength
            );
        } catch (feign.FeignException e) {
            String body;
            try { body = e.contentUTF8(); } catch (Exception ignore) { body = "<no-body>"; }
            log.error("createGhibliArt upstream error: status={}, body={}", e.status(), body, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stability error: " + body);
        } catch (Exception e) {
            log.error("createGhibliArt failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Generation failed");
        }
    }

    public byte[] createGhibliArtFromText(String prompt, String style) {
        final String engineId = "stable-diffusion-xl-1024-v1-0";
        final String stylePreset =
                (style == null || style.isBlank() || "general".equals(style))
                        ? "anime"
                        : style.replace("_", "-");

        final String finalPrompt = ((prompt == null ? "" : prompt)
                + ", in the beautiful, detailed anime style of studio ghibli.").trim();

        try {
            TextToImageRequest payload = new TextToImageRequest(finalPrompt, stylePreset);
            return stabilityAIClient.generateImageFromText("Bearer " + apiKey, engineId, payload);
        } catch (feign.FeignException e) {
            String body;
            try { body = e.contentUTF8(); } catch (Exception ignore) { body = "<no-body>"; }
            log.error("createGhibliArtFromText upstream error: status={}, body={}", e.status(), body, e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stability error: " + body);
        } catch (Exception e) {
            log.error("createGhibliArtFromText failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Generation failed");
        }
    }
}
