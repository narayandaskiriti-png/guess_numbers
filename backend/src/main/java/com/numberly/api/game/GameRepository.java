package com.numberly.api.game;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, String> {
    List<Game> findTop10ByCompletedTrueOrderByCompletedAtDesc();
}
