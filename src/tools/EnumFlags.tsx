import { useState } from 'react';
import { Row, Field, Segmented, Bench, PaneLabel, RefSection, RefCode } from '@/components/ui';

const PRESETS = {
  file: {
    label: 'FileAttributes',
    flags: [
      ['ReadOnly', 1], ['Hidden', 2], ['System', 4], ['Directory', 16],
      ['Archive', 32], ['Device', 64], ['Normal', 128], ['Temporary', 256],
      ['SparseFile', 512], ['ReparsePoint', 1024], ['Compressed', 2048], ['Encrypted', 16384],
    ] as Array<[string, number]>,
  },
  binding: {
    label: 'BindingFlags',
    flags: [
      ['IgnoreCase', 1], ['DeclaredOnly', 2], ['Instance', 4], ['Static', 8],
      ['Public', 16], ['NonPublic', 32], ['FlattenHierarchy', 64], ['InvokeMethod', 256],
      ['CreateInstance', 512], ['GetField', 1024], ['SetField', 2048],
      ['GetProperty', 4096], ['SetProperty', 8192],
    ] as Array<[string, number]>,
  },
  generic: {
    label: 'Bits',
    flags: Array.from({ length: 16 }, (_, i) => [`Bit${i}`, 2 ** i]) as Array<[string, number]>,
  },
};

type PresetKey = keyof typeof PRESETS;

export function EnumFlags() {
  const [preset, setPreset] = useState<PresetKey>('file');
  const [raw, setRaw] = useState('33');

  const value = parseInt(raw, 10);
  const valid = !isNaN(value) && value >= 0 && Number.isSafeInteger(value);
  const flags = PRESETS[preset].flags;

  const setFlags = valid ? flags.filter(([, v]) => (value & v) === v) : [];
  const expression = setFlags.length
    ? setFlags.map(([n]) => `${PRESETS[preset].label}.${n}`).join(' | ')
    : valid && value === 0 ? '0 — no flags set' : '';

  const toggle = (bit: number) => {
    if (!valid) return;
    setRaw(String(value ^ bit));
  };

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>flags</PaneLabel>
          <Row>
            <Segmented
              options={(Object.keys(PRESETS) as PresetKey[]).map(k => ({ value: k, label: PRESETS[k].label }))}
              value={preset}
              onChange={setPreset}
            />
            <Field label="Value">
              <input
                type="text"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                className="field-input w-28"
              />
            </Field>
          </Row>
          {!valid && raw.trim() !== '' && <p className="font-mono text-xs text-bad">Enter a non-negative integer</p>}
          {valid && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {flags.map(([name, bit]) => {
                const on = (value & bit) === bit;
                return (
                  <button
                    key={name}
                    onClick={() => toggle(bit)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-left font-mono text-xs transition-colors ${
                      on
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border text-muted hover:border-border-strong'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-faint">{bit}</span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      }
      right={
        valid ? (
          <>
            <PaneLabel>decomposition</PaneLabel>
            <div className="font-mono text-sm text-fg">
              <div className="flex items-baseline gap-3 py-1.5 border-b border-border/60">
                <span className="text-xs text-faint w-16">decimal</span>{value}
              </div>
              <div className="flex items-baseline gap-3 py-1.5 border-b border-border/60">
                <span className="text-xs text-faint w-16">hex</span>0x{value.toString(16).toUpperCase()}
              </div>
              <div className="flex items-baseline gap-3 py-1.5 border-b border-border/60">
                <span className="text-xs text-faint w-16">binary</span>{value.toString(2).padStart(16, '0')}
              </div>
            </div>
            {expression && (
              <p className="font-mono text-sm text-accent break-all">{expression}</p>
            )}
          </>
        ) : (
          <>
            <PaneLabel>decomposition</PaneLabel>
            <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
              Set bits and the C# expression land here
            </div>
          </>
        )
      }
    />
    <RefSection title="declaring one properly">
      <RefCode code={`[Flags]
public enum Permissions
{
    None    = 0,
    Read    = 1 << 0,
    Write   = 1 << 1,
    Delete  = 1 << 2,
    All     = Read | Write | Delete,
}

// (perms & Permissions.Write) != 0 is faster than HasFlag on hot paths`} />
    </RefSection>
    </>
  );
}
