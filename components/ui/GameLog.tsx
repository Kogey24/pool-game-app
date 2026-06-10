import type { LogEntry } from "@/lib/types";
import { cn, formatDelta } from "@/lib/utils";

interface GameLogProps {
  entries: LogEntry[];
}

export function GameLog({ entries }: GameLogProps) {
  return (
    <section className="rounded-xl border border-pool-border bg-pool-card p-3 shadow-[var(--shadow-card)]">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-pool-muted">
          Game log
        </h2>
        <span className="text-[11px] text-pool-faint">
          {Math.min(entries.length, 20)} rows
        </span>
      </div>

      <div className="max-h-24 overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <p className="text-xs text-pool-faint">No actions yet</p>
        ) : (
          <div className="grid gap-1">
            {entries.slice(0, 20).map((entry) => (
              <div
                className="grid grid-cols-[1fr_auto] gap-3 text-xs"
                key={entry.id}
              >
                <p className="truncate text-pool-muted">
                  <span className="text-pool-text">{entry.playerName}</span>{" "}
                  {entry.text}
                </p>
                <span
                  className={cn(
                    "font-display font-semibold",
                    entry.delta > 0 && "text-accent-green",
                    entry.delta < 0 && "text-accent-red",
                    entry.delta === 0 && "text-pool-faint",
                  )}
                >
                  {formatDelta(entry.delta)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
