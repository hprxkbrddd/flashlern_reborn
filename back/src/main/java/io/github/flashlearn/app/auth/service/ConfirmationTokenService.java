package io.github.flashlearn.app.auth.service;

import io.github.flashlearn.app.auth.entity.VerificationToken;
import io.github.flashlearn.app.auth.exception.TokenExpiredException;
import io.github.flashlearn.app.auth.exception.TokenNotFoundException;
import io.github.flashlearn.app.auth.repository.VerificationTokenRepository;
import io.github.flashlearn.app.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConfirmationTokenService {

    private final VerificationTokenRepository tokenRepository;

    public String createTokenForUser(User user) {
        String value = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(Duration.ofHours(24)); // 24 hours validity

        VerificationToken token = VerificationToken.builder()
                .token(value)
                .user(user)
                .expiresAt(expiresAt)
                .used(false)
                .build();

        tokenRepository.save(token);
        return value;
    }

    public VerificationToken findByToken(String token) {
        return tokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenNotFoundException("Token not found: " + token));
    }

    /**
     * Validate token: present, not used, not expired.
     * Does NOT modify user state. Throws exceptions on failure.
     */
    public void validateToken(String token) {
        VerificationToken t = findByToken(token);
        if (t.isUsed()) {
            throw new TokenExpiredException("Token already used");
        }
        if (t.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException("Token expired");
        }
    }

    @Transactional
    public void markTokenAsUsed(String token) {
        VerificationToken t = findByToken(token);
        t.setUsed(true);
        tokenRepository.save(t);
    }

    public void deleteToken(String token) {
        tokenRepository.deleteByToken(token);
    }
}
