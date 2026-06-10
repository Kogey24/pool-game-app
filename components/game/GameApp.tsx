"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameScreen } from "@/components/game/GameScreen";
import { SetupScreen } from "@/components/game/SetupScreen";
import { WinnerScreen } from "@/components/game/WinnerScreen";
import {
  NotificationToast,
  type ToastMessage,
} from "@/components/ui/NotificationToast";
import { useGameState } from "@/hooks/useGameState";
import type { PlayerStatus } from "@/lib/types";

export default function GameApp() {
  const {
    state,
    statuses,
    currentBall,
    pointsOnTable,
    hasSavedGame,
    dispatch,
    resumeGame,
  } = useGameState();
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const previousStatuses = useRef<Record<string, PlayerStatus> | null>(null);

  const dismissMessage = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  useEffect(() => {
    if (state.screen !== "game") {
      previousStatuses.current = null;
      return;
    }

    const previous = previousStatuses.current;
    const next = Object.fromEntries(
      statuses.map((player) => [player.id, player.status]),
    ) as Record<string, PlayerStatus>;

    if (!previous) {
      previousStatuses.current = next;
      return;
    }

    const freshMessages: ToastMessage[] = [];

    statuses.forEach((player) => {
      const previousStatus = previous[player.id];
      if (!previousStatus || previousStatus === player.status) return;

      if (player.status === "eliminated") {
        freshMessages.push({
          id: `${player.id}-${Date.now()}-out`,
          type: "eliminated",
          message: `${player.name} has been eliminated - cannot catch up`,
        });
        return;
      }

      if (previousStatus === "eliminated") {
        freshMessages.push({
          id: `${player.id}-${Date.now()}-back`,
          type: "back",
          message: `${player.name} is back in the game`,
        });
      }
    });

    if (freshMessages.length > 0) {
      setMessages((current) => [...freshMessages, ...current].slice(0, 3));
    }

    previousStatuses.current = next;
  }, [state.screen, statuses]);

  return (
    <>
      {state.screen === "setup" && (
        <SetupScreen
          hasSavedGame={hasSavedGame}
          onResume={resumeGame}
          onStart={(players) => dispatch({ type: "START_GAME", players })}
        />
      )}

      {state.screen === "game" && (
        <GameScreen
          currentBall={currentBall}
          dispatch={dispatch}
          pointsOnTable={pointsOnTable}
          state={state}
          statuses={statuses}
        />
      )}

      {state.screen === "winner" && (
        <WinnerScreen dispatch={dispatch} state={state} />
      )}

      <NotificationToast messages={messages} onDismiss={dismissMessage} />
    </>
  );
}
