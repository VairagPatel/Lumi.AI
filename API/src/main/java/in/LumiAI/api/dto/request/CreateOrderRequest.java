package in.LumiAI.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Credits amount is required")
    @Min(value = 1, message = "Credits amount must be at least 1")
    private Integer creditsAmount;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Integer amount; // Amount in INR (paise will be calculated in service)
}
