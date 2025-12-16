package in.LumiAI.api.repository;

import in.LumiAI.api.entity.ImageGeneration;
import in.LumiAI.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ImageGenerationRepository extends JpaRepository<ImageGeneration, Long> {

    Page<ImageGeneration> findByUser(User user, Pageable pageable);

    Page<ImageGeneration> findByUserAndSuccess(User user, Boolean success, Pageable pageable);

    @Query("SELECT ig FROM ImageGeneration ig WHERE ig.user = :user AND ig.createdAt BETWEEN :startDate AND :endDate")
    Page<ImageGeneration> findByUserAndDateRange(
        @Param("user") User user,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    @Query("SELECT COUNT(ig) FROM ImageGeneration ig WHERE ig.user = :user AND ig.success = true")
    Long countSuccessfulGenerationsByUser(@Param("user") User user);

    // Admin queries
    @Query("SELECT COUNT(ig) FROM ImageGeneration ig WHERE ig.success = true")
    Long countTotalSuccessfulGenerations();

    @Query("SELECT ig.model, COUNT(ig) FROM ImageGeneration ig WHERE ig.success = true GROUP BY ig.model ORDER BY COUNT(ig) DESC")
    List<Object[]> findMostUsedModels();

    @Query("SELECT DATE(ig.createdAt), COUNT(ig) FROM ImageGeneration ig WHERE ig.createdAt >= :startDate GROUP BY DATE(ig.createdAt) ORDER BY DATE(ig.createdAt)")
    List<Object[]> findGenerationsByDate(@Param("startDate") LocalDateTime startDate);
}
