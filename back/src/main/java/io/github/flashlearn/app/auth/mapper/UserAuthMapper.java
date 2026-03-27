package io.github.flashlearn.app.auth.mapper;

import io.github.flashlearn.app.auth.dto.UserRegistrationResponse;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileResponse;
import io.github.flashlearn.app.profile.dto.UserProfileResponse;
import io.github.flashlearn.app.profile.service.AvatarUrlService;
import io.github.flashlearn.app.user.entity.User;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAuthMapper {
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserRegistrationResponse toUserRegistrationResponse(User user);

    @Mapping(
            target = "avatarUrl",
            expression = "java(avatarUrlService.buildPublicAvatarUrl(user.getAvatarKey()))"
    )
    @Mapping(target = "uniqueId", source = "id")
    UserProfileResponse toUserProfileResponse(
            User user,
            @Context AvatarUrlService avatarUrlService
    );

    @Mapping(target = "uniqueId", source = "id")
    UpdateUserProfileResponse toUpdateUserProfileResponse(User user);
}
