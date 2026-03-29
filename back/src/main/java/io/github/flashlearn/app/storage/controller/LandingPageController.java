package io.github.flashlearn.app.storage.controller;

import io.github.flashlearn.app.storage.dto.LandingPageImagesDto;
import io.github.flashlearn.app.storage.service.LandingPageStorageService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
@Tag(name = "Landing", description = "Public landing page assets")
public class LandingPageController {

    private final LandingPageStorageService landingPageStorageService;

    /**
     * Возвращает публичные URL четырёх изображений лендинга из бакета landing-page.
     * Доступ без аутентификации.
     */
    @GetMapping("/images")
    @Operation(summary = "Get landing images", description = "Returns public URLs for landing page images.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Image URLs retrieved",
                    content = @Content(schema = @Schema(implementation = LandingPageImagesDto.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<LandingPageImagesDto> getLandingImages() {
        return ResponseEntity.ok(landingPageStorageService.getLandingPageImageUrls());
    }
}
