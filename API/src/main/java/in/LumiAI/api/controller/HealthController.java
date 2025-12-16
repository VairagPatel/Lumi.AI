package in.LumiAI.api.controller;

import in.LumiAI.api.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Slf4j
@Tag(name = "Health Check", description = "Application health monitoring endpoints")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check application health status")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Lumi AI API");
        health.put("version", "1.0.0");
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
