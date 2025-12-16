package in.LumiAI.api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import in.LumiAI.api.dto.request.GoogleLoginRequest;
import in.LumiAI.api.dto.request.LoginRequest;
import in.LumiAI.api.dto.request.RefreshTokenRequest;
import in.LumiAI.api.dto.request.SignupRequest;
import in.LumiAI.api.dto.response.AuthResponse;
import in.LumiAI.api.entity.RefreshToken;
import in.LumiAI.api.entity.Role;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.UnauthorizedException;
import in.LumiAI.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final GoogleAuthService googleAuthService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("User signup attempt: {}", request.getEmail());

        User user = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getFullName()
        );

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt: {}", request.getEmail());

        User user = userService.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.getEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        if (!user.getAccountNonLocked()) {
            throw new UnauthorizedException("Account is locked");
        }

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        log.info("Google login attempt");

        try {
            GoogleIdToken.Payload payload = googleAuthService.verifyGoogleToken(request.getToken());

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject();

            User user = userService.createOrUpdateGoogleUser(email, name, googleId);

            return generateAuthResponse(user);
        } catch (Exception e) {
            log.error("Google authentication failed", e);
            throw new UnauthorizedException("Google authentication failed: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Token refresh attempt");

        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken());
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs / 1000)
                .user(buildUserResponse(user))
                .build();
    }

    @Transactional
    public void logout(String email) {
        log.info("User logout: {}", email);
        User user = userService.findByEmail(email);
        refreshTokenService.deleteByUser(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtUtil.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtExpirationMs / 1000)
                .user(buildUserResponse(user))
                .build();
    }

    private AuthResponse.UserResponse buildUserResponse(User user) {
        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet()))
                .build();
    }
}
