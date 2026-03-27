package io.github.flashlearn.app.auth.service;

import io.github.flashlearn.app.auth.entity.VerificationToken;
import io.github.flashlearn.app.auth.exception.EmailSendingException;
import io.github.flashlearn.app.common.service.EmailService;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailConfirmationService {

    private final ConfirmationTokenService tokenService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Value("${app.auth.verification-url-prefix:http://localhost:8080/api/auth/confirm?token=}")
    private String verificationUrlPrefix;

    /**
     * Generate token, build link and send verification email.
     */
    public void sendConfirmation(User user) {
        String token = tokenService.createTokenForUser(user);
        String link = verificationUrlPrefix + token;

        String subject = "Confirm your email";
        String body = buildHtmlBody(user.getUsername(), link);

        try {
            emailService.sendHtmlEmail(user.getEmail(), subject, body);
            log.info("Sent confirmation email to {} (user id {})", user.getEmail(), user.getId());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send confirmation email to {}: {}", user.getEmail(), e.getMessage(), e);
            throw new EmailSendingException("Failed to send confirmation email: " + e.getMessage(), e);
        }
    }

    private String buildHtmlBody(String username, String link) {
        // Simple HTML — replace with templating engine if needed
        return "<html><body>"
                + "<p>Hi " + escapeHtml(username) + ",</p>"
                + "<p>Thank you for registering. Click the link below to confirm your email address:</p>"
                + "<p><a href=\"" + link + "\">Confirm email</a></p>"
                + "<p>If the link doesn't work, copy and paste this URL into your browser:</p>"
                + "<p>" + link + "</p>"
                + "<hr/>"
                + "<p>If you didn't create an account — ignore this message.</p>"
                + "</body></html>";
    }

    // Minimal HTML escaping to avoid injection (better use a template engine)
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    /**
     * Confirm token: validate token, activate user, mark token used.
     */
    @Transactional
    public void confirmToken(String token) {
        tokenService.validateToken(token);
        VerificationToken vt = tokenService.findByToken(token);
        User user = vt.getUser();
        // activate user (assuming User has field emailVerified or enabled)
        user.setEmailVerified(true); // make sure User entity has this field
        userRepository.save(user);

        // mark token used
        tokenService.markTokenAsUsed(token);
    }
}
