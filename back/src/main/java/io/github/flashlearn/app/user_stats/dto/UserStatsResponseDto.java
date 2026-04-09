package io.github.flashlearn.app.user_stats.dto;

import java.time.LocalDate;

public record UserStatsResponseDto(
        Long id,
        LocalDate lastLoginDate,
        int streak,
        int dailyGoal,
        boolean dailyGoalCompleted,
        int reviewedToday,
        LocalDate reviewedDate
) {}
