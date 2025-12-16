package in.LumiAI.api.controller;

import in.LumiAI.api.dto.request.GoogleLoginRequest;
import in.LumiAI.api.dto.request.LoginRequest;
import in.LumiAI.api.dto.request.RefreshTokenRequest;
import in.LumiAI.api.dto.request.SignupRequest;
import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.dto.response.AuthResponse;
import in.LumiAI.api.service.AuthService;
import in.LumiAI.api.service.CreditService;
import in.LumiAI.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final CreditService creditService;

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received for email: {}", request.getEmail());
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/google")
    @Operation(summary = "Login with Google OAuth")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        log.info("Google login request received");
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Google login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Token refresh request received");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<ApiResponse<Void>> logout(Authentication authentication) {
        String email = authentication.getName();
        log.info("Logout request received for user: {}", email);
        authService.logout(email);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user information")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        var user = userService.findByEmail(email);

        AuthResponse.UserResponse userResponse = AuthResponse.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(java.util.stream.Collectors.toSet()))
                .build();

        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }
    
    @GetMapping("/credits")
    @Operation(summary = "Get current user's credit balance")
    public ResponseEntity<ApiResponse<Integer>> getUserCredits(Authentication authentication) {
        String email = authentication.getName();
        var user = userService.findByEmail(email);
        var credit = creditService.getCreditByUser(user);
        return ResponseEntity.ok(ApiResponse.success("Current credit balance", credit.getBalance()));
    }
}
