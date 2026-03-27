package io.github.flashlearn.app.friendship.mapper;

import io.github.flashlearn.app.friendship.dto.FriendRequestResponseDto;
import io.github.flashlearn.app.friendship.entity.Friendship;
import org.mapstruct.Mapper;

@Mapper(componentModel = "Spring")
public interface FriendshipMapper {
    FriendRequestResponseDto toFriendRequestResponseDto(Friendship friendship);
}
