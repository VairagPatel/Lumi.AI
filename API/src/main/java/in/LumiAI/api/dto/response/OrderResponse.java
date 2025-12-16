package in.LumiAI.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private String orderId;
    private BigDecimal amount;
    private String currency;
    private Integer creditsAmount;
    private String razorpayKeyId;
}
