package io.github.flashlearn.app.auth.dto;

public record UserRegistrationRequest (
        String username,
        String password,
        String email) {}
