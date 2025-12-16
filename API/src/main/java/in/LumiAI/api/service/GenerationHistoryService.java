package in.LumiAI.api.service;

import in.LumiAI.api.dto.response.GenerationHistoryResponse;
import in.LumiAI.api.dto.response.PageResponse;
import in.LumiAI.api.entity.GenerationHistory;
import in.LumiAI.api.entity.User;
import in.LumiAI.api.repository.GenerationHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenerationHistoryService {

    private final GenerationHistoryRepository generationHistoryRepository;

    @Transactional
    public GenerationHistory saveHistory(User user, String prompt, String style, 
                                        String generationType, String imageUrl, 
                                        Boolean success, String errorMessage) {
        GenerationHistory history = GenerationHistory.builder()
                .user(user)
                .prompt(prompt)
                .style(style)
                .generationType(generationType)
                .imageUrl(imageUrl)
                .success(success)
                .errorMessage(errorMessage)
                .build();

        return generationHistoryRepository.save(history);
    }

    @Cacheable(value = "userHistory", key = "#user.id + '-' + #page + '-' + #size")
    public PageResponse<GenerationHistoryResponse> getUserHistory(User user, int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<GenerationHistory> historyPage = generationHistoryRepository.findByUser(user, pageable);

        return buildPageResponse(historyPage);
    }

    public PageResponse<GenerationHistoryResponse> getUserHistoryByDateRange(
            User user, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<GenerationHistory> historyPage = generationHistoryRepository
                .findByUserAndDateRange(user, startDate, endDate, pageable);

        return buildPageResponse(historyPage);
    }

    @Cacheable(value = "userStats", key = "#user.id")
    public Long getUserSuccessfulGenerationsCount(User user) {
        return generationHistoryRepository.countSuccessfulGenerationsByUser(user);
    }

    private PageResponse<GenerationHistoryResponse> buildPageResponse(Page<GenerationHistory> historyPage) {
        List<GenerationHistoryResponse> content = historyPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<GenerationHistoryResponse>builder()
                .content(content)
                .pageNumber(historyPage.getNumber())
                .pageSize(historyPage.getSize())
                .totalElements(historyPage.getTotalElements())
                .totalPages(historyPage.getTotalPages())
                .last(historyPage.isLast())
                .first(historyPage.isFirst())
                .build();
    }

    private GenerationHistoryResponse mapToResponse(GenerationHistory history) {
        return GenerationHistoryResponse.builder()
                .id(history.getId())
                .prompt(history.getPrompt())
                .style(history.getStyle())
                .generationType(history.getGenerationType())
                .imageUrl(history.getImageUrl())
                .success(history.getSuccess())
                .errorMessage(history.getErrorMessage())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
