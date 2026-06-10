"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    let timeout = 0;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        timeout = window.setTimeout(() => setValue(parsed), 0);
      }
    } catch {
      timeout = window.setTimeout(() => setValue(initialValue), 0);
    }

    return () => window.clearTimeout(timeout);
  }, [initialValue, key]);

  const save = useCallback(
    (nextValue: T) => {
      setValue(nextValue);
      try {
        localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        // Ignore storage failures and keep the in-memory value.
      }
    },
    [key],
  );

  const clear = useCallback(() => {
    setValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to clear if storage is unavailable.
    }
  }, [initialValue, key]);

  return [value, save, clear];
}
