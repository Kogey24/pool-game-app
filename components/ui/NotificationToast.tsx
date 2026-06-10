"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw, Skull } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "eliminated" | "back";
  message: string;
}

interface NotificationToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

function ToastItem({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = message.type === "eliminated" ? Skull : RotateCcw;

  useEffect(() => {
    const timeout = window.setTimeout(() => onDismiss(message.id), 3000);
    return () => window.clearTimeout(timeout);
  }, [message.id, onDismiss]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3 py-2 text-sm shadow-2xl",
        message.type === "eliminated"
          ? "border-red-500/40 bg-[var(--color-accent-red-bg)] text-red-100"
          : "border-amber-500/40 bg-amber-500/10 text-amber-100",
      )}
      exit={reduceMotion ? {} : { opacity: 0, y: -16 }}
      initial={reduceMotion ? {} : { opacity: 0, y: -16 }}
      layout
    >
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message.message}</p>
    </motion.div>
  );
}

export function NotificationToast({
  messages,
  onDismiss,
}: NotificationToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 mx-auto flex max-w-lg flex-col gap-2 px-4">
      <AnimatePresence>
        {messages.map((message) => (
          <ToastItem
            key={message.id}
            message={message}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
