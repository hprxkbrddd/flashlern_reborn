package io.github.flashlearn.app.friendship.dto;

public record FriendRequestNotificationDto(
        Long id,
        String requesterUsername,
        String status
) { }

