package io.github.flashlearn.app.friendship.dto;

import jakarta.validation.constraints.NotNull;

public record AcceptFriendRequestDto(
        @NotNull Long id
) { }
