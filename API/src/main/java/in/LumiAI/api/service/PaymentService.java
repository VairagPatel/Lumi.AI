package in.LumiAI.api.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import in.LumiAI.api.dto.request.CreateOrderRequest;
import in.LumiAI.api.dto.request.VerifyPaymentRequest;
import in.LumiAI.api.dto.response.OrderResponse;
import in.LumiAI.api.dto.response.PaymentResponse;
import in.LumiAI.api.entity.Payment;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.BadRequestException;
import in.LumiAI.api.exception.ResourceNotFoundException;
import in.LumiAI.api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CreditService creditService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User user) {
        try {
            // Validate credentials before attempting to create order
            if (razorpayKeyId == null || razorpayKeyId.isEmpty() || 
                razorpayKeyId.contains("placeholder") || razorpayKeyId.equals("rzp_test_your_key_id")) {
                throw new BadRequestException("Payment service is not configured. Please contact support.");
            }
            
            if (razorpayKeySecret == null || razorpayKeySecret.isEmpty() || 
                razorpayKeySecret.contains("placeholder") || razorpayKeySecret.equals("your_razorpay_secret")) {
                throw new BadRequestException("Payment service is not configured. Please contact support.");
            }
            
            // Log credentials for debugging (remove in production!)
            log.info("Using Razorpay Key ID: {}", razorpayKeyId);
            log.info("Key Secret length: {}", razorpayKeySecret != null ? razorpayKeySecret.length() : "null");
            
            // Initialize Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Convert amount to paise (Razorpay expects amount in smallest currency unit)
            int amountInPaise = request.getAmount() * 100;

            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1); // Auto capture

            // Create order in Razorpay
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Save payment record in database
            Payment payment = Payment.builder()
                    .user(user)
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(BigDecimal.valueOf(request.getAmount()))
                    .currency("INR")
                    .creditsAmount(request.getCreditsAmount())
                    .status(Payment.PaymentStatus.CREATED)
                    .build();

            paymentRepository.save(payment);

            log.info("Order created successfully for user: {}, orderId: {}", 
                    user.getEmail(), razorpayOrder.get("id"));

            return OrderResponse.builder()
                    .orderId(razorpayOrder.get("id"))
                    .amount(BigDecimal.valueOf(request.getAmount()))
                    .currency("INR")
                    .creditsAmount(request.getCreditsAmount())
                    .razorpayKeyId(razorpayKeyId)
                    .build();

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new BadRequestException("Failed to create payment order: " + e.getMessage());
        }
    }

    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request, User user) {
        try {
            // Find payment record
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

            // Verify payment belongs to user
            if (!payment.getUser().getId().equals(user.getId())) {
                throw new BadRequestException("Unauthorized payment verification");
            }

            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValidSignature) {
                // Update payment status
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                paymentRepository.save(payment);

                // Add credits to user account
                creditService.addCredits(user, payment.getCreditsAmount());

                log.info("Payment verified successfully for user: {}, paymentId: {}", 
                        user.getEmail(), request.getRazorpayPaymentId());

                return mapToPaymentResponse(payment);
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setFailureReason("Invalid signature");
                paymentRepository.save(payment);

                throw new BadRequestException("Payment verification failed: Invalid signature");
            }

        } catch (RazorpayException e) {
            log.error("Error verifying payment", e);
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }

    @Transactional
    public void handlePaymentFailure(String orderId, String reason, User user) {
        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (!payment.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized payment update");
        }

        payment.setStatus(Payment.PaymentStatus.FAILED);
        payment.setFailureReason(reason);
        paymentRepository.save(payment);

        log.warn("Payment failed for user: {}, orderId: {}, reason: {}", 
                user.getEmail(), orderId, reason);
    }

    public Page<PaymentResponse> getUserPayments(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return payments.map(this::mapToPaymentResponse);
    }

    public PaymentResponse getPaymentById(Long paymentId, User user) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (!payment.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to payment");
        }

        return mapToPaymentResponse(payment);
    }

    public String testCredentials() {
        try {
            log.info("Testing Razorpay credentials...");
            log.info("Key ID: {}", razorpayKeyId);
            log.info("Key Secret present: {}", razorpayKeySecret != null && !razorpayKeySecret.isEmpty());
            
            if (razorpayKeyId == null || razorpayKeyId.isEmpty()) {
                return "ERROR: Razorpay Key ID is not configured. Please set RAZORPAY_KEY_ID in environment variables.";
            }
            
            if (razorpayKeyId.contains("placeholder") || razorpayKeyId.equals("rzp_test_your_key_id")) {
                return "ERROR: Razorpay Key ID is still using placeholder value. Please replace with actual credentials from https://dashboard.razorpay.com/";
            }
            
            if (razorpayKeySecret == null || razorpayKeySecret.isEmpty()) {
                return "ERROR: Razorpay Key Secret is not configured. Please set RAZORPAY_KEY_SECRET in environment variables.";
            }
            
            if (razorpayKeySecret.contains("placeholder") || razorpayKeySecret.equals("your_razorpay_secret")) {
                return "ERROR: Razorpay Key Secret is still using placeholder value. Please replace with actual credentials from https://dashboard.razorpay.com/";
            }
            
            if (!razorpayKeyId.startsWith("rzp_test_") && !razorpayKeyId.startsWith("rzp_live_")) {
                return "ERROR: Invalid Razorpay Key ID format. Should start with 'rzp_test_' or 'rzp_live_'";
            }
            
            // Try to initialize client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            return "SUCCESS: Razorpay credentials are configured correctly. Key ID: " + razorpayKeyId;
            
        } catch (RazorpayException e) {
            log.error("Razorpay credentials test failed", e);
            return "ERROR: Failed to initialize Razorpay client - " + e.getMessage() + ". Please verify your credentials at https://dashboard.razorpay.com/";
        }
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .creditsAmount(payment.getCreditsAmount())
                .status(payment.getStatus().name())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
