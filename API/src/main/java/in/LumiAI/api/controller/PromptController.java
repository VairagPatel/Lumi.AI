package in.LumiAI.api.controller;

import in.LumiAI.api.service.PromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prompt")
public class PromptController {

    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @GetMapping("/suggest")
    public ResponseEntity<String> getPromptSuggestion() {
        String suggestion = promptService.getPromptSuggestion();
        return ResponseEntity.ok(suggestion);
    }
}
