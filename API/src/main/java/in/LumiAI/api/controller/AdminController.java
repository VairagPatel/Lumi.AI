package in.LumiAI.api.controller;

import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.entity.Credit;
import in.LumiAI.api.repository.ImageGenerationRepository;
import in.LumiAI.api.repository.UserRepository;
import in.LumiAI.api.service.CreditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin", description = "Admin management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ImageGenerationRepository imageGenerationRepository;
    private final CreditService creditService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        log.info("Fetching admin dashboard statistics");

        Map<String, Object> stats = new HashMap<>();

        // Total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        // Total images generated
        long totalImages = imageGenerationRepository.countTotalSuccessfulGenerations();
        stats.put("totalImages", totalImages);

        // Most used models
        List<Object[]> mostUsedModels = imageGenerationRepository.findMostUsedModels();
        Map<String, Long> modelStats = new HashMap<>();
        for (Object[] row : mostUsedModels) {
            modelStats.put((String) row[0], (Long) row[1]);
        }
        stats.put("mostUsedModels", modelStats);

        // Recent generations (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> recentGenerations = imageGenerationRepository.findGenerationsByDate(sevenDaysAgo);
        stats.put("recentGenerations", recentGenerations);

        // Active users (users with generations in last 7 days)
        stats.put("activeUsers", recentGenerations.size());

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PostMapping("/users/{userId}/credits")
    @Operation(summary = "Add credits to user account")
    public ResponseEntity<ApiResponse<Credit>> addCreditsToUser(
            @PathVariable Long userId,
            @RequestParam Integer amount) {
        
        log.info("Admin adding {} credits to user ID: {}", amount, userId);

        if (amount <= 0) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Amount must be positive"));
        }

        Credit credit = creditService.addCreditsByUserId(userId, amount);
        return ResponseEntity.ok(ApiResponse.success("Credits added successfully", credit));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        log.info("Fetching all users");

        var users = userRepository.findAll();
        var userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("enabled", user.getEnabled());
            userMap.put("createdAt", user.getCreatedAt());
            
            // Get credit balance
            try {
                Credit credit = creditService.getCreditByUserId(user.getId());
                userMap.put("creditBalance", credit.getBalance());
            } catch (Exception e) {
                userMap.put("creditBalance", 0);
            }
            
            return userMap;
        }).toList();

        return ResponseEntity.ok(ApiResponse.success(userList));
    }

    @GetMapping("/generations/stats")
    @Operation(summary = "Get generation statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGenerationStats() {
        log.info("Fetching generation statistics");

        Map<String, Object> stats = new HashMap<>();

        // Total generations
        long totalGenerations = imageGenerationRepository.count();
        stats.put("totalGenerations", totalGenerations);

        // Successful generations
        long successfulGenerations = imageGenerationRepository.countTotalSuccessfulGenerations();
        stats.put("successfulGenerations", successfulGenerations);

        // Success rate
        double successRate = totalGenerations > 0 
                ? (double) successfulGenerations / totalGenerations * 100 
                : 0;
        stats.put("successRate", String.format("%.2f%%", successRate));

        // Most used models
        List<Object[]> mostUsedModels = imageGenerationRepository.findMostUsedModels();
        stats.put("mostUsedModels", mostUsedModels);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        log.info("Admin deleting user ID: {}", userId);

        userRepository.deleteById(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
