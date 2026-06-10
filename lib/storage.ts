import type { SerializedGameState } from "@/lib/types";

export const STORAGE_KEY = "pool-marks-v1";

function isSerializedGameState(value: unknown): value is SerializedGameState {
  if (!value || typeof value !== "object") return false;

  const state = value as SerializedGameState;
  return (
    (state.screen === "game" || state.screen === "winner") &&
    Array.isArray(state.players) &&
    Array.isArray(state.ballsOnTable) &&
    Array.isArray(state.log) &&
    typeof state.currentPlayerIndex === "number" &&
    typeof state.turnPoints === "number"
  );
}

export function saveGame(state: SerializedGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can fail in private browsing or restricted embeds.
  }
}

export function loadGame(): SerializedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    return isSerializedGameState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
