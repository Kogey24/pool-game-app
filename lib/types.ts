export type PlayerStatus = "active" | "lead" | "eliminated";

export type GameScreen = "setup" | "game" | "winner";

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
  initials: string;
}

export interface LogEntry {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  delta: number;
  timestamp: number;
}

export type ActionType =
  | "pot"
  | "white_foul"
  | "wrong_ball"
  | "draw"
  | "miss";

export type ActionHint = "pot" | "foul" | "draw" | null;

export interface SerializedGameState {
  screen: GameScreen;
  players: Player[];
  currentPlayerIndex: number;
  ballsOnTable: number[];
  log: LogEntry[];
  turnPoints: number;
  pendingBall: number | null;
  winnerIndex: number | null;
}

export interface GameState extends SerializedGameState {
  pendingActionHint: ActionHint;
  history: SerializedGameState[];
}

export interface PlayerWithStatus extends Player {
  status: PlayerStatus;
  catchUpNeeded: number;
  maxPossible: number;
}
