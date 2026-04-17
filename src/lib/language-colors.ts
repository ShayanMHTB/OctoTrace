/**
 * GitHub's canonical language colors for the most common languages, plus a
 * deterministic fallback so any unknown language still gets a stable color.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  'Objective-C': '#438eff',
  Perl: '#0298c3',
  R: '#198CE7',
  Clojure: '#db5855',
  Erlang: '#B83998',
  Zig: '#ec915c',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
};

/** Stable hashed fallback color for languages not in the map. */
function fallbackColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

export function languageColor(name: string | null | undefined): string {
  if (!name) return 'var(--muted-foreground)';
  return LANGUAGE_COLORS[name] ?? fallbackColor(name);
}
