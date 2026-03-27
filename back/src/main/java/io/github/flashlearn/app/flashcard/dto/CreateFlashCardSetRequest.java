package io.github.flashlearn.app.flashcard.dto;

import io.github.flashlearn.app.flashcard.entity.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateFlashCardSetRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull Visibility visibility,
        @NotEmpty List<String> tags,
        @NotEmpty List<CreateFlashCardRequest> flashCards
) { }
