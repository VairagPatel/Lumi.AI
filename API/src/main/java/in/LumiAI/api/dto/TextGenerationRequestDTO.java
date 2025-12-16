package in.LumiAI.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextGenerationRequestDTO {

    @NotBlank(message = "Prompt is required")
    @Size(max = 1000, message = "Prompt must not exceed 1000 characters")
    private String prompt;

    private String style;
}
