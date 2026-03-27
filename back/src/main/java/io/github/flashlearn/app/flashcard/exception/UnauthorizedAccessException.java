package io.github.flashlearn.app.flashcard.exception;

/**
 * Исключение, выбрасываемое при попытке доступа к ресурсу, к которому у пользователя нет прав
 */
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}

