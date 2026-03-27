package io.github.flashlearn.app.flashcard.dto;

public record CreateFlashCardRequest(
        String question,
        String answer
) { }
