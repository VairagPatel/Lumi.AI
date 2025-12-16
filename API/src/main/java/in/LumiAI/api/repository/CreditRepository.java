package in.LumiAI.api.repository;

import in.LumiAI.api.entity.Credit;
import in.LumiAI.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditRepository extends JpaRepository<Credit, Long> {

    Optional<Credit> findByUser(User user);

    Optional<Credit> findByUserId(Long userId);
}
