import { Play } from "lucide-react";
import type { Player } from "@/lib/types";

interface TurnBannerProps {
  player: Player;
  turnPoints: number;
  currentBall: number | null;
}

export function TurnBanner({ player, turnPoints, currentBall }: TurnBannerProps) {
  return (
    <section className="rounded-xl border border-accent-green bg-pool-felt-dark p-4 shadow-[var(--shadow-turn)]">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-green text-white">
          <Play aria-hidden className="h-4 w-4 fill-current" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-semibold uppercase leading-tight text-accent-lime">
            {player.name}
          </p>
          <p className="mt-1 text-xs text-pool-muted">
            Ball {currentBall ?? "-"} is next
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-[22px] font-bold leading-none text-pool-text">
            {turnPoints > 0 ? "+" : ""}
            {turnPoints}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.5px] text-pool-muted">
            turn
          </p>
        </div>
      </div>
    </section>
  );
}
