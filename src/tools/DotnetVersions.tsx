// Hand-maintained — update when a new .NET ships (every November).
const VERSIONS = [
  {
    version: '.NET 11', tfm: 'net11.0', csharp: 'C# 15', released: 'Nov 2026 (preview)',
    kind: 'STS', until: '~May 2028',
    notes: 'In preview. Union types, runtime async, Zstandard compression, LINQ full outer join.',
    state: 'preview' as const,
  },
  {
    version: '.NET 10', tfm: 'net10.0', csharp: 'C# 14', released: 'Nov 2025',
    kind: 'LTS', until: 'Nov 2028',
    notes: 'Current LTS. Field-backed properties, extension members, dotnet run app.cs.',
    state: 'active' as const,
  },
  {
    version: '.NET 9', tfm: 'net9.0', csharp: 'C# 13', released: 'Nov 2024',
    kind: 'STS', until: 'May 2026',
    notes: 'Guid.CreateVersion7, Base64Url, params collections, HybridCache.',
    state: 'eol' as const,
  },
  {
    version: '.NET 8', tfm: 'net8.0', csharp: 'C# 12', released: 'Nov 2023',
    kind: 'LTS', until: 'Nov 2026',
    notes: 'Primary constructors, collection expressions, TimeProvider, frozen collections.',
    state: 'active' as const,
  },
  {
    version: '.NET 7', tfm: 'net7.0', csharp: 'C# 11', released: 'Nov 2022',
    kind: 'STS', until: 'May 2024',
    notes: 'Raw string literals, required members, generic math.',
    state: 'eol' as const,
  },
  {
    version: '.NET 6', tfm: 'net6.0', csharp: 'C# 10', released: 'Nov 2021',
    kind: 'LTS', until: 'Nov 2024',
    notes: 'Minimal APIs, file-scoped namespaces, global usings.',
    state: 'eol' as const,
  },
  {
    version: 'Framework 4.8.1', tfm: 'net481', csharp: 'C# 7.3', released: 'Aug 2022',
    kind: 'OS-bound', until: 'tied to Windows',
    notes: 'Legacy. New language features stop at 7.3 officially.',
    state: 'active' as const,
  },
];

const STATE_BADGE = {
  preview: { label: 'preview', cls: 'text-accent border-accent/40' },
  active: { label: 'supported', cls: 'text-ok border-ok/40' },
  eol: { label: 'end of life', cls: 'text-bad border-bad/40' },
};

export function DotnetVersions() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {VERSIONS.map((v) => {
          const badge = STATE_BADGE[v.state];
          return (
            <div key={v.tfm} className="border border-border rounded-lg px-4 py-3 bg-surface">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-base font-semibold text-fg">{v.version}</span>
                <span className="font-mono text-xs text-accent">{v.tfm}</span>
                <span className="font-mono text-xs text-muted">{v.csharp}</span>
                <span className={`ml-auto font-mono text-[11px] px-1.5 py-0.5 border rounded ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <div className="font-mono text-xs text-faint mt-1.5">
                {v.kind} · {v.released} → {v.until}
              </div>
              <p className="text-sm text-muted mt-1.5">{v.notes}</p>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-xs text-faint">
        Even-numbered releases are LTS (3 years); odd are STS (18 months). New majors land every November.
      </p>
    </div>
  );
}
