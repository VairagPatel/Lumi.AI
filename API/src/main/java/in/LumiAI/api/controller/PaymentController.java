package in.LumiAI.api.controller;

import in.LumiAI.api.dto.request.CreateOrderRequest;
import in.LumiAI.api.dto.request.VerifyPaymentRequest;
import in.LumiAI.api.dto.response.ApiResponse;
import in.LumiAI.api.dto.response.OrderResponse;
import in.LumiAI.api.dto.response.PageResponse;
import in.LumiAI.api.dto.response.PaymentResponse;
import in.LumiAI.api.service.PaymentService;
import in.LumiAI.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "Payment and credit purchase endpoints")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    @PostMapping("/create-order")
    @Operation(summary = "Create Razorpay order for credit purchase")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        
        log.info("Create order request for user: {}", authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        OrderResponse response = paymentService.createOrder(request, user);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment and add credits")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {
        
        log.info("Verify payment request for user: {}", authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        PaymentResponse response = paymentService.verifyPayment(request, user);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and credits added", response));
    }

    @PostMapping("/failure")
    @Operation(summary = "Handle payment failure")
    public ResponseEntity<ApiResponse<Void>> handlePaymentFailure(
            @RequestParam String orderId,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        
        log.info("Payment failure for user: {}, orderId: {}", authentication.getName(), orderId);
        var user = userService.findByEmail(authentication.getName());
        paymentService.handlePaymentFailure(orderId, reason, user);
        return ResponseEntity.ok(ApiResponse.success("Payment failure recorded", null));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's payment history")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getPaymentHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        log.info("Fetching payment history for user: {}", authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        Page<PaymentResponse> payments = paymentService.getUserPayments(user, page, size);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment details by ID")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
            @PathVariable Long paymentId,
            Authentication authentication) {
        
        log.info("Fetching payment {} for user: {}", paymentId, authentication.getName());
        var user = userService.findByEmail(authentication.getName());
        PaymentResponse payment = paymentService.getPaymentById(paymentId, user);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/status")
    @Operation(summary = "Check payment service availability")
    public ResponseEntity<ApiResponse<Object>> getPaymentStatus() {
        log.info("Checking payment service status");
        String credentialsTest = paymentService.testCredentials();
        
        boolean isAvailable = credentialsTest.startsWith("SUCCESS");
        
        return ResponseEntity.ok(ApiResponse.success("Payment service status", 
            new Object() {
                public final boolean available = isAvailable;
                public final String message = isAvailable ? 
                    "Payment service is available" : 
                    "Payment service is currently unavailable. Please contact support.";
                public final String details = credentialsTest;
            }));
    }

    @GetMapping("/test-credentials")
    @Operation(summary = "Test Razorpay credentials (for debugging - public endpoint)")
    public ResponseEntity<ApiResponse<String>> testCredentials() {
        log.info("Testing Razorpay credentials (public endpoint)");
        String result = paymentService.testCredentials();
        return ResponseEntity.ok(ApiResponse.success("Credentials test result", result));
    }
}
