import { useState } from 'react';
import { Row, Field, Output } from '@/components/ui';

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
    <div className="space-y-3">
      <Row>
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              type="text"
              value={values[f.key]}
              onChange={(e) => setValues(v => ({ ...v, [f.key]: e.target.value.trim() || '*' }))}
              placeholder={f.hint}
              className="field-input w-20 text-center"
            />
          </Field>
        ))}
      </Row>
      <Output text={expr} />
      <p className="text-sm text-muted">{desc}</p>
      <p className="font-mono text-xs text-faint">
        Five-field crontab order: minute, hour, day, month, weekday. Supports *, exact values, and */n steps.
      </p>
    </div>
  );
}
