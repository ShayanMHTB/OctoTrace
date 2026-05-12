const LANGUAGES = [
  { name: 'TypeScript', color: 'oklch(0.6 0.13 250)' },
  { name: 'JavaScript', color: 'oklch(0.85 0.16 95)' },
  { name: 'Python', color: 'oklch(0.65 0.13 240)' },
  { name: 'Go', color: 'oklch(0.72 0.12 215)' },
  { name: 'Rust', color: 'oklch(0.65 0.15 45)' },
  { name: 'Ruby', color: 'oklch(0.6 0.2 25)' },
  { name: 'Java', color: 'oklch(0.65 0.15 55)' },
  { name: 'C++', color: 'oklch(0.6 0.16 0)' },
  { name: 'Swift', color: 'oklch(0.72 0.18 40)' },
  { name: 'Kotlin', color: 'oklch(0.65 0.2 300)' },
  { name: 'PHP', color: 'oklch(0.55 0.12 285)' },
  { name: 'Shell', color: 'oklch(0.72 0.19 150)' },
];

export default function Marquee() {
  const row = [...LANGUAGES, ...LANGUAGES];

  return (
    <section className="border-y bg-muted/20 py-10">
      <p className="mb-7 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Insight for every language in your stack
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 pr-3">
          {row.map((lang, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              {lang.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
