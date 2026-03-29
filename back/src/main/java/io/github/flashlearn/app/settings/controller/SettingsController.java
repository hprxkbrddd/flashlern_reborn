package io.github.flashlearn.app.settings.controller;

import io.github.flashlearn.app.settings.dto.UserSettingsResponse;
import io.github.flashlearn.app.settings.dto.UserSettingsUpdateRequest;
import io.github.flashlearn.app.settings.mapper.UserSettingsMapper;
import io.github.flashlearn.app.settings.service.SettingsService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "User settings endpoints")
@SecurityRequirement(name = "bearerAuth")
public class SettingsController {

    private final SettingsService settingsService;
    private final UserSettingsMapper userSettingsMapper;

    @GetMapping("/{username}")
    @Operation(summary = "Get user settings", description = "Returns settings for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Settings retrieved",
                    content = @Content(schema = @Schema(implementation = UserSettingsResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User settings not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserSettingsResponse> getSettings(@PathVariable String username) {
        UserSettingsResponse userSettings = userSettingsMapper.toUserSettingsResponse(settingsService.getUserSettings());
        return ResponseEntity.ok(userSettings);
    }

    @PutMapping("/update/{username}")
    @Operation(summary = "Update user settings", description = "Updates settings for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Settings updated",
                    content = @Content(schema = @Schema(implementation = UserSettingsResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request body",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User settings not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserSettingsResponse> updateSettings(@PathVariable String username,
                                                               @RequestBody UserSettingsUpdateRequest request) {
        UserSettingsResponse response =
                userSettingsMapper.toUserSettingsResponse(
                        settingsService.updateUserSettings(userSettingsMapper.toUserSettings(request)));

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
