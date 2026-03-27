package io.github.flashlearn.app.auth.security;

import io.github.flashlearn.app.user.entity.Role;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;


    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Генерирует JWT токен для пользователя с указанным именем
     *
     * @param id идентификатор пользователя
     * @return JWT токен
     */
    public String generateToken(User user) {
        Date now = new Date();
        // Вычисляем дату истечения токена: текущее время + время жизни токена
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("id", user.getId()) // id is stored in claims
                .claim("role", user.getRole().name())
                .issuedAt(now) // Время создания токена
                .expiration(expiryDate) // Время истечения токена
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
