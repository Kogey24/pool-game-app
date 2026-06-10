export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}
