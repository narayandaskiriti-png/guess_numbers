package com.numberly.api.game;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "games")
public class Game {
    @Id
    private String id;
    private int targetNumber;
    private int attempts;
    private boolean completed;
    private Instant createdAt;
    private Instant completedAt;

    protected Game() {
    }

    public Game(int targetNumber) {
        this.id = UUID.randomUUID().toString();
        this.targetNumber = targetNumber;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public int getTargetNumber() { return targetNumber; }
    public int getAttempts() { return attempts; }
    public boolean isCompleted() { return completed; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getCompletedAt() { return completedAt; }

    public void recordAttempt() { attempts++; }
    public void complete() {
        completed = true;
        completedAt = Instant.now();
    }
}
