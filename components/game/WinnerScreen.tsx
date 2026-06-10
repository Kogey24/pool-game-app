"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { GameAction } from "@/hooks/useGameState";
import type { GameState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WinnerScreenProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

export function WinnerScreen({ state, dispatch }: WinnerScreenProps) {
  const reduceMotion = useReducedMotion();
  const winner = state.winnerIndex === null ? null : state.players[state.winnerIndex];
  const ranked = [...state.players].sort((a, b) => b.score - a.score);

  if (!winner) return null;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-6 sm:px-6">
      <div className="text-center">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-accent-amber bg-amber-500/10 text-amber-200"
          initial={reduceMotion ? {} : { scale: 0.72, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <Trophy aria-hidden className="h-10 w-10" />
        </motion.div>

        <h1 className="font-display text-4xl font-bold uppercase leading-none text-pool-text">
          {winner.name} wins!
        </h1>
        <p className="mt-3 text-sm text-pool-muted">
          Final score: {winner.score} marks - unbeatable
        </p>
      </div>

      <section className="mt-7 rounded-xl border border-pool-border bg-pool-card p-3 shadow-[var(--shadow-card)]">
        <div className="grid gap-2">
          {ranked.map((player, index) => {
            const isWinner = player.id === winner.id;

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-transparent px-3 py-3",
                  isWinner && "border-accent-green bg-accent-green/10",
                )}
                initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                key={player.id}
                transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-pool-surface text-xs text-pool-muted">
                  {isWinner ? (
                    <Trophy aria-hidden className="h-4 w-4 text-amber-200" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="min-w-0 truncate text-sm text-pool-text">
                  {player.name}
                </span>
                <span
                  className={cn(
                    "font-display text-2xl font-bold",
                    player.score < 0 ? "text-accent-red" : "text-pool-text",
                  )}
                >
                  {player.score}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Button
        className="mt-5 w-full"
        onClick={() => dispatch({ type: "NEW_GAME" })}
        size="lg"
        variant="primary"
      >
        Play Again
      </Button>
    </main>
  );
}
