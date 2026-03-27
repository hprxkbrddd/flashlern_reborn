package io.github.flashlearn.app.settings.entity;

import io.github.flashlearn.app.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_settings")
public class UserSettings {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Language language;
    private boolean darkMode;
    private boolean autoPlay;
    private boolean showHints;

    public UserSettings() {
        this.language = Language.EN;
        this.darkMode = false;
        this.showHints = true;
        this.autoPlay = false;
    }

    public UserSettings(String language, boolean theme, boolean notificationsEnabled, boolean autoPlay) {
        this.language = Language.valueOf(language.toUpperCase());
        this.darkMode = theme;
        this.showHints = notificationsEnabled;
        this.autoPlay = autoPlay;
    }
}
