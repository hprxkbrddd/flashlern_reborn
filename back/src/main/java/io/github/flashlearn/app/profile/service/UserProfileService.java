package io.github.flashlearn.app.profile.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.flashcard.exception.UnauthorizedAccessException;
import io.github.flashlearn.app.profile.dto.UpdateUserProfileRequest;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    /**
     * Находит пользователя по имени пользователя. Любой аутентифицированный пользователь может просматривать профили.
     * @param username имя пользователя
     * @return найденный пользователь
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).
                orElseThrow(() -> new UserNotFoundException(username));
    }

    /**
     * Обновляет профиль пользователя. Пользователь может обновлять только свой собственный профиль.
     * @param updatedUser новые данные профиля
     * @return обновленный пользователь
     * @throws UnauthorizedAccessException если пользователь пытается обновить чужой профиль
     */
    public User updateProfile(UpdateUserProfileRequest updatedUser) {
        
        // Находим пользователя, профиль которого нужно обновить
        User user = securityUtils.getCurrentUser();

        // Обновляем данные профиля
        user.setUsername(updatedUser.username());
        user.setAboutMe(updatedUser.aboutMe());

        return userRepository.save(user);
    }

    public void uploadAvatar(String avatarKey) {
        User user = securityUtils.getCurrentUser();

        user.setAvatarKey(avatarKey);
        userRepository.save(user);
    }
}
