package in.LumiAI.api.repository;

import in.LumiAI.api.entity.GenerationHistory;
import in.LumiAI.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface GenerationHistoryRepository extends JpaRepository<GenerationHistory, Long> {

    Page<GenerationHistory> findByUser(User user, Pageable pageable);

    Page<GenerationHistory> findByUserAndSuccess(User user, Boolean success, Pageable pageable);

    @Query("SELECT gh FROM GenerationHistory gh WHERE gh.user = :user AND gh.createdAt BETWEEN :startDate AND :endDate")
    Page<GenerationHistory> findByUserAndDateRange(
        @Param("user") User user,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    @Query("SELECT COUNT(gh) FROM GenerationHistory gh WHERE gh.user = :user AND gh.success = true")
    Long countSuccessfulGenerationsByUser(@Param("user") User user);
}
