package io.github.flashlearn.app.profile.dto;

public record UpdateUserProfileRequest(
        String username,
        String aboutMe) {}
