package io.github.flashlearn.app.auth.service;

import io.github.flashlearn.app.auth.dto.UserLoginRequest;
import io.github.flashlearn.app.auth.repository.VerificationTokenRepository;
import io.github.flashlearn.app.auth.security.CustomUserDetails;
import io.github.flashlearn.app.auth.security.JwtTokenProvider;
import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user.exception.UserNotFoundException;
import io.github.flashlearn.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final VerificationTokenRepository verificationTokenRepository;

    // Service for login attempts
    public String loginUser(UserLoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
            )
        );

        return tokenProvider.generateToken(
                userRepository.findByUsername(request.username())
                        .orElseThrow(() -> new UserNotFoundException(request.username())) // fetching user to get id, roles and to check if he is actually in db
        );
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found " + username));
    }
}
