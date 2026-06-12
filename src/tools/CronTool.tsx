import { useState } from 'react';
import { Field, Output, Bench, PaneLabel, RefSection, RefTable } from '@/components/ui';

const EXAMPLES: Array<[string, string]> = [
  ['*/5 * * * *', 'every 5 minutes'],
  ['0 * * * *', 'top of every hour'],
  ['0 3 * * *', 'nightly at 03:00'],
  ['30 6 * * 1-5', 'weekdays at 06:30'],
  ['0 9 * * 1', 'Mondays at 09:00'],
  ['0 0 1 * *', 'first of the month, midnight'],
  ['0 12 * * 0', 'Sundays at noon'],
  ['15 2 1 1 *', 'Jan 1st at 02:15'],
];

const FIELDS = [
  { key: 'min', label: 'Minute', hint: '0-59' },
  { key: 'hour', label: 'Hour', hint: '0-23' },
  { key: 'day', label: 'Day', hint: '1-31' },
  { key: 'month', label: 'Month', hint: '1-12' },
  { key: 'weekday', label: 'Weekday', hint: '0-6 (Sun=0)' },
] as const;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function part(value: string, every: string, names?: string[], offset = 0): string {
  if (value === '*') return every;
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${every.replace('every ', '')}s`;
  if (names && /^\d+$/.test(value)) return names[parseInt(value) - offset] ?? value;
  if (names && /^\d+-\d+$/.test(value)) {
    const [a, b] = value.split('-').map(n => names[parseInt(n) - offset] ?? n);
    return `${a} through ${b}`;
  }
  return value;
}

function describe(min: string, hour: string, day: string, month: string, weekday: string): string {
  const pieces: string[] = [];

  if (min === '*' && hour === '*') pieces.push('every minute');
  else if (min.startsWith('*/') && hour === '*') pieces.push(`every ${min.slice(2)} minutes`);
  else if (hour === '*') pieces.push(`at minute ${min} of every hour`);
  else if (min === '*') pieces.push(`every minute of hour ${hour}`);
  else {
    const h = /^\d+$/.test(hour) ? hour.padStart(2, '0') : hour;
    const m = /^\d+$/.test(min) ? min.padStart(2, '0') : min;
    pieces.push(`at ${h}:${m}`);
  }

  if (day !== '*') pieces.push(`on day ${day} of the month`);
  if (month !== '*') pieces.push(`in ${part(month, 'every month', MONTHS, 1)}`);
  if (weekday !== '*') pieces.push(`on ${part(weekday, 'every weekday', WEEKDAYS, 0)}`);
  if (day !== '*' && weekday !== '*') pieces.push('(day OR weekday — cron fires when either matches)');

  return 'Runs ' + pieces.join(', ');
}

export function CronTool() {
  const [values, setValues] = useState<Record<string, string>>({
    min: '*', hour: '*', day: '*', month: '*', weekday: '*'
  });

  const expr = FIELDS.map(f => values[f.key] || '*').join(' ');
  const desc = describe(values.min, values.hour, values.day, values.month, values.weekday);

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>fields</PaneLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <input
                  type="text"
                  value={values[f.key]}
                  onChange={(e) => setValues(v => ({ ...v, [f.key]: e.target.value.trim() || '*' }))}
                  placeholder={f.hint}
                  className="field-input text-center"
                />
              </Field>
            ))}
          </div>
          <p className="font-mono text-xs text-faint">
            Five-field crontab order: minute, hour, day, month, weekday. Supports *, exact values, and */n steps.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>expression</PaneLabel>
          <Output text={expr} />
          <p className="text-sm text-muted">{desc}</p>
        </>
      }
    />
    <RefSection title="common schedules — click to load">
      <RefTable
        rows={EXAMPLES}
        onPick={(e) => {
          const [min, hour, day, month, weekday] = e.split(' ');
          setValues({ min, hour, day, month, weekday });
        }}
        pickHint="Quartz and NCrontab also accept a 6-field form with leading seconds; this builder uses the classic 5."
      />
    </RefSection>
    </>
  );
}
