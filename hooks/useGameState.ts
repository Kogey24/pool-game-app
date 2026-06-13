"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  PLAY_ORDER,
  PLAYER_COLORS,
  ballPoints,
  canScorePottedBall,
  checkWinner,
  computePlayerStatuses,
  leaderIndex,
  nextActivePlayer,
  tableSum,
  toInitials,
} from "@/lib/game-engine";
import { clearGame, loadGame, saveGame } from "@/lib/storage";
import type {
  ActionHint,
  ActionType,
  GameState,
  LogEntry,
  Player,
  SerializedGameState,
} from "@/lib/types";

export type GameAction =
  | { type: "START_GAME"; players: { name: string }[] }
  | { type: "SELECT_BALL"; ball: number; hint?: ActionHint }
  | { type: "CONFIRM_ACTION"; action: ActionType; ball: number }
  | { type: "REMOVE_BALL"; ball: number }
  | { type: "CANCEL_ACTION" }
  | { type: "MISS" }
  | { type: "UNDO" }
  | { type: "END_GAME" }
  | { type: "NEW_GAME" }
  | { type: "RESTORE"; state: SerializedGameState };

export const initialGameState: GameState = {
  screen: "setup",
  players: [],
  currentPlayerIndex: 0,
  ballsOnTable: [],
  log: [],
  turnPoints: 0,
  pendingBall: null,
  pendingActionHint: null,
  winnerIndex: null,
  history: [],
};

export function serializeState(state: GameState): SerializedGameState {
  return {
    screen: state.screen,
    players: state.players,
    currentPlayerIndex: state.currentPlayerIndex,
    ballsOnTable: state.ballsOnTable,
    log: state.log,
    turnPoints: state.turnPoints,
    pendingBall: null,
    winnerIndex: state.winnerIndex,
  };
}

function hydrateState(state: SerializedGameState): GameState {
  return {
    ...state,
    pendingBall: null,
    pendingActionHint: null,
    history: [],
  };
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pushHistory(state: GameState): GameState {
  return {
    ...state,
    history: [...state.history.slice(-19), serializeState(state)],
  };
}

function addLog(
  state: GameState,
  text: string,
  delta: number,
  player = state.players[state.currentPlayerIndex],
): LogEntry[] {
  if (!player) return state.log;

  return [
    {
      id: createId(),
      playerId: player.id,
      playerName: player.name,
      text,
      delta,
      timestamp: Date.now(),
    },
    ...state.log,
  ].slice(0, 50);
}

function updatePlayerScore(
  players: Player[],
  playerIndex: number,
  delta: number,
): Player[] {
  return players.map((player, index) =>
    index === playerIndex
      ? {
          ...player,
          score: player.score + delta,
        }
      : player,
  );
}

function finishUpdate(state: GameState): GameState {
  const winnerIndex = checkWinner(
    state.players,
    state.ballsOnTable,
    state.currentPlayerIndex,
  );

  return {
    ...state,
    screen: winnerIndex === null ? state.screen : "winner",
    winnerIndex,
    pendingBall: null,
    pendingActionHint: null,
  };
}

function createPlayers(players: { name: string }[]): Player[] {
  return players.slice(0, 6).map((player, index) => {
    const fallbackName = `Player ${index + 1}`;
    const name = player.name.trim() || fallbackName;

    return {
      id: createId(),
      name,
      score: 0,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      initials: toInitials(name),
    };
  });
}

function endTurn(state: GameState, players = state.players): number {
  return nextActivePlayer(state.currentPlayerIndex, players, state.ballsOnTable);
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const players = createPlayers(action.players);
      if (players.length < 2) return state;

      return {
        ...initialGameState,
        screen: "game",
        players,
        ballsOnTable: [...PLAY_ORDER],
        history: [serializeState(state)],
      };
    }

    case "SELECT_BALL":
      if (state.screen !== "game" || !state.ballsOnTable.includes(action.ball)) {
        return state;
      }

      return {
        ...state,
        pendingBall: action.ball,
        pendingActionHint: action.hint ?? null,
      };

    case "CANCEL_ACTION":
      return {
        ...state,
        pendingBall: null,
        pendingActionHint: null,
      };

    case "CONFIRM_ACTION": {
      if (state.screen !== "game" || !state.ballsOnTable.includes(action.ball)) {
        return state;
      }

      const currentPlayer = state.players[state.currentPlayerIndex];
      if (!currentPlayer) return state;

      const previous = pushHistory(state);
      const currentBall = state.ballsOnTable[0];
      let players = previous.players;
      let ballsOnTable = previous.ballsOnTable;
      let currentPlayerIndex = previous.currentPlayerIndex;
      let turnPoints = previous.turnPoints;
      let log = previous.log;

      if (action.action === "pot") {
        if (
          currentBall === undefined ||
          !canScorePottedBall(action.ball, currentBall)
        ) {
          return state;
        }

        const delta = ballPoints(action.ball);
        players = updatePlayerScore(players, currentPlayerIndex, delta);
        ballsOnTable = ballsOnTable.filter((ball) => ball !== action.ball);
        turnPoints += delta;
        log = addLog(previous, `potted ball ${action.ball}`, delta);
      }

      if (action.action === "white_foul") {
        const delta = -ballPoints(currentBall);
        players = updatePlayerScore(players, currentPlayerIndex, delta);
        log = addLog(
          previous,
          `white ball foul on ball ${currentBall}`,
          delta,
        );
        currentPlayerIndex = endTurn({ ...previous, players, ballsOnTable }, players);
        turnPoints = 0;
      }

      if (action.action === "wrong_ball") {
        const delta = -ballPoints(action.ball);
        players = updatePlayerScore(players, currentPlayerIndex, delta);
        log = addLog(previous, `hit wrong ball ${action.ball}`, delta);
        currentPlayerIndex = endTurn({ ...previous, players, ballsOnTable }, players);
        turnPoints = 0;
      }

      if (action.action === "draw") {
        const removedBall =
          action.ball === currentBall
            ? ballsOnTable.filter((ball) => ball !== action.ball)
            : ballsOnTable;
        ballsOnTable = removedBall;
        log = addLog(previous, `draw on ball ${action.ball}`, 0);
        currentPlayerIndex = endTurn({ ...previous, ballsOnTable }, players);
        turnPoints = 0;
      }

      return finishUpdate({
        ...previous,
        players,
        ballsOnTable,
        currentPlayerIndex,
        turnPoints,
        log,
      });
    }

    case "MISS": {
      if (state.screen !== "game") return state;

      const previous = pushHistory(state);
      const currentPlayerIndex = endTurn(previous);

      return finishUpdate({
        ...previous,
        currentPlayerIndex,
        turnPoints: 0,
        log: addLog(previous, "missed", 0),
      });
    }

    case "REMOVE_BALL": {
      if (state.screen !== "game" || !state.ballsOnTable.includes(action.ball)) {
        return state;
      }

      const previous = pushHistory(state);
      const ballsOnTable = previous.ballsOnTable.filter(
        (ball) => ball !== action.ball,
      );

      return finishUpdate({
        ...previous,
        ballsOnTable,
        log: addLog(previous, `removed ball ${action.ball} from rack`, 0),
      });
    }

    case "END_GAME": {
      if (state.screen !== "game") return state;

      const previous = pushHistory(state);
      const winnerIndex = leaderIndex(
        previous.players,
        previous.currentPlayerIndex,
      );

      return {
        ...previous,
        screen: "winner",
        winnerIndex,
        pendingBall: null,
        pendingActionHint: null,
      };
    }

    case "UNDO": {
      const snapshot = state.history[state.history.length - 1];
      if (!snapshot) return state;

      return {
        ...hydrateState(snapshot),
        history: state.history.slice(0, -1),
      };
    }

    case "RESTORE":
      return hydrateState(action.state);

    case "NEW_GAME":
      return initialGameState;

    default:
      return state;
  }
}

export function useGameState() {
  const [state, baseDispatch] = useReducer(reducer, initialGameState);
  const [savedState, setSavedState] = useState<SerializedGameState | null>(null);

  useEffect(() => {
    const loaded = loadGame();
    if (loaded?.screen === "game") {
      const timeout = window.setTimeout(() => setSavedState(loaded), 0);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (state.screen === "game" || state.screen === "winner") {
      saveGame(serializeState(state));
    }
  }, [state]);

  const dispatch = useCallback((action: GameAction) => {
    if (action.type === "NEW_GAME") {
      clearGame();
      setSavedState(null);
    }

    if (action.type === "START_GAME") {
      setSavedState(null);
    }

    baseDispatch(action);
  }, []);

  const resumeGame = useCallback(() => {
    if (!savedState) return;

    baseDispatch({ type: "RESTORE", state: savedState });
    setSavedState(null);
  }, [savedState]);

  const statuses = useMemo(
    () =>
      computePlayerStatuses(
        state.players,
        state.ballsOnTable,
        state.currentPlayerIndex,
      ),
    [state.ballsOnTable, state.currentPlayerIndex, state.players],
  );

  const currentPlayer = state.players[state.currentPlayerIndex] ?? null;
  const currentBall = state.ballsOnTable[0] ?? null;
  const pointsOnTable = useMemo(
    () => tableSum(state.ballsOnTable),
    [state.ballsOnTable],
  );

  return {
    state,
    statuses,
    currentPlayer,
    currentBall,
    pointsOnTable,
    hasSavedGame: savedState !== null,
    dispatch,
    resumeGame,
  };
}
