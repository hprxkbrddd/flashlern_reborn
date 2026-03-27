package io.github.flashlearn.app.settings.mapper;

import io.github.flashlearn.app.settings.dto.UserSettingsResponse;
import io.github.flashlearn.app.settings.dto.UserSettingsUpdateRequest;
import io.github.flashlearn.app.settings.entity.Language;
import io.github.flashlearn.app.settings.entity.UserSettings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserSettingsMapper {
    @Mapping(target = "language", source = "language")
    UserSettingsResponse toUserSettingsResponse(UserSettings userSettings);

    @Mapping(target = "language", source = "language")
    UserSettings toUserSettings(UserSettingsResponse userSettingsResponse);

    @Mapping(target = "language", source = "language")
    UserSettings toUserSettings(UserSettingsUpdateRequest userSettingsUpdateRequest);

    default Language mapLanguage(String language) {
        return language != null ? Language.valueOf(language) : Language.EN;
    }

    default String mapLanguage(Language language) {
        return language != null ? language.name() : null;
    }
}
