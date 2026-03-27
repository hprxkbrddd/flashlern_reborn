package io.github.flashlearn.app.settings.repository;

import io.github.flashlearn.app.settings.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser_Id(Long id);
}
