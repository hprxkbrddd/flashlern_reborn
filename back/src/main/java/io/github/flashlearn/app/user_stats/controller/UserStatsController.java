package io.github.flashlearn.app.user_stats.controller;

import io.github.flashlearn.app.auth.service.AuthService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.github.flashlearn.app.user_stats.dto.UserStatsResponseDto;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import io.github.flashlearn.app.user_stats.service.UserStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "User Stats", description = "User streak and progress endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserStatsController {

    private final UserStatsService userStatsService;
    private final AuthService authService;

    @GetMapping("/ping") // redundant parameter, userId is already in security context
    @Operation(summary = "Ping stats update", description = "Updates daily login streak for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Streak update processed",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<Void> ping() {
        userStatsService.updateStreak();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user-stats/progress") // redundant parameter, userId is already in security context
    @Operation(summary = "Add review progress", description = "Increments reviewed cards counter for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Progress updated",
                    content = @Content(schema = @Schema(implementation = UserStatsResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request payload",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserStatsResponseDto> addProgress(@RequestBody Map<String, Integer> payload) {
        int reviewed = payload.getOrDefault("reviewed", 1);
        UserStats stats = userStatsService.addReviewed(reviewed);
        return ResponseEntity.ok(toResponseDto(stats));
    }

    private static UserStatsResponseDto toResponseDto(UserStats stats) {
        return new UserStatsResponseDto(
                stats.getId(),
                stats.getLastLoginDate(),
                stats.getStreak(),
                stats.getDailyGoal(),
                stats.isDailyGoalCompleted(),
                stats.getReviewedToday(),
                stats.getReviewedDate()
        );
    }
}
