package in.LumiAI.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

@Service
@Slf4j
public class MockImageGenerationService {

    /**
     * Generates a mock image with text overlay for testing purposes
     * This is used when the actual AI API is unavailable or for development
     */
    public byte[] generateMockImage(String prompt, String style) {
        try {
            // Create a 1024x1024 image
            BufferedImage image = new BufferedImage(1024, 1024, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = image.createGraphics();

            // Set rendering hints for better quality
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            // Generate a gradient background based on style
            Color color1 = getColorForStyle(style, true);
            Color color2 = getColorForStyle(style, false);
            GradientPaint gradient = new GradientPaint(0, 0, color1, 1024, 1024, color2);
            g2d.setPaint(gradient);
            g2d.fillRect(0, 0, 1024, 1024);

            // Add some decorative elements
            Random random = new Random(prompt.hashCode());
            g2d.setColor(new Color(255, 255, 255, 50));
            for (int i = 0; i < 20; i++) {
                int x = random.nextInt(1024);
                int y = random.nextInt(1024);
                int size = random.nextInt(100) + 50;
                g2d.fillOval(x, y, size, size);
            }

            // Add text overlay
            g2d.setColor(Color.WHITE);
            g2d.setFont(new Font("Arial", Font.BOLD, 40));
            
            // Draw "LumiAI Generated" at top
            String title = "LumiAI Generated";
            FontMetrics fm = g2d.getFontMetrics();
            int titleWidth = fm.stringWidth(title);
            g2d.drawString(title, (1024 - titleWidth) / 2, 100);

            // Draw prompt (wrapped)
            g2d.setFont(new Font("Arial", Font.PLAIN, 24));
            drawWrappedText(g2d, prompt, 50, 512, 924);

            // Draw style at bottom
            g2d.setFont(new Font("Arial", Font.ITALIC, 20));
            String styleText = "Style: " + (style != null ? style : "general");
            int styleWidth = g2d.getFontMetrics().stringWidth(styleText);
            g2d.drawString(styleText, (1024 - styleWidth) / 2, 950);

            g2d.dispose();

            // Convert to PNG bytes
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            
            log.info("Generated mock image for prompt: {}", prompt);
            return baos.toByteArray();

        } catch (IOException e) {
            log.error("Failed to generate mock image", e);
            throw new RuntimeException("Failed to generate mock image", e);
        }
    }

    private Color getColorForStyle(String style, boolean isPrimary) {
        if (style == null || style.equals("general") || style.equals("anime")) {
            return isPrimary ? new Color(135, 206, 250) : new Color(255, 182, 193);
        }
        
        switch (style.toLowerCase()) {
            case "fantasy":
                return isPrimary ? new Color(138, 43, 226) : new Color(255, 105, 180);
            case "neon":
                return isPrimary ? new Color(0, 255, 255) : new Color(255, 0, 255);
            case "cinematic":
                return isPrimary ? new Color(25, 25, 112) : new Color(139, 69, 19);
            case "photographic":
                return isPrimary ? new Color(105, 105, 105) : new Color(192, 192, 192);
            default:
                return isPrimary ? new Color(100, 149, 237) : new Color(255, 228, 181);
        }
    }

    private void drawWrappedText(Graphics2D g2d, String text, int x, int y, int maxWidth) {
        FontMetrics fm = g2d.getFontMetrics();
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        int lineY = y;

        for (String word : words) {
            String testLine = line.length() == 0 ? word : line + " " + word;
            int testWidth = fm.stringWidth(testLine);

            if (testWidth > maxWidth && line.length() > 0) {
                g2d.drawString(line.toString(), x, lineY);
                line = new StringBuilder(word);
                lineY += fm.getHeight();
            } else {
                line = new StringBuilder(testLine);
            }
        }

        if (line.length() > 0) {
            g2d.drawString(line.toString(), x, lineY);
        }
    }
}
