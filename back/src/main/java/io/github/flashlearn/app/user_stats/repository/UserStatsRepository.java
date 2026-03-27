package io.github.flashlearn.app.user_stats.repository;

import io.github.flashlearn.app.user.entity.User;
import io.github.flashlearn.app.user_stats.entity.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);
    Optional<UserStats> findByUserId(Long userId);
}
