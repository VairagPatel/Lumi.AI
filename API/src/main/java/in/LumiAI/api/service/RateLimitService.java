package in.LumiAI.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Redis-based rate limiting service to prevent API abuse
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String RATE_LIMIT_PREFIX = "rate_limit:";
    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_REQUESTS_PER_HOUR = 100;

    /**
     * Check if user has exceeded rate limit
     * @param userId User ID
     * @return true if allowed, false if rate limit exceeded
     */
    public boolean isAllowed(Long userId) {
        String minuteKey = RATE_LIMIT_PREFIX + userId + ":minute";
        String hourKey = RATE_LIMIT_PREFIX + userId + ":hour";

        // Check minute limit
        Long minuteCount = redisTemplate.opsForValue().increment(minuteKey);
        if (minuteCount == 1) {
            redisTemplate.expire(minuteKey, Duration.ofMinutes(1));
        }

        if (minuteCount > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded for user {} - minute limit", userId);
            return false;
        }

        // Check hour limit
        Long hourCount = redisTemplate.opsForValue().increment(hourKey);
        if (hourCount == 1) {
            redisTemplate.expire(hourKey, Duration.ofHours(1));
        }

        if (hourCount > MAX_REQUESTS_PER_HOUR) {
            log.warn("Rate limit exceeded for user {} - hour limit", userId);
            return false;
        }

        log.debug("Rate limit check passed for user {}: {}/min, {}/hour", 
                userId, minuteCount, hourCount);
        return true;
    }

    /**
     * Get remaining requests for user
     */
    public RateLimitInfo getRateLimitInfo(Long userId) {
        String minuteKey = RATE_LIMIT_PREFIX + userId + ":minute";
        String hourKey = RATE_LIMIT_PREFIX + userId + ":hour";

        Integer minuteCount = (Integer) redisTemplate.opsForValue().get(minuteKey);
        Integer hourCount = (Integer) redisTemplate.opsForValue().get(hourKey);

        return RateLimitInfo.builder()
                .requestsThisMinute(minuteCount != null ? minuteCount : 0)
                .requestsThisHour(hourCount != null ? hourCount : 0)
                .minuteLimit(MAX_REQUESTS_PER_MINUTE)
                .hourLimit(MAX_REQUESTS_PER_HOUR)
                .build();
    }

    @lombok.Builder
    @lombok.Data
    public static class RateLimitInfo {
        private int requestsThisMinute;
        private int requestsThisHour;
        private int minuteLimit;
        private int hourLimit;
    }
}
