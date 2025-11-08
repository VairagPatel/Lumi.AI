package in.LumiAI.api.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import in.LumiAI.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 🗂️ In-memory user store (replace later with DB)
    private final Map<String, String> users = new ConcurrentHashMap<>();

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // ✅ Signup API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (users.containsKey(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }

        users.put(username, passwordEncoder.encode(password));
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ✅ Login API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        String storedPassword = users.get(username);
        if (storedPassword == null || !passwordEncoder.matches(password, storedPassword)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(username);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", username
        ));
    }

    // ✅ Google Login API
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idTokenString = request.get("token"); // frontend sends Google ID token

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    JacksonFactory.getDefaultInstance()
            ).setAudience(Collections.singletonList(googleClientId)) // verify client ID
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // Auto-register user if not already in store
                users.putIfAbsent(email, passwordEncoder.encode("google_oauth_user"));

                // ✅ generate our own JWT
                String jwt = jwtUtil.generateToken(email);

                return ResponseEntity.ok(Map.of(
                        "token", jwt,
                        "email", email,
                        "name", name
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Google token"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Google verification failed",
                    "details", e.getMessage()
            ));
        }
    }

    // ✅ Test protected API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        return ResponseEntity.ok(Map.of("username", username));
    }
}
