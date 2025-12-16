package in.LumiAI.api.service;

import in.LumiAI.api.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Free AI Image Generation using Pollinations.ai
 * No API key required!
 */
@Service
@Slf4j
public class PollinationsAIService {

    private static final String POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";

    /**
     * Generate image using Pollinations.ai (completely free, no API key needed)
     */
    public byte[] generateImage(String prompt) {
        try {
            log.info("Generating image with Pollinations.ai (free API)");

            // Encode the prompt for URL
            String encodedPrompt = URLEncoder.encode(prompt, StandardCharsets.UTF_8);
            
            // Build URL with parameters
            String imageUrl = POLLINATIONS_URL + encodedPrompt 
                    + "?width=1024&height=1024&nologo=true&enhance=true";

            log.info("Fetching image from: {}", imageUrl);

            // Download the image
            URL url = new URL(imageUrl);
            BufferedImage image = ImageIO.read(url);

            if (image == null) {
                throw new BadRequestException("Failed to generate image");
            }

            // Convert to PNG bytes
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);

            log.info("Successfully generated image using Pollinations.ai");
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Pollinations.ai generation failed", e);
            throw new BadRequestException("Image generation failed: " + e.getMessage());
        }
    }
}
