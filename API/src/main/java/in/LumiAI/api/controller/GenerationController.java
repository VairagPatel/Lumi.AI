package in.LumiAI.api.controller;

import in.LumiAI.api.dto.TextGenerationRequestDTO;
import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.dto.response.GenerationHistoryResponse;
import in.LumiAI.api.dto.response.PageResponse;
import in.LumiAI.api.service.GhibliArtService;
import in.LumiAI.api.service.GenerationHistoryService;
import in.LumiAI.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/generation")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Image Generation", description = "AI image generation endpoints")
public class GenerationController {

    private final GhibliArtService ghibliArtService;
    private final GenerationHistoryService generationHistoryService;
    private final UserService userService;

    @PostMapping(
            value = "/image-to-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.IMAGE_PNG_VALUE
    )
    @Operation(summary = "Generate Ghibli-style art from an image")
    public ResponseEntity<byte[]> generateFromImage(
            @RequestPart("image") @Parameter(description = "Input image file") MultipartFile image,
            @RequestPart(value = "prompt", required = false) @Parameter(description = "Optional prompt") String prompt,
            Authentication authentication) {
        
        // Handle both authenticated and guest users
        if (authentication != null && authentication.isAuthenticated()) {
            log.info("Image-to-image generation request from user: {}", authentication.getName());
            var user = userService.findByEmail(authentication.getName());
            byte[] imageBytes = ghibliArtService.createGhibliArt(image, prompt, user);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        } else {
            log.info("Image-to-image generation request from guest user");
            byte[] imageBytes = ghibliArtService.createGhibliArtForGuest(image, prompt);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        }
    }

    @PostMapping(
            value = "/text-to-image",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.IMAGE_PNG_VALUE
    )
    @Operation(summary = "Generate Ghibli-style art from text prompt")
    public ResponseEntity<byte[]> generateFromText(
            @Valid @RequestBody TextGenerationRequestDTO request,
            Authentication authentication) {
        
        // Handle both authenticated and guest users
        if (authentication != null && authentication.isAuthenticated()) {
            log.info("Text-to-image generation request from user: {}", authentication.getName());
            var user = userService.findByEmail(authentication.getName());
            byte[] imageBytes = ghibliArtService.createGhibliArtFromText(
                    request.getPrompt(), request.getStyle(), user
            );
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        } else {
            log.info("Text-to-image generation request from guest user");
            byte[] imageBytes = ghibliArtService.createGhibliArtFromTextForGuest(
                    request.getPrompt(), request.getStyle()
            );
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(imageBytes);
        }
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's generation history with pagination")
    public ResponseEntity<ApiResponse<PageResponse<GenerationHistoryResponse>>> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        
        log.info("Fetching generation history for user: {}", authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        PageResponse<GenerationHistoryResponse> history = 
                generationHistoryService.getUserHistory(user, page, size, sortBy);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get user's generation statistics")
    public ResponseEntity<ApiResponse<Long>> getStats(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        
        log.info("Fetching generation stats for user: {}", authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        Long count = generationHistoryService.getUserSuccessfulGenerationsCount(user);
        return ResponseEntity.ok(ApiResponse.success("Total successful generations", count));
    }
}
