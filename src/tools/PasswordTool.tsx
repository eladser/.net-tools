import { useState } from 'react';
import { Output, Row, Field, Checkbox, Bench, PaneLabel } from '@/components/ui';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Unbiased random index via rejection sampling
function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % max;
}

export function PasswordTool() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [output, setOutput] = useState('');
  const [entropy, setEntropy] = useState(0);

  const generate = () => {
    let chars = '';
    if (upper) chars += SETS.upper;
    if (lower) chars += SETS.lower;
    if (digits) chars += SETS.digits;
    if (symbols) chars += SETS.symbols;

    if (!chars) {
      setOutput('');
      setEntropy(0);
      return;
    }

    const len = Math.min(Math.max(length, 4), 128);
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars[randomIndex(chars.length)];
    }
    setOutput(pwd);
    setEntropy(Math.round(len * Math.log2(chars.length)));
  };

  const strength = entropy >= 100 ? { label: 'strong', color: 'text-ok' }
    : entropy >= 80 ? { label: 'good', color: 'text-accent' }
    : entropy >= 60 ? { label: 'fair', color: 'text-warn' }
    : { label: 'weak', color: 'text-bad' };

  return (
    <Bench
      left={
        <>
          <PaneLabel>options</PaneLabel>
          <Row>
            <Field label="Length">
              <input
                type="number"
                min={4}
                max={128}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value) || 16)}
                className="field-input w-20"
              />
            </Field>
            <Checkbox label="A-Z" checked={upper} onChange={setUpper} />
            <Checkbox label="a-z" checked={lower} onChange={setLower} />
            <Checkbox label="0-9" checked={digits} onChange={setDigits} />
            <Checkbox label="!@#" checked={symbols} onChange={setSymbols} />
          </Row>
          <button onClick={generate} className="btn-primary">Generate</button>
        </>
      }
      right={
        <>
          <PaneLabel>password</PaneLabel>
          <Output text={output} placeholder="Generated password lands here" />
          {output && (
            <p className="font-mono text-xs text-faint">
              ~{entropy} bits of entropy · <span className={strength.color}>{strength.label}</span> · crypto.getRandomValues, unbiased
            </p>
          )}
        </>
      }
    />
  );
}
