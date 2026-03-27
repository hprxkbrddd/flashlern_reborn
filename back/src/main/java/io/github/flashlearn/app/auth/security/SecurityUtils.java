package io.github.flashlearn.app.auth.security;

import io.github.flashlearn.app.flashcard.exception.UnauthorizedAccessException;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Утилитный класс для работы с SecurityContext и получения информации о текущем аутентифицированном пользователе
 */
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    /**
     * Получает имя пользователя из SecurityContext
     *
     * @return имя текущего аутентифицированного пользователя
     * @throws IllegalStateException если пользователь не аутентифицирован
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (unauthorized()) {
            throw new UnauthorizedAccessException("Пользователь не аутентифицирован");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.id();
        } else {
            throw new IllegalStateException("Неизвестный тип principal: " + principal.getClass());
        }
    }

    public static String getCurrentUsername(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (unauthorized()) {
            throw new UnauthorizedAccessException("Пользователь не аутентифицирован");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUsername();
        } else {
            throw new IllegalStateException("Неизвестный тип principal: " + principal.getClass());
        }
    }

    /**
     * Получает объект User текущего аутентифицированного пользователя из базы данных
     *
     * @return объект User текущего пользователя
     * @throws UserNotFoundException если пользователь не найден в базе данных
     * @throws IllegalStateException если пользователь не аутентифицирован
     */
    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public User getCurrentUserRef(){
        Long userId = getCurrentUserId();
        return userRepository.getReferenceById(userId);
    }

    /**
     * Проверяет, является ли текущий пользователь владельцем указанного ресурса
     *
     * @param userId имя пользователя-владельца ресурса
     * @return true, если текущий пользователь является владельцем
     */
    public static boolean isCurrentUser(Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            return currentUserId.equals(userId);
        } catch (IllegalStateException e) {
            return false;
        }
    }

    /**
     * Проверяет, аутентифицирован ли текущий пользователь
     *
     * @return true, если пользователь аутентифицирован
     */
    public static boolean unauthorized() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal());
    }
}

