package io.github.flashlearn.app.auth.controller;

import io.github.flashlearn.app.auth.service.EmailConfirmationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to confirm token links sent by email.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class EmailConfirmationController {

    private final EmailConfirmationService confirmationService;

    @GetMapping("/confirm")
    public ResponseEntity<String> confirmEmail(@RequestParam("token") String token) {
        confirmationService.confirmToken(token);
        return ResponseEntity.ok("Email confirmed successfully");
    }
}
