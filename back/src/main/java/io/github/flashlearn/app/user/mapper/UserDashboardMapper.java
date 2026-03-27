package io.github.flashlearn.app.user.mapper;

import io.github.flashlearn.app.user.dto.UserDashboardResponseDto;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import org.mapstruct.Mapper;

@Mapper(componentModel = "Spring")
public interface UserDashboardMapper {
    UserDashboardResponseDto toUserDashboardResponseDto(UserStats userStats);
}
