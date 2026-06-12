import { useState } from 'react';
import { Textarea, Output, Segmented, Bench, PaneLabel } from '@/components/ui';

type Format = 'csharp' | 'raw' | 'verbatim' | 'json' | 'sql';

function escapeFor(input: string, format: Format): string {
  switch (format) {
    case 'csharp':
      return '"' + input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t') + '"';
    case 'raw': {
      // C# 11 raw string literal: quote fence must beat the longest quote run inside
      const longestRun = Math.max(2, ...[...input.matchAll(/"+/g)].map(m => m[0].length));
      const fence = '"'.repeat(longestRun + 1);
      return input.includes('\n')
        ? `${fence}\n${input}\n${fence}`
        : `${fence}${input}${fence}`;
    }
    case 'verbatim':
      return '@"' + input.replace(/"/g, '""') + '"';
    case 'json':
      return JSON.stringify(input);
    case 'sql':
      return "'" + input.replace(/'/g, "''") + "'";
  }
}

function unescapeFor(input: string, format: Format): string {
  switch (format) {
    case 'csharp':
    case 'json':
      return JSON.parse(input);
    case 'raw': {
      const m = input.match(/^("{3,})\n?([\s\S]*?)\n?\1$/);
      if (!m) throw new Error('not a raw string');
      return m[2];
    }
    case 'verbatim': {
      const m = input.match(/^@"([\s\S]*)"$/);
      if (!m) throw new Error('not a verbatim string');
      return m[1].replace(/""/g, '"');
    }
    case 'sql':
      return input.replace(/^'|'$/g, '').replace(/''/g, "'");
  }
}

export function EscapeTool() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<Format>('csharp');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (dir: 'escape' | 'unescape') => {
    try {
      setOutput(dir === 'escape' ? escapeFor(input, format) : unescapeFor(input, format));
      setError('');
    } catch {
      setOutput('');
      setError('Input is not a valid escaped string for this format');
    }
  };

  return (
    <Bench
      left={
        <>
          <PaneLabel>input</PaneLabel>
          <Segmented
            options={[
              { value: 'csharp', label: 'C# "…"' },
              { value: 'raw', label: 'C# """raw"""' },
              { value: 'verbatim', label: 'C# @"…"' },
              { value: 'json', label: 'JSON' },
              { value: 'sql', label: 'SQL' },
            ]}
            value={format}
            onChange={setFormat}
          />
          <Textarea
            rows={12}
            placeholder="Text to escape, or an escaped string to undo"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button onClick={() => run('escape')} className="btn-primary">Escape</button>
            <button onClick={() => run('unescape')} className="btn-secondary">Unescape</button>
          </div>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>result</PaneLabel>
          <Output text={output} placeholder="Escaped or unescaped string lands here" />
          {format === 'raw' && (
            <p className="font-mono text-xs text-faint">
              Raw string literals (C# 11+): no escaping inside, the quote fence grows past any quote run in your text.
            </p>
          )}
        </>
      }
    />
  );
}
