import { useState } from 'react';
import { Segmented, RefSection, RefTable } from '@/components/ui';

const LANDMARKS: Array<[string, string]> = [
  ['85,000 B', 'large object heap threshold — allocations this size go to the LOH'],
  ['64 KB', 'default ArrayPool<byte> max bucket'],
  ['2,147,483,591 B', 'max array size (just under 2 GB, even on 64-bit)'],
  ['4 KB / 8 KB', 'typical OS page / SQL Server page'],
  ['30 MB', 'default Kestrel request body limit'],
  ['250 MB', 'NuGet package size limit on nuget.org'],
];

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const;
type Unit = typeof UNITS[number];

function fmt(n: number): string {
  if (n === 0) return '0';
  if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  return n.toFixed(12).replace(/\.?0+$/, '');
}

export function FileSize() {
  const [mode, setMode] = useState<'binary' | 'decimal'>('binary');
  const [values, setValues] = useState<Record<Unit, string>>(
    Object.fromEntries(UNITS.map(u => [u, ''])) as Record<Unit, string>
  );

  const update = (source: Unit, raw: string, newMode = mode) => {
    const n = parseFloat(raw);
    if (raw.trim() === '' || isNaN(n) || n < 0) {
      setValues({ ...Object.fromEntries(UNITS.map(u => [u, ''])) as Record<Unit, string>, [source]: raw });
      return;
    }
    const base = newMode === 'binary' ? 1024 : 1000;
    const bytes = n * Math.pow(base, UNITS.indexOf(source));
    const next = Object.fromEntries(
      UNITS.map((u, i) => [u, fmt(bytes / Math.pow(base, i))])
    ) as Record<Unit, string>;
    next[source] = raw;
    setValues(next);
  };

  const switchMode = (m: 'binary' | 'decimal') => {
    setMode(m);
    const src = UNITS.find(u => values[u] !== '') ?? 'B';
    update(src, values[src], m);
  };

  return (
    <div className="space-y-3 max-w-3xl">
      <Segmented
        options={[{ value: 'binary', label: '1024 (KiB-style)' }, { value: 'decimal', label: '1000 (SI)' }]}
        value={mode}
        onChange={switchMode}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {UNITS.map((u) => (
          <label key={u} className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted w-10 shrink-0">{u}</span>
            <input
              type="text"
              inputMode="decimal"
              value={values[u]}
              onChange={(e) => update(u, e.target.value)}
              className="field-input"
            />
          </label>
        ))}
      </div>
      <RefSection title="sizes that matter in .net">
        <RefTable rows={LANDMARKS} />
      </RefSection>
    </div>
  );
}
