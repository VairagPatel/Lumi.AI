package in.LumiAI.api.security;

import in.LumiAI.api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        // ✅ Extract JWT token from Authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        // ✅ If username is valid and no authentication yet
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token, username)) {
                try {
                    // Load user from database to get roles
                    var userOptional = userRepository.findByEmail(username);
                    if (userOptional.isPresent()) {
                        var user = userOptional.get();
                        
                        // Convert roles to authorities
                        var authorities = user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                                .collect(Collectors.toList());
                        
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        new User(username, "", authorities),
                                        null,
                                        authorities
                                );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Set authentication in SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                } catch (Exception e) {
                    System.out.println("Error loading user: " + e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
