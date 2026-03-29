package io.github.flashlearn.app.auth.controller;

import io.github.flashlearn.app.auth.service.EmailConfirmationService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Authentication", description = "Authentication endpoints")
public class EmailConfirmationController {

    private final EmailConfirmationService confirmationService;

    @GetMapping("/confirm")
    @Operation(summary = "Confirm email", description = "Confirms email by verification token.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Email confirmed",
                    content = @Content(schema = @Schema(implementation = String.class, example = "Email confirmed successfully"))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid, missing or expired token",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<String> confirmEmail(@RequestParam("token") String token) {
        confirmationService.confirmToken(token);
        return ResponseEntity.ok("Email confirmed successfully");
    }
}
