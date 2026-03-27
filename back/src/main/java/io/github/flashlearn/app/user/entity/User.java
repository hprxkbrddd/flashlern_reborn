package io.github.flashlearn.app.user.entity;

import io.github.flashlearn.app.flashcard.entity.FlashCardSet;
import io.github.flashlearn.app.settings.entity.UserSettings;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User { // User is no longer instance of UserDetails and belongs only to domain layer (not security)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String aboutMe;

    @Column(name = "avatar_key")
    private String avatarKey;

    @Column(nullable = false)
    private String password;

    // For the future improvements
    @Column(nullable = false, unique = true)
    private String email;
    /*
    * 1. Contains @ and variations of <email>.<com>
    * 2. Email exists
    */

    private boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    private Role role; // TODO make CSV string (user can have multiple roles)

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserSettings userSettings;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserStats userStats;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(FetchMode.SUBSELECT)
    private List<FlashCardSet> flashCardSets = new ArrayList<>();

    public User(String username, String password, String email, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }
}
