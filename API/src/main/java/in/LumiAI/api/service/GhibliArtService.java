package in.bushansirgur.ghbliapi.service;

import in.bushansirgur.ghbliapi.client.StabilityAIClient;
import in.bushansirgur.ghbliapi.dto.TextToImageRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GhibliArtService {

    private final StabilityAIClient stabilityAIClient;
    private final String apiKey;

    public GhibliArtService(StabilityAIClient stabilityAIClient, @Value("${stability.api.key}") String apiKey) {
        this.stabilityAIClient = stabilityAIClient;
        this.apiKey = apiKey;
    }

    public byte[] createGhibliArt(MultipartFile image, String prompt) {
        String finalPrompt = prompt+", in the beautiful, detailed anime style of studio ghibli.";
        String engineId = "stable-diffusion-xl-1024-v1-0";
        String stylePreset = "anime";

        return stabilityAIClient.generateImageFromImage(
                "Bearer " + apiKey,
                engineId,
                image,
                finalPrompt,
                stylePreset
        );
    }

    public byte[] createGhibliArtFromText(String prompt, String style) {
        String finalPrompt = prompt + ", in the beautiful, detailed anime style of studio ghibli.";
        String engineId = "stable-diffusion-xl-1024-v1-0";

        // ✅ FIX: This code checks if 'style' is null BEFORE using it.
        String stylePreset;
        if (style == null || style.trim().isEmpty() || "general".equals(style)) {
            stylePreset = "anime"; // Default to "anime" if style is not provided or is "general"
        } else {
            stylePreset = style.replace("_", "-");
        }

        TextToImageRequest requestPayload = new TextToImageRequest(finalPrompt, stylePreset);

        return stabilityAIClient.generateImageFromText(
                "Bearer " + apiKey,
                engineId,
                requestPayload
        );
    }

}
