package io.github.flashlearn.app.user_stats.entity;

import io.github.flashlearn.app.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id // removed @GeneratedValue cuz @MapsId
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate lastLoginDate;
    private int streak;
    private int dailyGoal;
    private boolean dailyGoalCompleted;
    private int reviewedToday;
    private LocalDate reviewedDate;

    public UserStats() {
        this.lastLoginDate = LocalDate.now();
        this.streak = 1;
        this.dailyGoal = 50;
        this.dailyGoalCompleted = false;
        this.reviewedToday = 0;
        this.reviewedDate = LocalDate.now();
    }
}
