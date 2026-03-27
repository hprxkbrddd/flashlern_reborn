package io.github.flashlearn.app.user.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import io.github.flashlearn.app.flashcard.service.FlashCardService;
import io.github.flashlearn.app.user.dto.UpdateDailyGoalRequestDto;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import io.github.flashlearn.app.user_stats.exception.UserStatsNotFoundException;
import io.github.flashlearn.app.user_stats.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static io.github.flashlearn.app.auth.security.SecurityUtils.getCurrentUserId;

@Service
@RequiredArgsConstructor
public class UserDashboardService {

    private final UserStatsRepository userStatsRepository;
    private final FlashCardService flashCardService;

    public UserStats loadFreshUserStats() {
        return ensureFresh(
                loadUserStats(SecurityUtils.getCurrentUserId())
        );
    }

    public List<FlashCardSet> getOwnerSets() {
        return flashCardService.getAllFlashCardSets();
    }

    public UserStats updateUserDailyGoal(UpdateDailyGoalRequestDto request) {
        // redundant parameter, userId is already in security context
        UserStats userStats = ensureFresh(
                loadUserStats(getCurrentUserId())
        );

        userStats.setDailyGoal(request.dailyGoal());
        return userStatsRepository.save(userStats);
    }

    private UserStats loadUserStats(Long userId) {
        return userStatsRepository.findByUserId(userId)
                .orElseThrow(() -> new UserStatsNotFoundException(userId));
    }

    private UserStats ensureFresh(UserStats stats) {
        LocalDate today = LocalDate.now();
        if (stats.getReviewedDate() == null || !today.equals(stats.getReviewedDate())) {
            stats.setReviewedDate(today);
            stats.setReviewedToday(0);
            stats.setDailyGoalCompleted(false);
            return userStatsRepository.save(stats);
        }
        return stats;
    }
}
