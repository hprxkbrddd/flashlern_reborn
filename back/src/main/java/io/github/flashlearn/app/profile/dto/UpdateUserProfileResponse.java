package io.github.flashlearn.app.profile.dto;

public record UpdateUserProfileResponse(
        Long uniqueId,
        String username,
        String aboutMe
) { }
