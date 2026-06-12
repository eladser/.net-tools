import { useState } from 'react';

const BASES = [
  { key: 'dec', label: 'Decimal', radix: 10 },
  { key: 'hex', label: 'Hex', radix: 16 },
  { key: 'bin', label: 'Binary', radix: 2 },
  { key: 'oct', label: 'Octal', radix: 8 },
] as const;

type BaseKey = typeof BASES[number]['key'];

export function BaseConvert() {
  const [values, setValues] = useState<Record<BaseKey, string>>({ dec: '', hex: '', bin: '', oct: '' });
  const [error, setError] = useState('');

  const update = (source: BaseKey, raw: string) => {
    const cleaned = raw.trim().replace(/^0[xbo]/i, '');
    if (!cleaned) {
      setValues({ dec: '', hex: '', bin: '', oct: '' });
      setError('');
      return;
    }

    const radix = BASES.find(b => b.key === source)!.radix;
    let value: bigint;
    try {
      // BigInt handles 64-bit values that parseInt silently corrupts
      const prefix = radix === 16 ? '0x' : radix === 2 ? '0b' : radix === 8 ? '0o' : '';
      value = BigInt(prefix + cleaned);
      if (value < 0n) throw new Error();
    } catch {
      setValues(v => ({ ...v, [source]: raw }));
      setError(`Not a valid ${BASES.find(b => b.key === source)!.label.toLowerCase()} number`);
      return;
    }

    setError('');
    setValues({
      dec: value.toString(10),
      hex: value.toString(16).toUpperCase(),
      bin: value.toString(2),
      oct: value.toString(8),
      [source]: raw,
    });
  };

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASES.map((b) => (
          <label key={b.key} className="flex items-center gap-3">
            <span className="text-sm text-muted w-16 shrink-0">{b.label}</span>
            <input
              type="text"
              value={values[b.key]}
              onChange={(e) => update(b.key, e.target.value)}
              placeholder={b.radix === 16 ? '1A3F' : b.radix === 2 ? '1101001' : ''}
              className="field-input"
            />
          </label>
        ))}
      </div>
      {error && <p className="font-mono text-xs text-bad">{error}</p>}
      <p className="font-mono text-xs text-faint">Handles values past 2^53 — BigInt under the hood, no precision loss.</p>
    </div>
  );
}
