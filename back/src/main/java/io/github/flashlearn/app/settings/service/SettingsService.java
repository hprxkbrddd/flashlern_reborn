package io.github.flashlearn.app.settings.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.settings.entity.UserSettings;
import io.github.flashlearn.app.settings.exception.UserSettingsNotFoundException;
import io.github.flashlearn.app.settings.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingsRepository userSettingsRepository;

    public UserSettings getUserSettings() {
        return userSettingsRepository.findByUser_Id(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new UserSettingsNotFoundException("user with username not found: " + SecurityUtils.getCurrentUsername()));
    }

    public UserSettings updateUserSettings(UserSettings newUserSettings) {
        UserSettings userSettings = userSettingsRepository.findByUser_Id(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new UserSettingsNotFoundException("user settings not found: " + SecurityUtils.getCurrentUsername()));

        userSettings.setLanguage(newUserSettings.getLanguage());
        userSettings.setDarkMode(newUserSettings.isDarkMode());
        userSettings.setShowHints(newUserSettings.isShowHints());
        userSettings.setAutoPlay(newUserSettings.isAutoPlay());

        return userSettingsRepository.save(userSettings);
    }
}
