package io.github.flashlearn.app.flashcard.entity;

import io.github.flashlearn.app.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "flashcard_set")
public class FlashCardSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    private List<String> tags;

    @Column(name = "is_saved", columnDefinition = "TINYINT(1)")
    private boolean isSaved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "set", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlashCard> flashCards = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
