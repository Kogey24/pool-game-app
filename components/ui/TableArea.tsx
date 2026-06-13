"use client";

import type { CSSProperties } from "react";
import { X } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Ball } from "@/components/ui/Ball";
import { ballPoints } from "@/lib/game-engine";

interface TableAreaProps {
  balls: number[];
  currentBall: number | null;
  pointsOnTable: number;
  onRemoveBall: (ball: number) => void;
  onSelectBall: (ball: number) => void;
}

interface DraggableBallProps {
  ball: number;
  isCurrent: boolean;
  onRemoveBall: (ball: number) => void;
  onSelectBall: (ball: number) => void;
}

function DraggableBall({
  ball,
  isCurrent,
  onRemoveBall,
  onSelectBall,
}: DraggableBallProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `ball-${ball}`,
      data: { ball },
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div className="relative h-14 w-14">
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
      <button
        aria-label={`Remove ball ${ball} from rack`}
        className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border border-pool-border bg-pool-card text-pool-muted shadow-sm transition hover:border-accent-red hover:text-red-100"
        onClick={(event) => {
          event.stopPropagation();
          onRemoveBall(ball);
        }}
        type="button"
      >
        <X aria-hidden className="h-3 w-3" />
      </button>
    </div>
  );
}

export function TableArea({
  balls,
  currentBall,
  onRemoveBall,
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
            onRemoveBall={onRemoveBall}
            onSelectBall={onSelectBall}
          />
        ))}
      </div>
    </section>
  );
}
