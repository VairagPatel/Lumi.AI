package in.LumiAI.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerationHistoryResponse {

    private Long id;
    private String prompt;
    private String style;
    private String generationType;
    private String imageUrl;
    private Boolean success;
    private String errorMessage;
    private LocalDateTime createdAt;
}
