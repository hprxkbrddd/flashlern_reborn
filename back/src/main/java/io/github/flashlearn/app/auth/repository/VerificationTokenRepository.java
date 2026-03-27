package io.github.flashlearn.app.auth.repository;

import io.github.flashlearn.app.auth.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
    Optional<VerificationToken> findByToken(String token);
    void deleteByToken(String token);
}
