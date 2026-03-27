package io.github.flashlearn.app.flashcard.repository;

import io.github.flashlearn.app.flashcard.entity.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
}
