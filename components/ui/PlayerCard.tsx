"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PlayerWithStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: PlayerWithStatus;
  isCurrent: boolean;
  leaderScore: number;
  pointsOnTable: number;
  turnPoints: number;
}

function AnimatedScore({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      animate={{ opacity: 1, y: 0, scale: 1 }}
      initial={reduceMotion ? {} : { opacity: 0.72, y: -4, scale: 1.08 }}
      key={value}
      transition={{ duration: 0.22 }}
    >
      {value}
    </motion.span>
  );
}

export function PlayerCard({
  player,
  isCurrent,
  leaderScore,
  pointsOnTable,
  turnPoints,
}: PlayerCardProps) {
  const denominator = Math.max(1, leaderScore + pointsOnTable);
  const progress = Math.max(
    0,
    Math.min(100, (player.maxPossible / denominator) * 100),
  );

  const scoreColor =
    player.score < 0
      ? "text-accent-red"
      : isCurrent
        ? "text-accent-lime"
        : "text-pool-text";

  const subtext =
    player.status === "eliminated"
      ? "eliminated - cannot catch leader"
      : player.status === "lead"
        ? `${pointsOnTable} marks still on table`
        : `${player.catchUpNeeded} marks to catch - max ${player.maxPossible}`;

  return (
    <motion.div
      animate={{ opacity: player.status === "eliminated" ? 0.48 : 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-pool-card p-3 shadow-[var(--shadow-card)]",
        isCurrent && "border-accent-green bg-pool-felt-dark shadow-[var(--shadow-turn)]",
        player.status === "lead" && !isCurrent && "border-accent-amber",
        player.status === "eliminated" && "border-pool-border-subtle",
      )}
      layout
    >
      <div className="flex min-h-[58px] items-center gap-3">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white shadow-inner"
          style={{ background: player.color }}
        >
          {player.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-pool-text">
              {player.name}
            </p>
            {player.status === "lead" && (
              <span className="rounded-full border border-accent-amber bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-amber-200">
                Lead
              </span>
            )}
            {player.status === "eliminated" && (
              <span className="rounded-full border border-accent-red bg-[var(--color-accent-red-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-red-200">
                Eliminated
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-[11px] text-pool-muted">
            {subtext}
          </p>
        </div>

        <div className="text-right">
          <p className={cn("font-display text-[28px] font-bold leading-none", scoreColor)}>
            <AnimatedScore value={player.score} />
          </p>
          <p className="mt-1 text-[11px] text-pool-muted">marks</p>
          {isCurrent && turnPoints !== 0 && (
            <p className="mt-0.5 text-[11px] font-medium text-accent-lime">
              {turnPoints > 0 ? "+" : ""}
              {turnPoints} this turn
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/25">
        <div
          className="h-full bg-accent-green transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
