package io.github.flashlearn.app.user_stats.controller;

import io.github.flashlearn.app.auth.service.AuthService;
import io.github.flashlearn.app.user_stats.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserStatsController {

    private final UserStatsService userStatsService;
    private final AuthService authService;

    @GetMapping("/ping") // redundant parameter, userId is already in security context
    public ResponseEntity<?> ping() {
        userStatsService.updateStreak();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user-stats/progress") // redundant parameter, userId is already in security context
    public ResponseEntity<?> addProgress(@RequestBody Map<String, Integer> payload) {
        int reviewed = payload.getOrDefault("reviewed", 1);
        return ResponseEntity.ok(userStatsService.addReviewed(reviewed));
    }

}
