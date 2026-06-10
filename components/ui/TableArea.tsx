"use client";

import type { CSSProperties } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Ball } from "@/components/ui/Ball";
import { ballPoints } from "@/lib/game-engine";

interface TableAreaProps {
  balls: number[];
  currentBall: number | null;
  pointsOnTable: number;
  onSelectBall: (ball: number) => void;
}

interface DraggableBallProps {
  ball: number;
  isCurrent: boolean;
  onSelectBall: (ball: number) => void;
}

function DraggableBall({ ball, isCurrent, onSelectBall }: DraggableBallProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `ball-${ball}`,
      data: { ball },
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      ref={setNodeRef}
      aria-label={`Ball ${ball}, ${ballPoints(ball)} points`}
      className="grid h-12 w-12 touch-none place-items-center rounded-full transition hover:scale-105 hover:[filter:brightness(1.08)] max-[399px]:h-11 max-[399px]:w-11"
      onClick={() => onSelectBall(ball)}
      style={style}
      type="button"
      {...listeners}
      {...attributes}
    >
      <Ball
        draggable
        isCurrent={isCurrent}
        isDragging={isDragging}
        number={ball}
        size="md"
      />
    </button>
  );
}

export function TableArea({
  balls,
  currentBall,
  pointsOnTable,
  onSelectBall,
}: TableAreaProps) {
  return (
    <section className="felt-texture rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-accent-lime">
          Table
        </p>
        <p className="text-xs text-accent-lime/80">
          {balls.length} balls - {pointsOnTable} marks remain
        </p>
      </div>

      <div className="flex min-h-[136px] flex-wrap content-center items-center justify-center gap-2 max-[399px]:gap-1.5">
        {balls.map((ball) => (
          <DraggableBall
            ball={ball}
            isCurrent={ball === currentBall}
            key={ball}
            onSelectBall={onSelectBall}
          />
        ))}
      </div>
    </section>
  );
}
