package io.github.flashlearn.app.flashcard.dto;

import io.github.flashlearn.app.flashcard.entity.Visibility;

import java.util.List;

public record FlashCardSetResponse(
        Long id,
        String title,
        String description,
        Visibility visibility,
        List<String> tags,
        boolean isSaved,
        List<FlashCardResponse> flashCards
) { }
