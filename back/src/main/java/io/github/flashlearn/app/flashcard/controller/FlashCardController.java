package io.github.flashlearn.app.flashcard.controller;

import io.github.flashlearn.app.flashcard.dto.*;
import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import io.github.flashlearn.app.flashcard.mapper.FlashCardSetMapper;
import io.github.flashlearn.app.flashcard.service.FlashCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flashcards")
public class FlashCardController {

    private final FlashCardService flashCardService;
    private final FlashCardSetMapper mapper;

    /**
     * Создание новой флешкарты. Требуется аутентификация.
     * Карточка автоматически привязывается к текущему пользователю.
     */
    @PostMapping("/create")
    public ResponseEntity<FlashCardSetResponse> createFlashCardSet(@Valid @RequestBody CreateFlashCardSetRequest request) {
        FlashCardSet createdSet = flashCardService.createFlashCardSet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toFlashCardSetResponse(createdSet));
    }

    /**
     * Получение всех флешкарт текущего пользователя. Требуется аутентификация.
     * Пользователь получает только свои карточки.
     */
    @GetMapping
    public ResponseEntity<List<FlashCardSetResponse>> getAllFlashCards() { // доступ по id оставить для админа
        // Сервис проверяет, что userId соответствует текущему аутентифицированному пользователю
        List<FlashCardSetResponse> flashCards = flashCardService.getAllFlashCardSets()
                .stream()
                .map(mapper::toFlashCardSetResponse)
                .toList();

        return ResponseEntity.ok(flashCards);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<FlashCardSetResponse>> getAllFlashCards(Long id) {
        // Сервис проверяет, что userId соответствует текущему аутентифицированному пользователю
        List<FlashCardSetResponse> flashCards = flashCardService.getAllFlashCardSets(id)
                .stream()
                .map(mapper::toFlashCardSetResponse)
                .toList();

        return ResponseEntity.ok(flashCards);
    }

    @GetMapping("/getSet/{id}")
    public ResponseEntity<FlashCardSetResponse> getFlashCardSet(@PathVariable Long id) {
        FlashCardSetResponse flashCardSetResponse = mapper.toFlashCardSetResponse(flashCardService.getFlashCardSet(id));
        return ResponseEntity.status(HttpStatus.OK).body(flashCardSetResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFlashCardSet(@PathVariable Long id) {
        flashCardService.deleteFlashCardSet(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<FlashCardSetResponse> editFlashCardSet(@RequestBody EditFlashCardSetRequest request, // removed valid, cuz no fields are mapped with constraint annotations
                                                                 @PathVariable Long id) {
        FlashCardSet flashCardSet = flashCardService.editFlashCardSet(mapper.toFlashCardSet(request), id);
        return ResponseEntity.status(HttpStatus.OK).body(mapper.toFlashCardSetResponse(flashCardSet));
    }

    @PostMapping("/save/{id}")
    public ResponseEntity<SaveFlashCardSetResponse> saveFlashCardSet(@PathVariable Long id,
                                                                     @RequestBody SaveFlashCardSetRequest request) {
        // TODO edit contract
        SaveFlashCardSetResponse response = mapper.toSaveFlashCardSetResponse(flashCardService.saveFlashCardSet(id, request));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
