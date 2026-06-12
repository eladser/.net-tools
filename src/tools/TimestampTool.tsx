import { useState } from 'react';
import { ResultRows, Row, Bench, PaneLabel, RefSection, RefCode } from '@/components/ui';

export function TimestampTool() {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<Array<{ label: string; value: string }>>([]);
  const [error, setError] = useState('');

  const convert = (raw: string) => {
    setInput(raw);
    const trimmed = raw.trim();
    if (!trimmed) {
      setRows([]);
      setError('');
      return;
    }

    let date: Date;
    if (/^\d+$/.test(trimmed)) {
      const n = parseInt(trimmed);
      date = new Date(n > 99999999999 ? n : n * 1000); // 13+ digits = ms
    } else {
      date = new Date(trimmed);
    }

    if (isNaN(date.getTime())) {
      setRows([]);
      setError('Could not parse that as a timestamp or date');
      return;
    }

    setError('');
    const unix = Math.floor(date.getTime() / 1000);
    setRows([
      { label: 'Unix (s)', value: String(unix) },
      { label: 'Unix (ms)', value: String(date.getTime()) },
      { label: 'ISO 8601', value: date.toISOString() },
      { label: 'Local', value: date.toLocaleString() },
      { label: 'Relative', value: relative(date) },
      { label: 'C#', value: `DateTimeOffset.FromUnixTimeSeconds(${unix})` },
    ]);
  };

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>timestamp or date</PaneLabel>
          <Row>
            <input
              type="text"
              value={input}
              onChange={(e) => convert(e.target.value)}
              placeholder="1749600000, 2026-06-12, or any parseable date"
              className="field-input flex-1"
            />
            <button onClick={() => convert(String(Math.floor(Date.now() / 1000)))} className="btn-secondary">
              Now
            </button>
          </Row>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>conversions</PaneLabel>
          {rows.length > 0 ? <ResultRows rows={rows} /> : (
            <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
              Unix, ISO, local, relative, and C# land here
            </div>
          )}
        </>
      }
    />
    <RefSection title="both directions in c#">
      <RefCode code={`DateTimeOffset.FromUnixTimeSeconds(1749600000);   // ts -> time
DateTimeOffset.UtcNow.ToUnixTimeSeconds();        // time -> ts
DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

// Prefer DateTimeOffset over DateTime for timestamps:
// it carries the offset, so no DateTimeKind ambiguity.`} />
    </RefSection>
    </>
  );
}

function relative(date: Date): string {
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [31536000000, 'year'], [2592000000, 'month'], [86400000, 'day'],
    [3600000, 'hour'], [60000, 'minute'], [1000, 'second'],
  ];
  for (const [ms, unit] of units) {
    if (abs >= ms) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.round(diff / ms), unit);
    }
  }
  return 'now';
}
