package in.LumiAI.api.controller;

import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.service.PromptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prompt")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Prompt Suggestions", description = "AI-powered prompt suggestion endpoints")
public class PromptController {

    private final PromptService promptService;

    @GetMapping("/suggest")
    @Operation(summary = "Get AI-generated prompt suggestion")
    public ResponseEntity<ApiResponse<String>> getPromptSuggestion() {
        log.info("Prompt suggestion requested");
        String suggestion = promptService.getPromptSuggestion();
        return ResponseEntity.ok(ApiResponse.success("Prompt suggestion generated", suggestion));
    }
}
