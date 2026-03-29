package io.github.flashlearn.app.profile.controller;

import io.github.flashlearn.app.auth.mapper.UserAuthMapper;
import io.github.flashlearn.app.common.dto.ApiError;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileRequest;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileResponse;
import io.github.flashlearn.app.profile.dto.UserProfileResponse;
import io.github.flashlearn.app.profile.service.AvatarUrlService;
import io.github.flashlearn.app.profile.service.UserProfileService;
import io.github.flashlearn.app.storage.service.AvatarStorageService;
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
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/profile")
@RestController
@RequiredArgsConstructor
@Tag(name = "Profile", description = "User profile endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final AvatarStorageService avatarStorageService;
    private final AvatarUrlService avatarUrlService;
    private final UserAuthMapper mapper;

    /**
     * Получение информации о профиле пользователя. Требуется аутентификация.
     * Любой аутентифицированный пользователь может просматривать профили других пользователей.
     */
    @GetMapping("/{username}")
    @Operation(summary = "Get user profile", description = "Returns profile information by username.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile retrieved",
                    content = @Content(schema = @Schema(implementation = UserProfileResponse.class))
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
    public ResponseEntity<UserProfileResponse> getProfileInfo(@PathVariable String username) {
        UserProfileResponse userProfileResponse = mapper.toUserProfileResponse(
                userProfileService.findByUsername(username),
                avatarUrlService);
        return ResponseEntity.status(HttpStatus.OK).body(userProfileResponse);
    }

    /**
     * Обновление профиля пользователя. Требуется аутентификация.
     * Пользователь может обновлять только свой собственный профиль (проверка в сервисе).
     */
    @PutMapping("/update/{userId}")// redundant parameter, userId is already in security context
    @Operation(summary = "Update own profile", description = "Updates profile for authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated",
                    content = @Content(schema = @Schema(implementation = UpdateUserProfileResponse.class))
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
                    description = "User not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UpdateUserProfileResponse> updateProfile(@PathVariable Long userId,
                                                                   @RequestBody UpdateUserProfileRequest updatedUser) {
        UpdateUserProfileResponse updateUserProfileResponse =
                mapper.toUpdateUserProfileResponse(userProfileService.updateProfile(updatedUser));

        return ResponseEntity.status(HttpStatus.OK).body(updateUserProfileResponse);
    }

    @PostMapping("/avatar")
    @Operation(summary = "Upload avatar", description = "Uploads avatar image and returns stored avatar key.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Avatar uploaded",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Missing file or invalid multipart request",
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
                    description = "Avatar upload error or internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {

        String avatarKey = avatarStorageService.uploadAvatar(file);
        userProfileService.uploadAvatar(avatarKey);

        return ResponseEntity.ok().body(avatarKey);
    }
}
