package in.LumiAI.api.repository;

import in.LumiAI.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.enabled = true")
    Page<User> findAllActiveUsers(Pageable pageable);
}
