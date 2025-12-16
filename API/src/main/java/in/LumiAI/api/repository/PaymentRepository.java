package in.LumiAI.api.repository;

import in.LumiAI.api.entity.Payment;
import in.LumiAI.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);
    
    Page<Payment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Payment> findByStatusOrderByCreatedAtDesc(Payment.PaymentStatus status, Pageable pageable);
}
