package io.github.flashlearn.app.flashcard.exception;

public class FlashCardNotFoundException extends RuntimeException {

    private final String question;

    public FlashCardNotFoundException(String question) {
        super("Flashcard with question '" + question + "' not found");
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }
}
