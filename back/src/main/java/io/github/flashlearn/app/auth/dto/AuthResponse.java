package io.github.flashlearn.app.auth.dto;

public record AuthResponse(
        String token,
        String username,
        String role) {}

