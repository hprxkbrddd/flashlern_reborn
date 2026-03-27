package io.github.flashlearn.app.flashcard.repository;

import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashCardSetRepository extends JpaRepository<FlashCardSet, Long> {
    List<FlashCardSet> findAllByOwner_Id(Long ownerId);
}
