package in.LumiAI.api.util;

import in.LumiAI.api.entity.Role;
import in.LumiAI.api.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        log.info("Initializing default roles...");

        for (Role.RoleType roleType : Role.RoleType.values()) {
            if (roleRepository.findByName(roleType).isEmpty()) {
                Role role = Role.builder()
                        .name(roleType)
                        .build();
                roleRepository.save(role);
                log.info("Created role: {}", roleType);
            }
        }

        log.info("Role initialization completed");
    }
}
