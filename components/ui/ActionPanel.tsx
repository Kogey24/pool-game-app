"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleCheck, CircleX, Minus, X } from "lucide-react";
import { Ball } from "@/components/ui/Ball";
import { Button } from "@/components/ui/Button";
import { ballPoints, canScorePottedBall } from "@/lib/game-engine";
import type { ActionHint, ActionType, Player } from "@/lib/types";

interface ActionPanelProps {
  ball: number | null;
  currentBall: number | null;
  player: Player | null;
  hint: ActionHint;
  onCancel: () => void;
  onConfirm: (action: ActionType, ball: number) => void;
}

export function ActionPanel({
  ball,
  currentBall,
  player,
  hint,
  onCancel,
  onConfirm,
}: ActionPanelProps) {
  const reduceMotion = useReducedMotion();
  const isOpen = ball !== null && player !== null;

  const selectedPoints = ball === null ? 0 : ballPoints(ball);
  const currentPoints = currentBall === null ? 0 : ballPoints(currentBall);
  const canPot =
    ball !== null &&
    currentBall !== null &&
    canScorePottedBall(ball, currentBall);
  const showWrongBall = ball !== null && currentBall !== null && ball !== currentBall;
  const showFoulOptions = hint === "foul";

  return (
    <AnimatePresence>
      {isOpen && ball !== null && player !== null && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-end justify-center bg-[var(--color-bg-overlay)] px-0 sm:items-center sm:px-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.section
            animate={{ y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-t-2xl border-t border-pool-border bg-pool-card p-4 shadow-2xl sm:rounded-xl sm:border"
            exit={reduceMotion ? {} : { y: "100%", scale: 0.98 }}
            initial={reduceMotion ? {} : { y: "100%", scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Ball isCurrent={canPot} number={ball} size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-semibold uppercase text-pool-text">
                  Ball {ball} - {selectedPoints} marks
                </p>
                <p className="truncate text-sm text-pool-muted">
                  {player.name} - {showFoulOptions ? "which foul?" : "what happened?"}
                </p>
                {showWrongBall && (
                  <p className="mt-1 text-xs text-amber-200">
                    Current ball is {currentBall}
                  </p>
                )}
              </div>
              <Button
                aria-label="Cancel action"
                icon={<X aria-hidden className="h-4 w-4" />}
                onClick={onCancel}
                size="icon"
                variant="ghost"
              />
            </div>

            <div className="grid gap-2">
              {!showFoulOptions && (
                <Button
                  className={hint === "pot" ? "ring-2 ring-white/20" : undefined}
                  disabled={!canPot}
                  icon={<CircleCheck aria-hidden className="h-4 w-4" />}
                  onClick={() => onConfirm("pot", ball)}
                  variant="primary"
                >
                  +{selectedPoints} marks Potted cleanly
                </Button>
              )}

              <Button
                className={hint === "foul" ? "ring-2 ring-white/20" : undefined}
                icon={<CircleX aria-hidden className="h-4 w-4" />}
                onClick={() => onConfirm("white_foul", ball)}
                variant="danger"
              >
                -{currentPoints} marks White ball pocketed
              </Button>

              {showWrongBall && (
                <Button
                  icon={<CircleX aria-hidden className="h-4 w-4" />}
                  onClick={() => onConfirm("wrong_ball", ball)}
                  variant="danger"
                >
                  -{selectedPoints} marks Wrong ball hit
                </Button>
              )}

              {!showFoulOptions && (
                <Button
                  className={hint === "draw" ? "ring-2 ring-white/20" : undefined}
                  icon={<Minus aria-hidden className="h-4 w-4" />}
                  onClick={() => onConfirm("draw", ball)}
                  variant="secondary"
                >
                  Draw - no score change
                </Button>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
