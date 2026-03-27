package io.github.flashlearn.app.flashcard.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "flashcards")
public class FlashCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "set_id")
    private FlashCardSet set;

    public FlashCard(){}
}
