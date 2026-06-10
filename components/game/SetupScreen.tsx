"use client";

import { Plus, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Ball } from "@/components/ui/Ball";
import { Button } from "@/components/ui/Button";
import { PLAYER_COLORS } from "@/lib/game-engine";

interface SetupScreenProps {
  hasSavedGame: boolean;
  onResume: () => void;
  onStart: (players: { name: string }[]) => void;
}

export function SetupScreen({
  hasSavedGame,
  onResume,
  onStart,
}: SetupScreenProps) {
  const [players, setPlayers] = useState([{ name: "" }, { name: "" }]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (focusIndex === null) return;
    inputRefs.current[focusIndex]?.focus();
  }, [focusIndex, players.length]);

  function updatePlayer(index: number, name: string) {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { name } : player,
      ),
    );
  }

  function addPlayer() {
    if (players.length >= 6) return;

    setPlayers((current) => [...current, { name: "" }]);
    setFocusIndex(players.length);
  }

  function removePlayer(index: number) {
    if (players.length <= 2 || index < 2) return;
    setPlayers((current) =>
      current.filter((_, playerIndex) => playerIndex !== index),
    );
  }

  function startGame() {
    onStart(players);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-5 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <Ball number={8} size="lg" />
        </div>
        <h1 className="font-display text-5xl font-bold uppercase leading-none text-pool-text">
          Pool Marks
        </h1>
        <p className="mt-2 text-sm text-pool-muted">
          Kenya local pool - mark tracker
        </p>
      </div>

      <section className="rounded-xl border border-pool-border bg-pool-card p-4 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-pool-muted">
            Players
          </h2>
          <span className="text-xs text-pool-faint">{players.length}/6</span>
        </div>

        <div className="grid gap-3">
          {players.map((player, index) => (
            <div className="flex items-center gap-3" key={index}>
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-full"
                style={{
                  background: PLAYER_COLORS[index % PLAYER_COLORS.length],
                }}
              />
              <input
                aria-label={`Player ${index + 1} name`}
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-pool-border bg-pool-surface px-3 text-sm text-pool-text placeholder:text-pool-faint"
                onChange={(event) => updatePlayer(index, event.target.value)}
                placeholder={`Player ${index + 1}`}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                value={player.name}
              />
              <Button
                aria-label={`Remove player ${index + 1}`}
                disabled={index < 2}
                icon={<X aria-hidden className="h-4 w-4" />}
                onClick={() => removePlayer(index)}
                size="icon"
                variant="ghost"
              />
            </div>
          ))}
        </div>

        <Button
          className="mt-4 w-full justify-start"
          disabled={players.length >= 6}
          icon={<Plus aria-hidden className="h-4 w-4" />}
          onClick={addPlayer}
          variant="ghost"
        >
          Add player
        </Button>
      </section>

      <div className="mt-5 grid gap-3">
        <Button
          className="w-full"
          icon={<Play aria-hidden className="h-4 w-4 fill-current" />}
          onClick={startGame}
          size="lg"
          variant="primary"
        >
          Start Game
        </Button>

        {hasSavedGame && (
          <Button
            className="w-full"
            icon={<RotateCcw aria-hidden className="h-4 w-4" />}
            onClick={onResume}
            variant="amber"
          >
            Resume last game
          </Button>
        )}
      </div>
    </main>
  );
}
