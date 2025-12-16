package in.LumiAI.api.service;

import in.LumiAI.api.entity.Credit;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.exception.BadRequestException;
import in.LumiAI.api.exception.ResourceNotFoundException;
import in.LumiAI.api.repository.CreditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreditService {

    private final CreditRepository creditRepository;

    @Transactional
    public Credit createCreditAccount(User user) {
        Credit credit = Credit.builder()
                .user(user)
                .balance(15) // Default 15 free credits
                .totalEarned(15)
                .totalSpent(0)
                .build();
        return creditRepository.save(credit);
    }

    // @org.springframework.cache.annotation.Cacheable(value = "credits", key = "#user.id") // Disabled due to User entity serialization issues
    public Credit getCreditByUser(User user) {
        log.debug("Fetching credits from database for user: {}", user.getEmail());
        return creditRepository.findByUser(user)
                .orElseGet(() -> {
                    log.warn("Credit account not found for user: {}. Creating new account.", user.getEmail());
                    return createCreditAccount(user);
                });
    }

    // @org.springframework.cache.annotation.Cacheable(value = "credits", key = "#userId") // Disabled due to serialization issues
    public Credit getCreditByUserId(Long userId) {
        log.debug("Fetching credits from database for user ID: {}", userId);
        return creditRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Credit account not found"));
    }

    @Transactional
    // @org.springframework.cache.annotation.CacheEvict(value = "credits", key = "#user.id") // Disabled due to User entity serialization issues
    public Credit deductCredits(User user, int amount) {
        Credit credit = creditRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Credit account not found"));
        
        if (credit.getBalance() < amount) {
            throw new BadRequestException("Insufficient credits. You have " + credit.getBalance() + " credits.");
        }

        credit.deductCredits(amount);
        log.info("Deducted {} credits from user {}. New balance: {}", amount, user.getEmail(), credit.getBalance());
        return creditRepository.save(credit);
    }

    @Transactional
    // @org.springframework.cache.annotation.CacheEvict(value = "credits", key = "#user.id") // Disabled due to User entity serialization issues
    public Credit addCredits(User user, int amount) {
        Credit credit = creditRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Credit account not found"));
        credit.addCredits(amount);
        log.info("Added {} credits to user {}. New balance: {}", amount, user.getEmail(), credit.getBalance());
        return creditRepository.save(credit);
    }

    @Transactional
    // @org.springframework.cache.annotation.CacheEvict(value = "credits", key = "#userId") // Disabled due to serialization issues
    public Credit addCreditsByUserId(Long userId, int amount) {
        Credit credit = getCreditByUserId(userId);
        credit.addCredits(amount);
        log.info("Admin added {} credits to user ID {}. New balance: {}", amount, userId, credit.getBalance());
        return creditRepository.save(credit);
    }

    public boolean hasEnoughCredits(User user, int requiredAmount) {
        Credit credit = getCreditByUser(user);
        return credit.getBalance() >= requiredAmount;
    }
}
