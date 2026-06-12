import { useState } from 'react';
import { Output, Row, Field, Bench, PaneLabel, RefSection, RefTable } from '@/components/ui';

// Crockford base32, no I L O U
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function ulid(): string {
  let ts = Date.now();
  let time = '';
  for (let i = 0; i < 10; i++) {
    time = ALPHABET[ts % 32] + time;
    ts = Math.floor(ts / 32);
  }

  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  let entropy = '';
  // 10 bytes = 80 bits = 16 base32 chars
  let bits = 0, acc = 0;
  for (const byte of rand) {
    acc = (acc << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      entropy += ALPHABET[(acc >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  return time + entropy;
}

export function UlidTool() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(count, 1), 100);
    setOutput(Array.from({ length: n }, ulid).join('\n'));
  };

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>options</PaneLabel>
          <Row>
            <Field label="Count">
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="field-input w-20"
              />
            </Field>
          </Row>
          <button onClick={generate} className="btn-primary">Generate</button>
          <p className="font-mono text-xs text-faint">
            26 chars, Crockford base32: 48-bit timestamp + 80 crypto-random bits.
            Lexicographically sortable, case-insensitive, no ambiguous letters.
            In .NET via the Ulid or NUlid package.
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>ulids</PaneLabel>
          <Output text={output} placeholder="Generated ULIDs land here" />
        </>
      }
    />
    <RefSection title="ulid or guid v7">
      <RefTable rows={[
        ['Both', 'time-ordered, index-friendly, 128 bits'],
        ['ULID', 'shorter to read (26 chars vs 36), case-insensitive, URL-safe with no hyphens'],
        ['GUID v7', 'native in .NET 9 (Guid.CreateVersion7), works everywhere a Guid does — EF, SQL uniqueidentifier, serializers'],
        ['Verdict', 'inside a .NET system, v7 wins on zero friction; ULID wins for user-visible ids'],
      ]} />
    </RefSection>
    </>
  );
}
