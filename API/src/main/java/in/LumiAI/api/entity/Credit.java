package in.LumiAI.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "credits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"generationHistories", "refreshTokens", "password"})
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer balance = 15; // Default 15 free credits

    @Column(nullable = false)
    @Builder.Default
    private Integer totalEarned = 15;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalSpent = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void deductCredits(int amount) {
        if (balance < amount) {
            throw new IllegalStateException("Insufficient credits");
        }
        balance -= amount;
        totalSpent += amount;
    }

    public void addCredits(int amount) {
        balance += amount;
        totalEarned += amount;
    }
}
