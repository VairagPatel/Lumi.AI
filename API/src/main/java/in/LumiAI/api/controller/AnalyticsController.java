package in.LumiAI.api.controller;

import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.service.PopularContentService;
import in.LumiAI.api.service.RateLimitService;
import in.LumiAI.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analytics", description = "Analytics and popular content endpoints")
public class AnalyticsController {

    private final PopularContentService popularContentService;
    private final RateLimitService rateLimitService;
    private final UserService userService;

    @GetMapping("/popular/prompts")
    @Operation(summary = "Get top popular prompts")
    public ResponseEntity<ApiResponse<Set<String>>> getPopularPrompts(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching top {} popular prompts", limit);
        Set<String> prompts = popularContentService.getTopPrompts(limit);
        return ResponseEntity.ok(ApiResponse.success("Popular prompts retrieved", prompts));
    }

    @GetMapping("/popular/styles")
    @Operation(summary = "Get top popular styles")
    public ResponseEntity<ApiResponse<Set<String>>> getPopularStyles(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching top {} popular styles", limit);
        Set<String> styles = popularContentService.getTopStyles(limit);
        return ResponseEntity.ok(ApiResponse.success("Popular styles retrieved", styles));
    }

    @GetMapping("/rate-limit")
    @Operation(summary = "Get current user's rate limit info")
    public ResponseEntity<ApiResponse<RateLimitService.RateLimitInfo>> getRateLimitInfo(
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }

        var user = userService.findByEmail(authentication.getName());
        RateLimitService.RateLimitInfo info = rateLimitService.getRateLimitInfo(user.getId());
        
        return ResponseEntity.ok(ApiResponse.success("Rate limit info retrieved", info));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending content (prompts and styles)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrendingContent() {
        log.info("Fetching trending content");
        
        Set<String> topPrompts = popularContentService.getTopPrompts(5);
        Set<String> topStyles = popularContentService.getTopStyles(5);
        
        Map<String, Object> trending = Map.of(
                "prompts", topPrompts,
                "styles", topStyles
        );
        
        return ResponseEntity.ok(ApiResponse.success("Trending content retrieved", trending));
    }
}
