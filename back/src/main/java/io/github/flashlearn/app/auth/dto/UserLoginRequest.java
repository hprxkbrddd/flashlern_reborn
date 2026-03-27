package io.github.flashlearn.app.auth.dto;

public record UserLoginRequest (
        String username,
        String password) {}
