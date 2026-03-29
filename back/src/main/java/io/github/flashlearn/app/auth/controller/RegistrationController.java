package io.github.flashlearn.app.auth.controller;

import io.github.flashlearn.app.auth.dto.UserRegistrationRequest;
import io.github.flashlearn.app.auth.dto.UserRegistrationResponse;
import io.github.flashlearn.app.auth.mapper.UserAuthMapper;
import io.github.flashlearn.app.auth.service.RegistrationService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Authentication", description = "Authentication endpoints")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserAuthMapper mapper;

    // Controller for registration attempt
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Registers a new user account and sends verification email.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User created",
                    content = @Content(schema = @Schema(implementation = UserRegistrationResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request body",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Username or email already taken",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error or email sending failure",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<UserRegistrationResponse> registerUser(@RequestBody UserRegistrationRequest registrationRequest) {
        User createdUser = registrationService.registerUser(registrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toUserRegistrationResponse(createdUser));
    }
}
