package io.github.flashlearn.app.settings.exception;

public class UserSettingsNotFoundException extends RuntimeException {
    public UserSettingsNotFoundException(String message) {
        super(message);
    }
}
