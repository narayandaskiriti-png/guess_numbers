package com.numberly.api.game;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {
    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    @PostMapping("/games")
    @ResponseStatus(HttpStatus.CREATED)
    public Game start() {
        return service.startGame();
    }

    @PostMapping("/games/{id}/guesses")
    public GameService.GuessResponse guess(
            @PathVariable String id,
            @RequestBody GuessRequest request) {
        return service.guess(id, request.guess());
    }

    @GetMapping("/games/history")
    public List<Game> history() {
        return service.history();
    }

    public record GuessRequest(@Min(1) @Max(100) int guess) {}
}
