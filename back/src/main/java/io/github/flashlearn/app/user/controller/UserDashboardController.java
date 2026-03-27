package io.github.flashlearn.app.user.controller;

import io.github.flashlearn.app.flashcard.mapper.FlashCardSetMapper;
import io.github.flashlearn.app.user.dto.UpdateDailyGoalRequestDto;
import io.github.flashlearn.app.user.dto.UserDashboardResponseDto;
import io.github.flashlearn.app.user.mapper.UserDashboardMapper;
import io.github.flashlearn.app.user.service.UserDashboardService;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/dashboard")
@RestController
@RequiredArgsConstructor
public class UserDashboardController {

    private final UserDashboardService userDashboardService;
    private final UserDashboardMapper userDashboardMapper;
    private final FlashCardSetMapper flashCardSetMapper;

    @GetMapping("/{username}")
    public ResponseEntity<UserDashboardResponseDto> getUserInfo() {
        UserStats userInfo = userDashboardService.loadFreshUserStats();
        UserDashboardResponseDto userResponse = new UserDashboardResponseDto(
                userInfo.getStreak(),
                userInfo.getDailyGoal(),
                userInfo.getReviewedToday(),
                userInfo.isDailyGoalCompleted(),
                userDashboardService.getOwnerSets().stream()
                        .map(flashCardSetMapper::toFlashCardSetResponse)
                        .toList());

        return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    }

    @PutMapping("/update_daily_goal") // redundant parameter, userId is already in security context
    public ResponseEntity<UserDashboardResponseDto> updateUserDailyGoal(@RequestBody @Valid UpdateDailyGoalRequestDto request) {
        UserDashboardResponseDto userResponse = userDashboardMapper
                .toUserDashboardResponseDto(userDashboardService.updateUserDailyGoal(request));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userResponse);
    }
}
