package io.github.flashlearn.app.auth.controller;

import io.github.flashlearn.app.auth.dto.UserRegistrationRequest;
import io.github.flashlearn.app.auth.dto.UserRegistrationResponse;
import io.github.flashlearn.app.auth.mapper.UserAuthMapper;
import io.github.flashlearn.app.auth.service.RegistrationService;
import io.github.flashlearn.app.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RequiredArgsConstructor
@RestController
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserAuthMapper mapper;

    // Controller for registration attempt
    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponse> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        User createdUser = registrationService.registerUser(registrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toUserRegistrationResponse(createdUser));
    }
}
