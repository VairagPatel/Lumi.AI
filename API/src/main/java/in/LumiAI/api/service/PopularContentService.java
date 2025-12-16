package in.LumiAI.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Redis-based service to track and retrieve popular prompts and styles
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PopularContentService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String POPULAR_PROMPTS_KEY = "popular:prompts";
    private static final String POPULAR_STYLES_KEY = "popular:styles";

    /**
     * Track a prompt usage (increments its score)
     */
    public void trackPromptUsage(String prompt) {
        if (prompt != null && !prompt.isBlank()) {
            redisTemplate.opsForZSet().incrementScore(POPULAR_PROMPTS_KEY, prompt, 1);
            log.debug("Tracked prompt usage: {}", prompt);
        }
    }

    /**
     * Track a style usage (increments its score)
     */
    public void trackStyleUsage(String style) {
        if (style != null && !style.isBlank()) {
            redisTemplate.opsForZSet().incrementScore(POPULAR_STYLES_KEY, style, 1);
            log.debug("Tracked style usage: {}", style);
        }
    }

    /**
     * Get top N popular prompts
     */
    public Set<String> getTopPrompts(int limit) {
        Set<ZSetOperations.TypedTuple<Object>> topPrompts = 
                redisTemplate.opsForZSet().reverseRangeWithScores(POPULAR_PROMPTS_KEY, 0, limit - 1);
        
        if (topPrompts != null) {
            return topPrompts.stream()
                    .map(tuple -> (String) tuple.getValue())
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    /**
     * Get top N popular styles
     */
    public Set<String> getTopStyles(int limit) {
        Set<ZSetOperations.TypedTuple<Object>> topStyles = 
                redisTemplate.opsForZSet().reverseRangeWithScores(POPULAR_STYLES_KEY, 0, limit - 1);
        
        if (topStyles != null) {
            return topStyles.stream()
                    .map(tuple -> (String) tuple.getValue())
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    /**
     * Get prompt usage count
     */
    public Double getPromptScore(String prompt) {
        return redisTemplate.opsForZSet().score(POPULAR_PROMPTS_KEY, prompt);
    }

    /**
     * Get style usage count
     */
    public Double getStyleScore(String style) {
        return redisTemplate.opsForZSet().score(POPULAR_STYLES_KEY, style);
    }
}
