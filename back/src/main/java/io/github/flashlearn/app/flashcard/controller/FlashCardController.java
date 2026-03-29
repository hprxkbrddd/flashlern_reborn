package io.github.flashlearn.app.flashcard.controller;

import io.github.flashlearn.app.flashcard.dto.*;
import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import io.github.flashlearn.app.flashcard.mapper.FlashCardSetMapper;
import io.github.flashlearn.app.flashcard.service.FlashCardService;
import io.github.flashlearn.app.common.dto.ApiError;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/flashcards")
@Tag(name = "Flashcards", description = "Flashcard set management")
@SecurityRequirement(name = "bearerAuth")
public class FlashCardController {

    private final FlashCardService flashCardService;
    private final FlashCardSetMapper mapper;

    /**
     * Создание новой флешкарты. Требуется аутентификация.
     * Карточка автоматически привязывается к текущему пользователю.
     */
    @PostMapping("/create")
    @Operation(summary = "Create flashcard set", description = "Creates a new flashcard set for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Flashcard set created",
                    content = @Content(schema = @Schema(implementation = FlashCardSetResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Validation error or malformed body",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FlashCardSetResponse> createFlashCardSet(@Valid @RequestBody CreateFlashCardSetRequest request) {
        FlashCardSet createdSet = flashCardService.createFlashCardSet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toFlashCardSetResponse(createdSet));
    }

    /**
     * Получение всех флешкарт текущего пользователя. Требуется аутентификация.
     * Пользователь получает только свои карточки.
     */
    @GetMapping
    @Operation(summary = "Get current user flashcard sets", description = "Returns all flashcard sets of the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Flashcard sets retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FlashCardSetResponse.class)))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<List<FlashCardSetResponse>> getAllFlashCards() { // доступ по id оставить для админа
        // Сервис проверяет, что userId соответствует текущему аутентифицированному пользователю
        List<FlashCardSetResponse> flashCards = flashCardService.getAllFlashCardSets()
                .stream()
                .map(mapper::toFlashCardSetResponse)
                .toList();

        return ResponseEntity.ok(flashCards);
    }

    @GetMapping("/user/{id}")
    @Operation(summary = "Get flashcard sets by user id", description = "Returns all flashcard sets for a specific user id.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Flashcard sets retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FlashCardSetResponse.class)))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid user id",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<List<FlashCardSetResponse>> getAllFlashCards(@PathVariable Long id) {
        // Сервис проверяет, что userId соответствует текущему аутентифицированному пользователю
        List<FlashCardSetResponse> flashCards = flashCardService.getAllFlashCardSets(id)
                .stream()
                .map(mapper::toFlashCardSetResponse)
                .toList();

        return ResponseEntity.ok(flashCards);
    }

    @GetMapping("/getSet/{id}")
    @Operation(summary = "Get flashcard set", description = "Returns flashcard set by id.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Flashcard set retrieved",
                    content = @Content(schema = @Schema(implementation = FlashCardSetResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid set id",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Flashcard set not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FlashCardSetResponse> getFlashCardSet(@PathVariable Long id) {
        FlashCardSetResponse flashCardSetResponse = mapper.toFlashCardSetResponse(flashCardService.getFlashCardSet(id));
        return ResponseEntity.status(HttpStatus.OK).body(flashCardSetResponse);
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete flashcard set", description = "Deletes flashcard set by id.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Flashcard set deleted",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid set id",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<Void> deleteFlashCardSet(@PathVariable Long id) {
        flashCardService.deleteFlashCardSet(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/edit/{id}")
    @Operation(summary = "Edit flashcard set", description = "Updates editable fields of an existing flashcard set.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Flashcard set updated",
                    content = @Content(schema = @Schema(implementation = FlashCardSetResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request body or invalid id",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Flashcard set not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<FlashCardSetResponse> editFlashCardSet(@RequestBody EditFlashCardSetRequest request, // removed valid, cuz no fields are mapped with constraint annotations
                                                                 @PathVariable Long id) {
        FlashCardSet flashCardSet = flashCardService.editFlashCardSet(mapper.toFlashCardSet(request), id);
        return ResponseEntity.status(HttpStatus.OK).body(mapper.toFlashCardSetResponse(flashCardSet));
    }

    @PostMapping("/save/{id}")
    @Operation(summary = "Save or unsave flashcard set", description = "Updates saved flag for flashcard set.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Saved state updated",
                    content = @Content(schema = @Schema(implementation = SaveFlashCardSetResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request body or invalid id",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Flashcard set not found",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error",
                    content = @Content(schema = @Schema(implementation = ApiError.class))
            )
    })
    public ResponseEntity<SaveFlashCardSetResponse> saveFlashCardSet(@PathVariable Long id,
                                                                     @RequestBody SaveFlashCardSetRequest request) {
        // TODO edit contract
        SaveFlashCardSetResponse response = mapper.toSaveFlashCardSetResponse(flashCardService.saveFlashCardSet(id, request));
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
