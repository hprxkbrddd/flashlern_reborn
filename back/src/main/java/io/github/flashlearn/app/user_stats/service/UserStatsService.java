package io.github.flashlearn.app.user_stats.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import io.github.flashlearn.app.user_stats.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;
    private final SecurityUtils securityUtils;

    public UserStats getFreshStats(User user) {
        UserStats userStats = userStatsRepository.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException(user.getId())); // proper message

        LocalDate today = LocalDate.now();
        if (userStats.getReviewedDate() == null || !userStats.getReviewedDate().equals(today)) {
            userStats.setReviewedToday(0);
            userStats.setReviewedDate(today);
            userStats.setDailyGoalCompleted(false);
            userStatsRepository.save(userStats);
        }
        return userStats;
    }

    public void updateStreak() { // redundant parameter, userId is already in security context
        User userRef = securityUtils.getCurrentUserRef();
        UserStats userStats = userStatsRepository.findByUser(userRef)
                .orElseThrow(() -> new UserNotFoundException(SecurityUtils.getCurrentUserId()));

        LocalDate today = LocalDate.now();
        LocalDate last = userStats.getLastLoginDate();

        if (last == null || !last.equals(today)) {

            if (last != null && last.equals(today.minusDays(1))) {
                userStats.setStreak(userStats.getStreak() + 1);
            } else {
                userStats.setStreak(1);
            }

            userStats.setLastLoginDate(today);
            userStatsRepository.save(userStats);
        }
    }

    public UserStats addReviewed(int reviewedCount) {
        User userRef = securityUtils.getCurrentUserRef();
        if (reviewedCount <= 0) return getFreshStats(userRef);
        UserStats stats = getFreshStats(userRef);
        stats.setReviewedToday(stats.getReviewedToday() + reviewedCount);
        if (stats.getReviewedToday() >= stats.getDailyGoal()) {
            stats.setDailyGoalCompleted(true);
        }
        return userStatsRepository.save(stats);
    }
}
