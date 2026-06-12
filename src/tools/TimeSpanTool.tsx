import { useState } from 'react';
import { ResultRows, Row, Field } from '@/components/ui';

const PARTS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
  { key: 'ms', label: 'Ms' },
] as const;

export function TimeSpanTool() {
  const [values, setValues] = useState<Record<string, string>>({
    days: '0', hours: '1', minutes: '30', seconds: '0', ms: '0'
  });

  const num = (k: string) => parseInt(values[k]) || 0;
  const totalMs = (((num('days') * 24 + num('hours')) * 60 + num('minutes')) * 60 + num('seconds')) * 1000 + num('ms');
  const ticks = BigInt(totalMs) * 10000n;

  const pad = (n: number, d = 2) => n.toString().padStart(d, '0');
  const tsString = `${num('days')}.${pad(num('hours'))}:${pad(num('minutes'))}:${pad(num('seconds'))}.${pad(num('ms'), 3)}0000`;

  const rows = [
    { label: 'Ticks', value: ticks.toString() },
    { label: 'Microseconds', value: (BigInt(totalMs) * 1000n).toLocaleString() },
    { label: 'Total ms', value: totalMs.toLocaleString() },
    { label: 'Total seconds', value: (totalMs / 1000).toLocaleString() },
    { label: 'Total hours', value: (totalMs / 3600000).toFixed(4) },
    { label: 'TimeSpan', value: tsString },
    { label: 'C#', value: `new TimeSpan(${num('days')}, ${num('hours')}, ${num('minutes')}, ${num('seconds')}, ${num('ms')})` },
  ];

  return (
    <div className="space-y-3">
      <Row>
        {PARTS.map((p) => (
          <Field key={p.key} label={p.label}>
            <input
              type="number"
              min={0}
              value={values[p.key]}
              onChange={(e) => setValues(v => ({ ...v, [p.key]: e.target.value }))}
              className="field-input w-20"
            />
          </Field>
        ))}
      </Row>
      <ResultRows rows={rows} />
    </div>
  );
}
