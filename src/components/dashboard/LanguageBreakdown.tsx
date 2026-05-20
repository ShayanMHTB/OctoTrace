'use client';

import type { LanguageBytes } from '@/hooks/useGitHub';
import { languageColor } from '@/lib/language-colors';
import { formatBytes } from '@/utils/numbers';

export default function LanguageBreakdown({
  languages,
}: {
  languages: LanguageBytes[];
}) {
  if (languages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No language data found across your repositories.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {languages.map((lang) => (
        <li key={lang.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: languageColor(lang.name) }}
              />
              {lang.name}
            </span>
            <span className="text-muted-foreground">
              {formatBytes(lang.bytes)} · {lang.percent.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(lang.percent, 0.5)}%`,
                backgroundColor: languageColor(lang.name),
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
