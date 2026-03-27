package io.github.flashlearn.app.common.exception;

import io.github.flashlearn.app.auth.exception.EmailSendingException;
import io.github.flashlearn.app.auth.exception.TokenExpiredException;
import io.github.flashlearn.app.auth.exception.TokenNotFoundException;
import io.github.flashlearn.app.common.dto.ApiError;
import io.github.flashlearn.app.flashcard.exception.FlashCardAlreadyExistsException;
import io.github.flashlearn.app.flashcard.exception.FlashCardNotFoundException;
import io.github.flashlearn.app.flashcard.exception.FlashCardSetNotFoundException;
import io.github.flashlearn.app.flashcard.exception.UnauthorizedAccessException;
import io.github.flashlearn.app.friendship.exception.FiendshipRequestNotFoundException;
import io.github.flashlearn.app.friendship.exception.Forbidden;
import io.github.flashlearn.app.friendship.exception.FriendshipAlreadyExistsException;
import io.github.flashlearn.app.profile.exception.AvatarUploadException;
import io.github.flashlearn.app.settings.exception.UserSettingsNotFoundException;
import io.github.flashlearn.app.user.exception.EmailIsTakenException;
import io.github.flashlearn.app.user.exception.UserAlreadyExistsException;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.micrometer.tracing.Tracer;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler{

    @Autowired
    private Tracer tracer;

    // User already exists
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError> userAlreadyExistsExceptionHandler(UserAlreadyExistsException ex,
                                                                      HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Registration attempt failed - user exists: {}", ex.getUsername());

        ApiError body = new ApiError(HttpStatus.CONFLICT.value(), "USER_EXISTS", ex.getMessage(), // 400 - unreadable data, 409 - illegal state
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Invalid password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> invalidCredentialsExceptionHandler(BadCredentialsException ex,
                                                                       HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.info("Login attempt failed - wrong password");

        ApiError body = new ApiError(HttpStatus.UNAUTHORIZED.value(), "WRONG_PASSWORD", ex.getMessage(), // 403 - authorized, no access; 401 - unauthorized
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    // FlashCard already exists
    @ExceptionHandler(FlashCardAlreadyExistsException.class)
    public ResponseEntity<ApiError> flashCardAlreadyExistsExceptionHandler(FlashCardAlreadyExistsException ex,
                                                                           HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("FlashCard creation attempt failed - flashcard already exists: {}", ex.getQuestion());

        ApiError body = new ApiError(HttpStatus.CONFLICT.value(), "FLASHCARD_EXISTS", ex.getMessage(),
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Can not find flashcard in DB
    @ExceptionHandler(FlashCardNotFoundException.class)
    public ResponseEntity<ApiError> flashCardNotFoundExceptionHandler(FlashCardNotFoundException ex,
                                                                      HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Flashcard with question not found in database: {}", ex.getQuestion());

        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "FLASHCARD_NOT_FOUND", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Can not find User in DB
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiError> userNotFoundExceptionHandler(UserNotFoundException ex,
                                                                 HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error(ex.getMessage());

        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "USER_NOT_FOUND", ex.getMessage(),
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Email is taken by another user
    @ExceptionHandler(EmailIsTakenException.class)
    public ResponseEntity<ApiError> emailIsTakenExceptionHandler(EmailIsTakenException ex,
                                                                 HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error(ex.getMessage());

        ApiError body = new ApiError(HttpStatus.CONFLICT.value(), "EMAIL_IS_TAKEN", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Unauthorized access attempt - пользователь пытается получить доступ к ресурсу, к которому у него нет прав
    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ApiError> unauthorizedAccessExceptionHandler(UnauthorizedAccessException ex,
                                                                       HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Unauthorized access attempt: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.FORBIDDEN.value(), "UNAUTHORIZED_ACCESS", ex.getMessage(),
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> accessDeniedExceptionHandler(AccessDeniedException ex,
                                                                  HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Access denied: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.FORBIDDEN.value(), "ACCESS_DENIED", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(FriendshipAlreadyExistsException.class)
    public ResponseEntity<ApiError> friendshipAlreadyExistsExceptionHandler(FriendshipAlreadyExistsException ex,
                                                                           HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Friendship constraint: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.CONFLICT.value(), "FRIENDSHIP_ALREADY_EXISTS", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(FiendshipRequestNotFoundException.class)
    public ResponseEntity<ApiError> friendshipNotFoundExceptionHandler(FiendshipRequestNotFoundException ex,
                                                                        HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Friendship request not found: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "FRIENDSHIP_REQUEST_NOT_FOUND", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(Forbidden.class)
    public ResponseEntity<ApiError> friendshipForbiddenExceptionHandler(Forbidden ex,
                                                                        HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Friendship forbidden: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.FORBIDDEN.value(), "FRIENDSHIP_FORBIDDEN", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    // Verification token expired
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiError> tokenExpiredExceptionHandler(TokenExpiredException ex,
                                                                 HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Token expired: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.BAD_REQUEST.value(), "TOKEN_EXPIRED", ex.getMessage(),
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Verification token not found
    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ApiError> tokenNotFoundExceptionHandler(TokenNotFoundException ex,
                                                                  HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.warn("Token not found: {}", ex.getMessage());

        ApiError body = new ApiError(HttpStatus.BAD_REQUEST.value(), "TOKEN_NOT_FOUND", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Email sending error
    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<ApiError> emailSendingExceptionHandler(EmailSendingException ex,
                                                                 HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Failed to send email: {}", ex.getMessage(), ex);

        String message = "Не удалось отправить email подтверждения. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.";
        ApiError body = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "EMAIL_SENDING_FAILED", message,
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    // MessagingException (jakarta.mail) - fallback handler
    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<ApiError> messagingExceptionHandler(MessagingException ex,
                                                             HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Failed to send email: {}", ex.getMessage(), ex);

        String message = "Не удалось отправить email. Проверьте настройки почтового сервера.";
        ApiError body = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "EMAIL_SENDING_FAILED", message,
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    //User settings not found
    @ExceptionHandler(UserSettingsNotFoundException.class)
    public ResponseEntity<ApiError> UserSettingsNotFoundExceptionHandler(UserSettingsNotFoundException ex,
                                                                         HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Can not find user settings: {}", ex.getMessage(), ex);

        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "USER_SETTINGS_NOT_FOUND", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    //Flashcard set not found
    @ExceptionHandler(FlashCardSetNotFoundException.class)
    public ResponseEntity<ApiError> FlashCardSetNotFoundExceptionHandler(FlashCardSetNotFoundException ex,
                                                                         HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Can not find flashcard set: {}", ex.getMessage(), ex);

        ApiError body = new ApiError(HttpStatus.NOT_FOUND.value(), "FLASHCARD_SET_NOT_FOUND", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(AvatarUploadException.class)
    public ResponseEntity<ApiError> AvatarUploadExceptionHandler(AvatarUploadException ex,
                                                                 HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Can not upload avatar: {}", ex.getMessage(), ex);

        ApiError body = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "AVATAR_NOT_UPLOADED", ex.getMessage(),
                Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    // Unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> unexpectedExceptionHandler(Exception ex,
                                                               HttpServletRequest request) {
        String traceId = tracer.currentSpan() != null
                ? tracer.currentSpan().context().traceId()
                : "N/A";

        log.error("Unexpected exception: {}", ex.getClass().getSimpleName());

        ApiError body = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "INTERNAL_SERVER_ERROR", ex.getMessage(),
                                    Instant.now(), request.getRequestURI(), traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
