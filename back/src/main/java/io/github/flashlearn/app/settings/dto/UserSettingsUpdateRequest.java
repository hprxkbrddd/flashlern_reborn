package io.github.flashlearn.app.settings.dto;

public record UserSettingsUpdateRequest(
        String language,
        boolean darkMode,
        boolean showHints,
        boolean autoPlay
) {}
