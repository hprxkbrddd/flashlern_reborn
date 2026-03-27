package io.github.flashlearn.app.settings.dto;

public record UserSettingsResponse(
    String language,
    boolean darkMode,
    boolean showHints,
    boolean autoPlay
) {}
