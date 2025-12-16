package in.LumiAI.api.service;

import in.LumiAI.api.entity.Role;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.BadRequestException;
import in.LumiAI.api.exception.ResourceNotFoundException;
import in.LumiAI.api.repository.RoleRepository;
import in.LumiAI.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CreditService creditService;

    @Transactional
    public User createUser(String username, String email, String password, String fullName) {
        log.info("Creating new user with email: {}", email);

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists");
        }

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username already exists");
        }

        Role userRole = roleRepository.findByName(Role.RoleType.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .provider("LOCAL")
                .enabled(true)
                .accountNonLocked(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        
        // Create credit account for new user
        creditService.createCreditAccount(savedUser);
        log.info("Created credit account for user: {}", savedUser.getEmail());
        
        return savedUser;
    }

    @Transactional
    public User createOrUpdateGoogleUser(String email, String name, String googleId) {
        log.info("Creating or updating Google user: {}", email);

        // First check if user exists by Google provider and ID
        Optional<User> existingGoogleUser = userRepository.findByProviderAndProviderId("GOOGLE", googleId);
        if (existingGoogleUser.isPresent()) {
            log.info("Found existing Google user: {}", email);
            return existingGoogleUser.get();
        }

        // Check if user exists by email (could be regular signup user)
        Optional<User> existingEmailUser = userRepository.findByEmail(email);
        if (existingEmailUser.isPresent()) {
            User user = existingEmailUser.get();
            log.info("Found existing user by email, updating with Google info: {}", email);
            
            // Update existing user with Google provider info
            user.setProvider("GOOGLE");
            user.setProviderId(googleId);
            if (name != null && !name.trim().isEmpty()) {
                user.setFullName(name);
            }
            
            return userRepository.save(user);
        }

        // Create new Google user
        log.info("Creating new Google user: {}", email);
        Role userRole = roleRepository.findByName(Role.RoleType.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User newUser = User.builder()
                .username(email.split("@")[0])
                .email(email)
                .password(passwordEncoder.encode("GOOGLE_OAUTH_USER"))
                .fullName(name)
                .provider("GOOGLE")
                .providerId(googleId)
                .enabled(true)
                .accountNonLocked(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(newUser);
        
        // Create credit account for new Google user
        creditService.createCreditAccount(savedUser);
        log.info("Created credit account for Google user: {}", savedUser.getEmail());
        
        return savedUser;
    }

    // @org.springframework.cache.annotation.Cacheable(value = "users", key = "#email") // Disabled due to lazy loading issues
    public User findByEmail(String email) {
        log.debug("Fetching user from database: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @org.springframework.cache.annotation.Cacheable(value = "users", key = "#id")
    public User findById(Long id) {
        log.debug("Fetching user from database by id: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @org.springframework.cache.annotation.CacheEvict(value = "users", key = "#user.email")
    public void evictUserCache(User user) {
        log.debug("Evicting user cache for: {}", user.getEmail());
    }
}
