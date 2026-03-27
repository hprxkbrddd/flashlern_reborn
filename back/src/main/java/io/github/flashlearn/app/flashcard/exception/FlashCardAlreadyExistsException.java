package io.github.flashlearn.app.flashcard.exception;

public class FlashCardAlreadyExistsException extends RuntimeException {

    private final String question;

    public FlashCardAlreadyExistsException(String question) {
        super("Flashcard with question: '" + question + "' already exists");
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }
}
