import { useState } from 'react';
import { Output, Row, Field, Segmented, Bench, PaneLabel, ResultRows, RefSection, RefTable, RefCode } from '@/components/ui';

type Mode = 'generate' | 'inspect';
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

// Reads back any format applyFormat writes. null means it isn't a GUID.
function inspectGuid(raw: string): Array<{ label: string; value: string }> | null {
  const s = raw.trim().replace(/^new Guid\("(.*)"\)$/i, '$1').replace(/^\{(.*)\}$/, '$1');
  if (!/^([0-9a-f]{32}|[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})$/i.test(s)) return null;

  const hex = s.replace(/-/g, '').toLowerCase();
  if (hex === '0'.repeat(32)) return [{ label: 'Kind', value: 'nil GUID (Guid.Empty)' }];
  if (hex === 'f'.repeat(32)) return [{ label: 'Kind', value: 'max GUID, all bits set' }];

  // RFC 9562 4.1 and 4.2: variant is the top bits of byte 8, version the high nibble of byte 6
  const version = parseInt(hex[12], 16);
  const v = parseInt(hex[16], 16);
  const variant = v < 8 ? 'NCS' : v < 12 ? 'RFC 9562' : v < 14 ? 'Microsoft' : 'reserved';
  const rows = [
    { label: 'Version', value: String(version) },
    { label: 'Variant', value: variant },
  ];
  if (version === 7 && variant === 'RFC 9562') {
    const ts = new Date(parseInt(hex.slice(0, 12), 16));
    rows.push(
      { label: 'Created (UTC)', value: ts.toISOString() },
      { label: 'Created (local)', value: ts.toLocaleString() },
    );
  }
  return rows;
}

export function GuidTool() {
  const [mode, setMode] = useState<Mode>('generate');
  const [pasted, setPasted] = useState('');
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

  const inspected = inspectGuid(pasted);

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>{mode === 'generate' ? 'options' : 'guid'}</PaneLabel>
          <Segmented
            options={[{ value: 'generate', label: 'Generate' }, { value: 'inspect', label: 'Inspect' }]}
            value={mode}
            onChange={setMode}
          />
          {mode === 'generate' ? (
            <>
              <Row>
                <Segmented
                  options={[{ value: 'v4', label: 'v4 random' }, { value: 'v7', label: 'v7 sortable' }]}
                  value={version}
                  onChange={setVersion}
                />
              </Row>
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
                <select value={format} onChange={(e) => setFormat(e.target.value as GuidFormat)} className="field-select">
                  <option value="standard">xxxxxxxx-xxxx-…</option>
                  <option value="nohyphens">no hyphens</option>
                  <option value="braces">{'{braces}'}</option>
                  <option value="csharp">new Guid("…")</option>
                </select>
              </Row>
              <button onClick={generate} className="btn-primary">Generate</button>
              {version === 'v7' && (
                <p className="font-mono text-xs text-faint">
                  v7 = time-ordered, index-friendly. Same layout as Guid.CreateVersion7() in .NET 9+.
                </p>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder="Paste a GUID, any format Generate writes"
                spellCheck={false}
                className="field-input"
              />
              {pasted.trim() && !inspected && <p className="font-mono text-xs text-bad">Not a GUID</p>}
            </>
          )}
        </>
      }
      right={
        mode === 'generate' ? (
          <>
            <PaneLabel>guids</PaneLabel>
            <Output text={output} placeholder="Generated GUIDs land here" />
          </>
        ) : (
          <>
            <PaneLabel>details</PaneLabel>
            {inspected ? <ResultRows rows={inspected} /> : (
              <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
                Version, variant, and the v7 creation time land here
              </div>
            )}
          </>
        )
      }
    />
    <RefSection title="v4 vs v7">
      <RefTable rows={[
        ['v4 — fully random', 'Fine as an opaque identifier. As a clustered primary key it fragments B-tree indexes: inserts land everywhere.'],
        ['v7 — time-ordered', 'First 48 bits are a Unix ms timestamp, so new values sort last. Inserts append instead of splitting pages. Use for database keys.'],
        ['v7 caveat', 'The timestamp leaks creation time. Don’t use where that matters.'],
      ]} />
      <RefCode code={`Guid.NewGuid();          // v4
Guid.CreateVersion7();   // v7, .NET 9+
Guid.CreateVersion7(timeProvider.GetUtcNow()); // testable`} />
    </RefSection>
    </>
  );
}
