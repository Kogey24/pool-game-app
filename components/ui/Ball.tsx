import type { CSSProperties } from "react";
import { STRIPE_BALLS, ballPoints } from "@/lib/game-engine";
import { cn } from "@/lib/utils";

interface BallProps {
  number: number;
  size?: "sm" | "md" | "lg";
  isCurrent?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  className?: string;
}

const ballSizes = {
  sm: "h-7 w-7 text-[13px]",
  md: "h-10 w-10 text-[15px] min-[400px]:h-[42px] min-[400px]:w-[42px] max-[399px]:h-7 max-[399px]:w-7 max-[399px]:text-[13px]",
  lg: "h-14 w-14 text-base",
};

const touchSizes = {
  sm: "h-11 w-11",
  md: "h-12 w-12 max-[399px]:h-11 max-[399px]:w-11",
  lg: "h-16 w-16",
};

export function Ball({
  number,
  size = "md",
  isCurrent = false,
  isDragging = false,
  onClick,
  draggable = false,
  className,
}: BallProps) {
  const isStripe = STRIPE_BALLS.includes(number);
  const ball = (
    <span
      aria-hidden={onClick ? undefined : true}
      className={cn(
        "billiard-ball font-display font-bold",
        ballSizes[size],
        isStripe && "stripe",
        isCurrent && "current",
        isDragging && "dragging",
        className,
      )}
      style={
        {
          "--ball-color": `var(--ball-${number})`,
        } as CSSProperties
      }
    >
      <span className="billiard-ball-number">{number}</span>
    </span>
  );

  if (!onClick || draggable) {
    return ball;
  }

  return (
    <button
      aria-label={`Ball ${number}, ${ballPoints(number)} points`}
      className={cn(
        "grid place-items-center rounded-full transition hover:scale-105 hover:[filter:brightness(1.07)]",
        touchSizes[size],
      )}
      onClick={onClick}
      type="button"
    >
      {ball}
    </button>
  );
}
