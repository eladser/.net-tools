import { useState } from 'react';
import { Output, Row, Field, Segmented } from '@/components/ui';

type GuidVersion = 'v4' | 'v7';
type GuidFormat = 'standard' | 'nohyphens' | 'braces' | 'csharp';

// UUIDv7: 48-bit unix ms timestamp + version/variant bits + crypto random.
// Matches what Guid.CreateVersion7() produces in .NET 9+.
function uuidV7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const ts = BigInt(Date.now());
  for (let i = 0; i < 6; i++) {
    bytes[i] = Number((ts >> BigInt(8 * (5 - i))) & 0xffn);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function applyFormat(guid: string, format: GuidFormat): string {
  switch (format) {
    case 'nohyphens': return guid.replace(/-/g, '');
    case 'braces': return `{${guid}}`;
    case 'csharp': return `new Guid("${guid}")`;
    default: return guid;
  }
}

export function GuidTool() {
  const [version, setVersion] = useState<GuidVersion>('v4');
  const [format, setFormat] = useState<GuidFormat>('standard');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(Math.max(count, 1), 100);
    const guids = Array.from({ length: n }, () =>
      applyFormat(version === 'v7' ? uuidV7() : crypto.randomUUID(), format)
    );
    setOutput(guids.join('\n'));
  };

  return (
    <div className="space-y-3">
      <Row>
        <Segmented
          options={[{ value: 'v4', label: 'v4 random' }, { value: 'v7', label: 'v7 sortable' }]}
          value={version}
          onChange={setVersion}
        />
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
        <select value={format} onChange={(e) => setFormat(e.target.value as GuidFormat)} className="field-select">
          <option value="standard">xxxxxxxx-xxxx-…</option>
          <option value="nohyphens">no hyphens</option>
          <option value="braces">{'{braces}'}</option>
          <option value="csharp">new Guid("…")</option>
        </select>
      </Row>
      {version === 'v7' && (
        <p className="font-mono text-xs text-faint">
          v7 = time-ordered, index-friendly. Same layout as Guid.CreateVersion7() in .NET 9+.
        </p>
      )}
      <button onClick={generate} className="btn-primary">Generate</button>
      <Output text={output} />
    </div>
  );
}
