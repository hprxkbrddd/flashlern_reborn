package io.github.flashlearn.app.flashcard.dto;

public record FlashCardResponse(
        Long id,
        String question,
        String answer
) { }
