package in.LumiAI.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageGenerationRequest {

    @NotNull(message = "Image file is required")
    private MultipartFile image;

    @Size(max = 1000, message = "Prompt must not exceed 1000 characters")
    private String prompt;

    private String style;
}
