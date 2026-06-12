import { useState, useMemo } from 'react';
import { ResultRows, Bench, PaneLabel, RefSection, RefTable } from '@/components/ui';

const SPECIFIERS: Array<[string, string]> = [
  ['yyyy / yy', 'four- or two-digit year'],
  ['MM / MMM / MMMM', '06 / Jun / June'],
  ['dd / ddd / dddd', '12 / Fri / Friday'],
  ['HH / hh', '24-hour / 12-hour, zero-padded'],
  ['mm / ss', 'minutes / seconds'],
  ['fff / ff / f', 'milliseconds, 3 / 2 / 1 digits'],
  ['tt', 'AM or PM'],
  ['zzz / zz', 'offset +03:00 / +03'],
  ['K', 'offset or Z, the round-trip kind'],
  ["'text' / \\\\c", 'literal text / escaped character'],
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Subset of .NET custom format specifiers, enough for the formats people
// actually write. Quoted literals and escapes are honored.
function formatNet(date: Date, fmt: string): string {
  const p = (n: number, len: number) => String(n).padStart(len, '0');
  const h12 = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
  const tzMin = -date.getTimezoneOffset();
  const tzSign = tzMin >= 0 ? '+' : '-';
  const tzH = p(Math.floor(Math.abs(tzMin) / 60), 2);
  const tzM = p(Math.abs(tzMin) % 60, 2);

  let out = '';
  let i = 0;
  while (i < fmt.length) {
    const c = fmt[i];

    if (c === '\\' && i + 1 < fmt.length) { out += fmt[i + 1]; i += 2; continue; }
    if (c === "'" || c === '"') {
      const end = fmt.indexOf(c, i + 1);
      if (end === -1) { out += fmt.slice(i + 1); break; }
      out += fmt.slice(i + 1, end);
      i = end + 1;
      continue;
    }

    let run = 1;
    while (i + run < fmt.length && fmt[i + run] === c) run++;

    switch (c) {
      case 'y': out += run >= 4 ? p(date.getFullYear(), 4) : p(date.getFullYear() % 100, Math.min(run, 2)); break;
      case 'M': out += run >= 4 ? MONTHS[date.getMonth()] : run === 3 ? MONTHS[date.getMonth()].slice(0, 3) : p(date.getMonth() + 1, run); break;
      case 'd': out += run >= 4 ? DAYS[date.getDay()] : run === 3 ? DAYS[date.getDay()].slice(0, 3) : p(date.getDate(), run); break;
      case 'H': out += p(date.getHours(), run); break;
      case 'h': out += p(h12, run); break;
      case 'm': out += p(date.getMinutes(), run); break;
      case 's': out += p(date.getSeconds(), run); break;
      case 'f': out += p(date.getMilliseconds(), 3).slice(0, run); break;
      case 't': out += run >= 2 ? (date.getHours() < 12 ? 'AM' : 'PM') : (date.getHours() < 12 ? 'A' : 'P'); break;
      case 'z': out += run >= 3 ? `${tzSign}${tzH}:${tzM}` : run === 2 ? `${tzSign}${tzH}` : `${tzSign}${parseInt(tzH)}`; break;
      case 'K': out += `${tzSign}${tzH}:${tzM}`; break;
      default: out += c.repeat(run);
    }
    i += run;
  }
  return out;
}

const COMMON: Array<[string, string]> = [
  ['yyyy-MM-dd', 'ISO date'],
  ['yyyy-MM-ddTHH:mm:ssK', 'round-trip-ish'],
  ['dd/MM/yyyy HH:mm', 'EU date-time'],
  ['MMM d, yyyy', 'short readable'],
  ['dddd, MMMM d', 'full readable'],
  ['HH:mm:ss.fff', 'time with ms'],
  ['yyyyMMdd_HHmmss', 'filename-safe'],
];

export function DateFormatTool() {
  const [fmt, setFmt] = useState('yyyy-MM-dd HH:mm:ss');
  const [now] = useState(() => new Date());

  const preview = useMemo(() => {
    try {
      return { text: formatNet(now, fmt), error: false };
    } catch {
      return { text: 'Invalid format string', error: true };
    }
  }, [fmt, now]);

  const rows = COMMON.map(([f, label]) => ({ label, value: `"${f}" → ${formatNet(now, f)}` }));

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>format string</PaneLabel>
          <input
            type="text"
            value={fmt}
            onChange={(e) => setFmt(e.target.value)}
            placeholder="yyyy-MM-dd HH:mm:ss"
            className="field-input"
          />
          <div className={`font-mono text-base px-3 py-2.5 bg-bg border rounded-md ${preview.error ? 'border-bad/40 text-bad' : 'border-border text-fg'}`}>
            {preview.text || ' '}
          </div>
          <p className="font-mono text-xs text-faint">
            DateTime.ToString specifiers: yyyy MM dd HH hh mm ss fff tt ddd dddd MMM MMMM zzz K, quotes for literals.
            Evaluated against now, in your timezone.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>common formats</PaneLabel>
          <ResultRows rows={rows} />
        </>
      }
    />
    <RefSection title="custom format specifiers — click to try">
      <RefTable
        rows={SPECIFIERS}
        onPick={(k) => setFmt(k.split(' / ')[0].replace(/'/g, ''))}
        pickHint='Single-letter standard formats also exist: "o" round-trip, "s" sortable, "r" RFC1123, "u" universal sortable.'
      />
    </RefSection>
    </>
  );
}
