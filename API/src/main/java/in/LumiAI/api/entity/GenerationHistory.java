package in.LumiAI.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "generation_history", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"generationHistories", "refreshTokens", "password"})
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;

    @Column(length = 50)
    private String style;

    @Column(length = 20)
    private String generationType; // TEXT_TO_IMAGE, IMAGE_TO_IMAGE

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean success = true;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
