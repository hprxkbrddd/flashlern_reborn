package io.github.flashlearn.app.settings.controller;

import io.github.flashlearn.app.settings.dto.UserSettingsResponse;
import io.github.flashlearn.app.settings.dto.UserSettingsUpdateRequest;
import io.github.flashlearn.app.settings.mapper.UserSettingsMapper;
import io.github.flashlearn.app.settings.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final UserSettingsMapper userSettingsMapper;

    @GetMapping("/{username}")
    public ResponseEntity<UserSettingsResponse> getSettings() {
        UserSettingsResponse userSettings = userSettingsMapper.toUserSettingsResponse(settingsService.getUserSettings());
        return ResponseEntity.ok(userSettings);
    }

    @PutMapping("/update/{username}")
    public ResponseEntity<UserSettingsResponse> updateSettings(@RequestBody UserSettingsUpdateRequest request) {
        UserSettingsResponse response =
                userSettingsMapper.toUserSettingsResponse(
                        settingsService.updateUserSettings(userSettingsMapper.toUserSettings(request)));

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
