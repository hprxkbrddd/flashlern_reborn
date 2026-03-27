package io.github.flashlearn.app.flashcard.dto;

import io.github.flashlearn.app.flashcard.entity.Visibility;

import java.util.List;

public record EditFlashCardSetRequest(
        Long id,
        String title,
        String description,
        Visibility visibility,
        List<String> tags,
        List<FlashCardResponse> flashCards
) { }
