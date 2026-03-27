package io.github.flashlearn.app.storage.controller;

import io.github.flashlearn.app.storage.dto.LandingPageImagesDto;
import io.github.flashlearn.app.storage.service.LandingPageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/landing")
@RequiredArgsConstructor
public class LandingPageController {

    private final LandingPageStorageService landingPageStorageService;

    /**
     * Возвращает публичные URL четырёх изображений лендинга из бакета landing-page.
     * Доступ без аутентификации.
     */
    @GetMapping("/images")
    public ResponseEntity<LandingPageImagesDto> getLandingImages() {
        return ResponseEntity.ok(landingPageStorageService.getLandingPageImageUrls());
    }
}
