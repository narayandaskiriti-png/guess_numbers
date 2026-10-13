package com.numberly.api.game;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {
    private final GameRepository repository;

    public GameService(GameRepository repository) {
        this.repository = repository;
    }

    public Game startGame() {
        return repository.save(new Game(ThreadLocalRandom.current().nextInt(1, 101)));
    }

    public GuessResponse guess(String id, int guess) {
        Game game = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found"));
        if (game.isCompleted()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This game is already complete");
        }
        game.recordAttempt();
        if (guess == game.getTargetNumber()) {
            game.complete();
            repository.save(game);
            return new GuessResponse("correct", "You got it!", game.getAttempts(), true);
        }
        repository.save(game);
        String direction = guess < game.getTargetNumber() ? "higher" : "lower";
        return new GuessResponse(direction, "Try a little " + direction + ".", game.getAttempts(), false);
    }

    public List<Game> history() {
        return repository.findTop10ByCompletedTrueOrderByCompletedAtDesc();
    }

    public record GuessResponse(String result, String message, int attempts, boolean completed) {}
}
