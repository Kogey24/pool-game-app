import type { Player, PlayerStatus, PlayerWithStatus } from "@/lib/types";

export const PLAY_ORDER = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2];

export const STRIPE_BALLS = [9, 10, 11, 12, 13, 14, 15];

export const PLAYER_COLORS = [
  "#1D9E75",
  "#E24B4A",
  "#378ADD",
  "#EF9F27",
  "#7F77DD",
  "#DB2777",
];

export function ballPoints(ball: number): number {
  if (ball >= 3 && ball <= 6) return 6;
  if (ball >= 7 && ball <= 15) return ball;
  if (ball === 1) return 16;
  if (ball === 2) return 17;
  return 0;
}

export function tableSum(balls: number[]): number {
  return balls.reduce((sum, ball) => sum + ballPoints(ball), 0);
}

export function leaderIndex(
  players: Player[],
  currentPlayerIndex = 0,
): number {
  if (players.length === 0) return -1;

  const maxScore = Math.max(...players.map((player) => player.score));
  if (players[currentPlayerIndex]?.score === maxScore) {
    return currentPlayerIndex;
  }

  return players.findIndex((player) => player.score === maxScore);
}

export function computePlayerStatuses(
  players: Player[],
  balls: number[],
  currentPlayerIndex = 0,
): PlayerWithStatus[] {
  if (players.length === 0) return [];

  const pointsOnTable = tableSum(balls);
  const leaderIdx = leaderIndex(players, currentPlayerIndex);
  const leaderScore = players[leaderIdx]?.score ?? 0;

  return players.map((player, index) => {
    let status: PlayerStatus;

    if (index === leaderIdx) {
      status = "lead";
    } else if (player.score + pointsOnTable < leaderScore) {
      status = "eliminated";
    } else {
      status = "active";
    }

    return {
      ...player,
      status,
      catchUpNeeded: Math.max(0, leaderScore - player.score),
      maxPossible: player.score + pointsOnTable,
    };
  });
}

export function checkWinner(
  players: Player[],
  balls: number[],
  currentPlayerIndex = 0,
): number | null {
  if (players.length === 0) return null;

  const leaderIdx = leaderIndex(players, currentPlayerIndex);
  const leaderScore = players[leaderIdx]?.score ?? 0;

  if (balls.length === 0) {
    return leaderIdx;
  }

  const pointsOnTable = tableSum(balls);
  const allOthersCantCatch = players.every((player, index) => {
    if (index === leaderIdx) return true;
    return leaderScore > player.score + pointsOnTable;
  });

  return allOthersCantCatch ? leaderIdx : null;
}

export function nextActivePlayer(
  currentIdx: number,
  players: Player[],
  balls: number[],
): number {
  if (players.length === 0) return 0;

  const statuses = computePlayerStatuses(players, balls, currentIdx);
  let next = (currentIdx + 1) % players.length;
  let tries = 0;

  while (
    statuses[next]?.status === "eliminated" &&
    tries < players.length
  ) {
    next = (next + 1) % players.length;
    tries += 1;
  }

  return next;
}

export function toInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}
