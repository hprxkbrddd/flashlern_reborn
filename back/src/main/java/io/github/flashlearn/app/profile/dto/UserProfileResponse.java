package io.github.flashlearn.app.profile.dto;

public record UserProfileResponse (
        Long uniqueId,
        String username,
        String avatarUrl,
        String aboutMe) {}
