import { useState } from 'react';
import { Textarea, Output, Bench, PaneLabel, Segmented, RefSection, RefTable } from '@/components/ui';

type Dir = 'toEnv' | 'toJson';

function flatten(obj: unknown, prefix = ''): Array<[string, string]> {
  if (typeof obj !== 'object' || obj === null) {
    return [[prefix, String(obj ?? '')]];
  }
  const entries: Array<[string, string]> = [];
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => entries.push(...flatten(v, prefix ? `${prefix}__${i}` : String(i))));
  } else {
    for (const [k, v] of Object.entries(obj)) {
      entries.push(...flatten(v, prefix ? `${prefix}__${k}` : k));
    }
  }
  return entries;
}

function unflatten(lines: string[]): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!key) continue;

    const parts = key.split(/__|:/);
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof node[part] !== 'object' || node[part] === null) node[part] = {};
      node = node[part] as Record<string, unknown>;
    }
    node[parts[parts.length - 1]] = value;
  }
  return root;
}

export function AppSettingsTool() {
  const [dir, setDir] = useState<Dir>('toEnv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = () => {
    try {
      if (dir === 'toEnv') {
        const parsed = JSON.parse(input);
        setOutput(flatten(parsed).map(([k, v]) => `${k}=${v}`).join('\n'));
      } else {
        const lines = input.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
        setOutput(JSON.stringify(unflatten(lines), null, 2));
      }
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>{dir === 'toEnv' ? 'appsettings.json' : 'environment variables'}</PaneLabel>
          <Segmented
            options={[
              { value: 'toEnv', label: 'json → env' },
              { value: 'toJson', label: 'env → json' },
            ]}
            value={dir}
            onChange={setDir}
          />
          <Textarea
            rows={14}
            placeholder={dir === 'toEnv'
              ? '{"Logging": {"LogLevel": {"Default": "Warning"}}, "ConnectionStrings": {"Db": "..."}}'
              : 'Logging__LogLevel__Default=Warning\nConnectionStrings__Db=...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={run} className="btn-primary">Convert</button>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>{dir === 'toEnv' ? 'environment variables' : 'appsettings.json'}</PaneLabel>
          <Output
            text={output}
            placeholder="Nested config keys become Section__Sub__Key, the double-underscore form Docker and Kubernetes need"
          />
        </>
      }
    />
    <RefSection title="provider precedence — later wins">
      <RefTable rows={[
        ['1. appsettings.json', 'base values'],
        ['2. appsettings.{Environment}.json', 'per-environment overrides'],
        ['3. user secrets', 'Development only'],
        ['4. environment variables', 'what containers set — beats all the files'],
        ['5. command line', 'beats everything'],
      ]} />
    </RefSection>
    </>
  );
}
