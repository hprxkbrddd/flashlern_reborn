package io.github.flashlearn.app.user.controller;

import io.github.flashlearn.app.flashcard.mapper.FlashCardSetMapper;
import io.github.flashlearn.app.common.dto.ApiError;
import io.github.flashlearn.app.user.dto.UpdateDailyGoalRequestDto;
import io.github.flashlearn.app.user.dto.UserDashboardResponseDto;
import io.github.flashlearn.app.user.mapper.UserDashboardMapper;
import io.github.flashlearn.app.user.service.UserDashboardService;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/dashboard")
@RestController
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "User dashboard and daily goal endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserDashboardController {

    private final UserDashboardService userDashboardService;
    private final UserDashboardMapper userDashboardMapper;
    private final FlashCardSetMapper flashCardSetMapper;

    @GetMapping("/{username}")
    @Operation(summary = "Get dashboard", description = "Returns dashboard data for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Dashboard data retrieved",
                    content = @Content(schema = @Schema(implementation = UserDashboardResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User stats not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserDashboardResponseDto> getUserInfo(@PathVariable String username) {
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
    @Operation(summary = "Update daily goal", description = "Updates daily flashcard review goal for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Daily goal updated",
                    content = @Content(schema = @Schema(implementation = UserDashboardResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or malformed request body",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User stats not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserDashboardResponseDto> updateUserDailyGoal(@RequestBody @Valid UpdateDailyGoalRequestDto request) {
        UserDashboardResponseDto userResponse = userDashboardMapper
                .toUserDashboardResponseDto(userDashboardService.updateUserDailyGoal(request));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(userResponse);
    }
}
