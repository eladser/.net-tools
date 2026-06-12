import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Hand-maintained — update when a new .NET ships (every November).
const VERSIONS = [
  {
    version: '.NET 11', tfm: 'net11.0', csharp: 'C# 15', released: 'Nov 2026 (preview)',
    kind: 'STS', until: '~May 2028',
    summary: 'In preview. Union types, runtime async, Zstandard compression.',
    state: 'preview' as const,
    features: [
      'Union types — exhaustive switch over closed sets of case types',
      'Runtime async — the runtime owns suspend/resume, no more state-machine codegen',
      'closed modifier for class hierarchies',
      'Collection expression arguments',
      'Zstandard (zstd) compression support',
      'LINQ full outer join for in-memory queries',
      'JIT: bounds-check elimination, switch folding, redundant branch removal',
    ],
  },
  {
    version: '.NET 10', tfm: 'net10.0', csharp: 'C# 14', released: 'Nov 2025',
    kind: 'LTS', until: 'Nov 2028',
    summary: 'Current LTS. Field-backed properties, extension members, dotnet run app.cs.',
    state: 'active' as const,
    features: [
      'field keyword — field-backed properties without manual backing fields',
      'Extension members — extension properties and static extension methods',
      'dotnet run app.cs — run a single C# file, no project needed',
      'null-conditional assignment (a?.b = c)',
      'nameof supports unbound generics',
      'Post-quantum cryptography (ML-KEM, ML-DSA)',
      'JSON: PipeReader support, JsonSerializerOptions.Strict preset',
    ],
  },
  {
    version: '.NET 9', tfm: 'net9.0', csharp: 'C# 13', released: 'Nov 2024',
    kind: 'STS', until: 'May 2026',
    summary: 'Guid.CreateVersion7, Base64Url, params collections, HybridCache.',
    state: 'eol' as const,
    features: [
      'Guid.CreateVersion7() — time-ordered, index-friendly GUIDs',
      'System.Buffers.Text.Base64Url',
      'params for any collection type, not just arrays',
      'HybridCache — two-level local + distributed caching',
      'System.Threading.Lock type',
      'OpenAPI document generation built into ASP.NET Core',
      'LINQ CountBy / AggregateBy / Index',
    ],
  },
  {
    version: '.NET 8', tfm: 'net8.0', csharp: 'C# 12', released: 'Nov 2023',
    kind: 'LTS', until: 'Nov 2026',
    summary: 'Primary constructors, collection expressions, TimeProvider, frozen collections.',
    state: 'active' as const,
    features: [
      'Primary constructors for any class, not just records',
      'Collection expressions: int[] x = [1, 2, 3]',
      'TimeProvider — testable time abstraction',
      'FrozenDictionary / FrozenSet — read-optimized collections',
      'Native AOT goes mainstream for ASP.NET Core APIs',
      'Keyed services in dependency injection',
      'Identity API endpoints, Blazor SSR + streaming rendering',
    ],
  },
  {
    version: '.NET 7', tfm: 'net7.0', csharp: 'C# 11', released: 'Nov 2022',
    kind: 'STS', until: 'May 2024',
    summary: 'Raw string literals, required members, generic math.',
    state: 'eol' as const,
    features: [
      'Raw string literals ("""…""")',
      'required members',
      'Generic math — static abstract interface members, INumber<T>',
      'List patterns in pattern matching',
      'Rate limiting middleware',
      'EF Core bulk update/delete (ExecuteUpdate / ExecuteDelete)',
    ],
  },
  {
    version: '.NET 6', tfm: 'net6.0', csharp: 'C# 10', released: 'Nov 2021',
    kind: 'LTS', until: 'Nov 2024',
    summary: 'Minimal APIs, file-scoped namespaces, global usings.',
    state: 'eol' as const,
    features: [
      'Minimal APIs — app.MapGet without controllers',
      'File-scoped namespaces, global usings, implicit usings',
      'record struct',
      'DateOnly and TimeOnly',
      'Hot reload',
      'LINQ Chunk / MaxBy / MinBy / DistinctBy',
    ],
  },
  {
    version: 'Framework 4.8.1', tfm: 'net481', csharp: 'C# 7.3', released: 'Aug 2022',
    kind: 'OS-bound', until: 'tied to Windows',
    summary: 'Legacy. New language features stop at 7.3 officially.',
    state: 'active' as const,
    features: [
      'ARM64 support',
      'WCAG 2.1 accessibility fixes in WinForms/WPF',
      'Servicing-only — no new feature development',
      'Language ceiling: C# 7.3 (later versions unsupported officially)',
    ],
  },
];

const STATE_BADGE = {
  preview: { label: 'preview', cls: 'text-accent border-accent/40' },
  active: { label: 'supported', cls: 'text-ok border-ok/40' },
  eol: { label: 'end of life', cls: 'text-bad border-bad/40' },
};

export function DotnetVersions() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (tfm: string) => {
    const next = new Set(open);
    if (next.has(tfm)) {
      next.delete(tfm);
    } else {
      next.add(tfm);
    }
    setOpen(next);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        {VERSIONS.map((v) => {
          const badge = STATE_BADGE[v.state];
          const expanded = open.has(v.tfm);
          return (
            <div key={v.tfm} className="border border-border rounded-lg bg-surface">
              <button
                onClick={() => toggle(v.tfm)}
                className="w-full text-left px-4 py-3 hover:bg-elevated/40 transition-colors rounded-lg"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  {expanded
                    ? <ChevronDown className="w-3.5 h-3.5 text-faint self-center shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 text-faint self-center shrink-0" />}
                  <span className="text-base font-semibold text-fg">{v.version}</span>
                  <span className="font-mono text-xs text-accent">{v.tfm}</span>
                  <span className="font-mono text-xs text-muted">{v.csharp}</span>
                  <span className={`ml-auto font-mono text-[11px] px-1.5 py-0.5 border rounded ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
                <div className="font-mono text-xs text-faint mt-1.5 pl-6">
                  {v.kind} · {v.released} → {v.until}
                </div>
                {!expanded && <p className="text-sm text-muted mt-1.5 pl-6">{v.summary}</p>}
              </button>
              {expanded && (
                <ul className="px-4 pb-3 pl-10 space-y-1.5 animate-fade-in">
                  {v.features.map((f) => (
                    <li key={f} className="text-sm text-muted leading-snug list-disc marker:text-faint">
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="font-mono text-xs text-faint">
        Even-numbered releases are LTS (3 years); odd are STS (18 months). New majors land every November. Click a version for its major features.
      </p>
    </div>
  );
}
