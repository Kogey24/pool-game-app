"use client";

import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  id: "pot" | "foul" | "draw";
}

export function DropZone({ id }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isPot = id === "pot";
  const isFoul = id === "foul";
  const Icon = isPot ? CircleCheck : isFoul ? CircleX : CircleMinus;
  const label = isPot ? "Potted" : isFoul ? "Foul" : "Draw";
  const detail = isPot ? "add marks" : isFoul ? "pick foul" : "no score";

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[116px] flex-1 rounded-xl border-2 border-dashed px-2 py-3 transition sm:p-4",
        isPot && "border-accent-green bg-accent-green/10 text-accent-lime",
        isFoul && "border-accent-red bg-red-500/10 text-red-100",
        id === "draw" && "border-pool-border bg-pool-card text-pool-text",
        isOver && "border-solid bg-opacity-100 ring-2 ring-white/10",
        isOver && isPot && "bg-accent-green/20",
        isOver && isFoul && "bg-red-500/20",
        isOver && id === "draw" && "bg-white/10",
      )}
    >
      <div className="flex h-full flex-col items-center justify-between gap-3 text-center sm:items-stretch sm:text-left">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-start sm:gap-2">
          <Icon aria-hidden className="h-5 w-5 shrink-0 sm:mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-pool-muted">{detail}</p>
          </div>
        </div>
        <p className="text-xs leading-tight text-pool-muted">
          <span className="sm:hidden">drag here</span>
          <span className="hidden sm:inline">drag ball here</span>
        </p>
      </div>
    </div>
  );
}
