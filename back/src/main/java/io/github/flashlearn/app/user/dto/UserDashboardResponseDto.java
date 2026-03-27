package io.github.flashlearn.app.user.dto;

import io.github.flashlearn.app.flashcard.dto.FlashCardSetResponse;

import java.util.List;

public record UserDashboardResponseDto(
        int streak,
        int dailyGoal,
        int reviewedToday,
        boolean dailyGoalCompleted,
        List<FlashCardSetResponse> flashCards
) { }
