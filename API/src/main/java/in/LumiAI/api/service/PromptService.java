package in.LumiAI.api.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PromptService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void checkKey() {
        log.info("🔑 Loaded Gemini API Key");
    }

    private final String[] fallbackPrompts = {
        "A serene Japanese garden with cherry blossoms and koi pond",
        "A magical forest with glowing mushrooms and fireflies",
        "A cozy cottage on a hillside overlooking the ocean at sunset",
        "A floating castle in the clouds with waterfalls",
        "A peaceful village street with traditional lanterns at dusk",
        "A mystical library filled with ancient books and soft light",
        "A whimsical tea party in an enchanted garden",
        "A train journey through colorful autumn landscapes",
        "A hidden waterfall in a lush green valley",
        "A starry night sky over a quiet mountain lake",
        "A young girl flying on a broomstick over rolling hills",
        "A giant tree house connected by rope bridges",
        "A steampunk airship sailing through puffy white clouds",
        "A cat bus waiting at a forest bus stop",
        "A magical bathhouse with spirits and dragons",
        "A moving castle walking across a meadow",
        "A forest spirit dancing in moonlight",
        "A cozy bakery with floating bread and pastries",
        "A crystal cave filled with glowing gems",
        "A windmill on a hill surrounded by wildflowers",
        "A dragon sleeping in a field of sunflowers",
        "A magical door hidden in an ancient tree trunk",
        "A flying fish swimming through the sky",
        "A village built inside a giant mushroom",
        "A lighthouse on a cliff during a storm",
        "A garden where flowers sing in harmony",
        "A clockwork city with gears and steam",
        "A phoenix rising from autumn leaves",
        "A mermaid's palace under the sea",
        "A wizard's tower surrounded by floating books"
    };

    // Removed @Cacheable to get unique prompts each time
    public String getPromptSuggestion() {
        // Try Gemini API first
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            // Add randomness and variety to the prompt request
            String[] promptVariations = {
                "Generate a unique, creative prompt for AI art in Studio Ghibli style. Focus on magical landscapes. Keep it under 15 words.",
                "Create an original prompt for Studio Ghibli-style AI art featuring whimsical characters or creatures. Maximum 15 words.",
                "Generate a fresh, imaginative prompt for AI art in Ghibli style with nature themes. Keep it concise, under 15 words.",
                "Create a unique prompt for Studio Ghibli-style AI art featuring magical or mystical elements. Maximum 15 words.",
                "Generate an original, creative prompt for AI art in Ghibli style with dreamy atmospheres. Keep it under 15 words.",
                "Create a fresh prompt for Studio Ghibli-style AI art featuring cozy or peaceful scenes. Maximum 15 words.",
                "Generate a unique prompt for AI art in Ghibli style with fantasy or adventure themes. Keep it concise, under 15 words.",
                "Create an imaginative prompt for Studio Ghibli-style AI art featuring seasonal or weather elements. Maximum 15 words."
            };

            // Randomly select a prompt variation for more diversity
            int randomVariation = (int) (Math.random() * promptVariations.length);
            String selectedPrompt = promptVariations[randomVariation];

            String requestJson = String.format("""
                {
                  "contents": [
                    {
                      "role": "user",
                      "parts": [
                        { "text": "%s" }
                      ]
                    }
                  ],
                  "generationConfig": {
                    "temperature": 0.9,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 50
                  }
                }
                """, selectedPrompt);

            HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    geminiApiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.getBody().get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    String suggestion = parts.get(0).get("text").trim();
                    // Clean up the response (remove quotes, extra formatting)
                    suggestion = suggestion.replaceAll("^\"|\"$", "").trim();
                    log.info("✅ Gemini API suggestion: {}", suggestion);
                    return suggestion;
                }
            }
        } catch (Exception e) {
            log.warn("⚠️ Gemini API failed, using fallback: {}", e.getMessage());
        }

        // Return random fallback prompt
        int randomIndex = (int) (Math.random() * fallbackPrompts.length);
        String fallback = fallbackPrompts[randomIndex];
        log.info("📝 Using fallback prompt: {}", fallback);
        return fallback;
    }

    public String enhancePrompt(String originalPrompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", geminiApiKey);

        String requestJson = String.format("""
            {
              "contents": [
                {
                  "role": "user",
                  "parts": [
                    { "text": "Enhance this prompt for AI image generation in Studio Ghibli style. Add vivid details, colors, lighting, and atmosphere while keeping the core idea. Make it more descriptive and artistic. Original prompt: %s. Return only the enhanced prompt, nothing else." }
                  ]
                }
              ],
              "generationConfig": {
                "temperature": 0.8,
                "topK": 40,
                "topP": 0.9,
                "maxOutputTokens": 100
              }
            }
            """, originalPrompt);

        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    geminiApiUrl,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.getBody().get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    String enhanced = parts.get(0).get("text").trim();
                    // Clean up the response
                    enhanced = enhanced.replaceAll("^\"|\"$", "").trim();
                    log.info("✅ Enhanced prompt: {}", enhanced);
                    return enhanced;
                }
            }
        } catch (Exception e) {
            log.error("Failed to enhance prompt", e);
        }

        return originalPrompt; // Return original if enhancement fails
    }
}
