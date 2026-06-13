"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Flag, RotateCcw, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionPanel } from "@/components/ui/ActionPanel";
import { Ball } from "@/components/ui/Ball";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { GameLog } from "@/components/ui/GameLog";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { TableArea } from "@/components/ui/TableArea";
import { TurnBanner } from "@/components/ui/TurnBanner";
import { leaderIndex } from "@/lib/game-engine";
import type { GameAction } from "@/hooks/useGameState";
import type { GameState, PlayerWithStatus } from "@/lib/types";

interface GameScreenProps {
  state: GameState;
  statuses: PlayerWithStatus[];
  currentBall: number | null;
  pointsOnTable: number;
  dispatch: (action: GameAction) => void;
}

export function GameScreen({
  state,
  statuses,
  currentBall,
  pointsOnTable,
  dispatch,
}: GameScreenProps) {
  const [draggingBall, setDraggingBall] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const currentPlayer = state.players[state.currentPlayerIndex] ?? null;
  const leaderScore = useMemo(() => {
    const index = leaderIndex(state.players, state.currentPlayerIndex);
    return state.players[index]?.score ?? 0;
  }, [state.currentPlayerIndex, state.players]);

  function selectBall(
    ball: number,
    hint: "pot" | "foul" | "draw" | null = null,
  ) {
    dispatch({ type: "SELECT_BALL", ball, hint });
  }

  function onDragStart(event: DragStartEvent) {
    const ball = event.active.data.current?.ball;
    setDraggingBall(typeof ball === "number" ? ball : null);
  }

  function onDragEnd(event: DragEndEvent) {
    const ball = event.active.data.current?.ball;
    const zone = event.over?.id;
    setDraggingBall(null);

    if (typeof ball !== "number") return;
    if (zone === "pot") {
      dispatch({ type: "CONFIRM_ACTION", action: "pot", ball });
    }
    if (zone === "draw") {
      dispatch({ type: "CONFIRM_ACTION", action: "draw", ball });
    }
    if (zone === "foul") selectBall(ball, "foul");
  }

  function newGame() {
    if (window.confirm("Start a new game? Current progress will be cleared.")) {
      dispatch({ type: "NEW_GAME" });
    }
  }

  function endGame() {
    if (window.confirm("End this game now and declare the current leader?")) {
      dispatch({ type: "END_GAME" });
    }
  }

  if (!currentPlayer) return null;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-pool-muted">
            Pool Marks
          </p>
          <h1 className="font-display text-3xl font-bold uppercase leading-none text-pool-text">
            Scoreboard
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label="Undo"
            disabled={state.history.length === 0}
            icon={<Undo2 aria-hidden className="h-4 w-4" />}
            onClick={() => dispatch({ type: "UNDO" })}
            size="icon"
            variant="secondary"
          />
          <Button
            aria-label="New game"
            icon={<RotateCcw aria-hidden className="h-4 w-4" />}
            onClick={newGame}
            size="icon"
            variant="ghost"
          />
          <Button
            aria-label="End game"
            icon={<Flag aria-hidden className="h-4 w-4" />}
            onClick={endGame}
            size="icon"
            variant="amber"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.1fr)] lg:items-start">
        <section className="grid gap-3">
          <TurnBanner
            currentBall={currentBall}
            player={currentPlayer}
            turnPoints={state.turnPoints}
          />

          <div className="grid gap-2">
            {statuses.map((player, index) => (
              <PlayerCard
                isCurrent={index === state.currentPlayerIndex}
                key={player.id}
                leaderScore={leaderScore}
                player={player}
                pointsOnTable={pointsOnTable}
                turnPoints={state.turnPoints}
              />
            ))}
          </div>
        </section>

        <DndContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          sensors={sensors}
        >
          <section className="grid gap-3">
            <TableArea
              balls={state.ballsOnTable}
              currentBall={currentBall}
              onRemoveBall={(ball) => dispatch({ type: "REMOVE_BALL", ball })}
              onSelectBall={(ball) => selectBall(ball)}
              pointsOnTable={pointsOnTable}
            />

            <div className="grid grid-cols-3 gap-3">
              <DropZone id="pot" />
              <DropZone id="draw" />
              <DropZone id="foul" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => dispatch({ type: "MISS" })}
                variant="secondary"
              >
                Miss
              </Button>
              <Button
                disabled={state.history.length === 0}
                icon={<Undo2 aria-hidden className="h-4 w-4" />}
                onClick={() => dispatch({ type: "UNDO" })}
                variant="ghost"
              >
                Undo
              </Button>
            </div>

            <GameLog entries={state.log} />
          </section>

          <DragOverlay dropAnimation={null}>
            {draggingBall === null ? null : (
              <Ball
                isCurrent={draggingBall === currentBall}
                isDragging
                number={draggingBall}
                size="lg"
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <ActionPanel
        ball={state.pendingBall}
        currentBall={currentBall}
        hint={state.pendingActionHint}
        onCancel={() => dispatch({ type: "CANCEL_ACTION" })}
        onConfirm={(action, ball) =>
          dispatch({ type: "CONFIRM_ACTION", action, ball })
        }
        player={currentPlayer}
      />
    </main>
  );
}
