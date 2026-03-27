package io.github.flashlearn.app.auth.controller;

import io.github.flashlearn.app.auth.dto.AuthResponse;
import io.github.flashlearn.app.auth.dto.UserLoginRequest;
import io.github.flashlearn.app.auth.service.AuthService;
import io.github.flashlearn.app.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Controller for login attempts
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody UserLoginRequest loginRequest) {
        String token = authService.loginUser(loginRequest);
        User user = authService.findUserByUsername(loginRequest.username());
        // зачем что-то еще кроме токена? это должно быть настолько важно, чтобы оправдать запрос к бд
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
    }
}
