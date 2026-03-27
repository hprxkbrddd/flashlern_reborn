package io.github.flashlearn.app.user_stats.exception;

public class UserStatsNotFoundException extends RuntimeException {
    public UserStatsNotFoundException(Long userId) {
        super("User stats not found: userId:" + userId);
    }
}
