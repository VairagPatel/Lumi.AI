package in.LumiAI.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_generations", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_model", columnList = "model")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"generationHistories", "refreshTokens", "password"})
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Column(columnDefinition = "TEXT")
    private String enhancedPrompt;

    @Column(length = 50)
    private String style;

    @Column(length = 50, nullable = false)
    private String model; // STABILITY_AI, REPLICATE, GEMINI

    @Column(length = 20, nullable = false)
    private String generationType; // TEXT_TO_IMAGE, IMAGE_TO_IMAGE

    @Column(columnDefinition = "TEXT")
    private String imageUrl; // Cloudinary URL

    @Column(length = 100)
    private String cloudinaryPublicId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean success = true;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(nullable = false)
    @Builder.Default
    private Integer creditsUsed = 10;

    @Column(length = 20)
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
