package in.bushansirgur.ghbliapi.controller;

import in.bushansirgur.ghbliapi.service.GoogleAuthService;
import in.bushansirgur.ghbliapi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173") // adjust for your frontend
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody String idTokenString) {
        try {
            // ✅ verify Google token
            GoogleIdToken.Payload payload = googleAuthService.verifyGoogleToken(idTokenString);

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // ✅ Generate JWT for our app
            String jwt = jwtUtil.generateToken(email);

            return ResponseEntity.ok().body(
                    new AuthResponse(jwt, email, name)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid Google ID Token: " + e.getMessage());
        }
    }

    // Inner class for JSON response
    record AuthResponse(String token, String email, String name) {}
}
