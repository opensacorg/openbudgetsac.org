export function formatDollars(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatDollarsFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function asDiff(value: number, usePct: boolean): string {
  if (value === Infinity) return 'Newly Added';
  if (value === -Infinity) return 'Removed';
  const formatted = usePct ? formatPct(Math.abs(value)) : formatDollarsFull(Math.abs(value));
  const sign = value >= 0 ? '+' : '-';
  return `${sign}${formatted}`;
}
