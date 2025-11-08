package in.bushansirgur.ghbliapi.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class PromptService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void checkKey() {
        System.out.println("🔑 Loaded Gemini API Key: " + geminiApiKey);
    }

    public String getPromptSuggestion() {
        String url = geminiApiUrl; // ✅ no ?key=

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", geminiApiKey); // ✅ send key as header

        String requestJson = """
            {
              "contents": [
                {
                  "role": "user",
                  "parts": [
                    { "text": "Generate one short creative prompt for AI art in Studio Ghibli style. Keep it under 15 words." }
                  ]
                }
              ]
            }
            """;

        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                Map.class
        );

        try {
            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.getBody().get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "✨ A magical Ghibli-style world with floating lanterns ✨"; // fallback
    }
}
