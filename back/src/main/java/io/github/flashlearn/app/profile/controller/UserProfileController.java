package io.github.flashlearn.app.profile.controller;

import io.github.flashlearn.app.auth.mapper.UserAuthMapper;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileRequest;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileResponse;
import io.github.flashlearn.app.profile.dto.UserProfileResponse;
import io.github.flashlearn.app.profile.service.AvatarUrlService;
import io.github.flashlearn.app.profile.service.UserProfileService;
import io.github.flashlearn.app.storage.service.AvatarStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/profile")
@RestController
@RequiredArgsConstructor
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
    public ResponseEntity<UpdateUserProfileResponse> updateProfile(@RequestBody UpdateUserProfileRequest updatedUser) {
        UpdateUserProfileResponse updateUserProfileResponse =
                mapper.toUpdateUserProfileResponse(userProfileService.updateProfile(updatedUser));

        return ResponseEntity.status(HttpStatus.OK).body(updateUserProfileResponse);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {

        String avatarKey = avatarStorageService.uploadAvatar(file);
        userProfileService.uploadAvatar(avatarKey);

        return ResponseEntity.ok().body(avatarKey);
    }
}
