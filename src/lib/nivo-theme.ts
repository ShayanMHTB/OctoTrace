/**
 * Shared Nivo theme bound to our CSS variables so every chart adapts to
 * light/dark automatically (CSS vars resolve at paint time, even in SVG).
 */
export const nivoTheme = {
  text: {
    fill: 'var(--muted-foreground)',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  axis: {
    domain: { line: { stroke: 'var(--border)' } },
    ticks: {
      line: { stroke: 'var(--border)' },
      text: { fill: 'var(--muted-foreground)' },
    },
    legend: { text: { fill: 'var(--foreground)' } },
  },
  grid: { line: { stroke: 'var(--border)', strokeWidth: 1 } },
  legends: { text: { fill: 'var(--muted-foreground)' } },
  labels: { text: { fill: 'var(--foreground)' } },
  tooltip: {
    container: {
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
      fontSize: 12,
      borderRadius: 8,
      border: '1px solid var(--border)',
      boxShadow: '0 4px 12px rgb(0 0 0 / 0.12)',
    },
  },
};
