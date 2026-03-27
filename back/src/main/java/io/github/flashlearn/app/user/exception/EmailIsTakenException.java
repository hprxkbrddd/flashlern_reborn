package io.github.flashlearn.app.user.exception;

public class EmailIsTakenException extends RuntimeException {
    public EmailIsTakenException(String email) {
        super("Email '" + email + "' has already been taken");
    }
}
