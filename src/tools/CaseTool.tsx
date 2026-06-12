import { useState, useMemo } from 'react';
import { ResultRows, Bench, PaneLabel, RefSection, RefTable } from '@/components/ui';

const CONVENTIONS: Array<[string, string]> = [
  ['PascalCase', 'classes, records, methods, properties, public fields, constants, enum members'],
  ['camelCase', 'locals, parameters'],
  ['_camelCase', 'private instance fields'],
  ['s_camelCase', 'private static fields (runtime repo style)'],
  ['IPascalCase', 'interfaces'],
  ['TPascalCase', 'generic type parameters'],
  ['kebab-case', 'CLI args, package routes, URLs'],
  ['SCREAMING_SNAKE', 'not idiomatic in C#; constants are PascalCase'],
];

function words(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(w => w.toLowerCase());
}

export function CaseTool() {
  const [input, setInput] = useState('');

  const rows = useMemo(() => {
    const w = words(input);
    if (w.length === 0) return [];
    const pascal = w.map(x => x[0].toUpperCase() + x.slice(1)).join('');
    return [
      { label: 'PascalCase', value: pascal },
      { label: 'camelCase', value: pascal[0].toLowerCase() + pascal.slice(1) },
      { label: 'snake_case', value: w.join('_') },
      { label: 'kebab-case', value: w.join('-') },
      { label: 'CONSTANT_CASE', value: w.join('_').toUpperCase() },
      { label: 'Title Case', value: w.map(x => x[0].toUpperCase() + x.slice(1)).join(' ') },
      { label: 'dot.case', value: w.join('.') },
    ];
  }, [input]);

  return (
    <>
    <Bench
      left={
        <>
          <PaneLabel>identifier or phrase</PaneLabel>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="user_account_id, UserAccountId, user account id…"
            className="field-input"
          />
          <p className="font-mono text-xs text-faint">
            Splits on case boundaries, separators, and digits-to-letters. Handles acronym runs (HTTPRequest → http, request).
          </p>
        </>
      }
      right={
        <>
          <PaneLabel>every casing</PaneLabel>
          {rows.length > 0 ? <ResultRows rows={rows} /> : (
            <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
              All seven casings land here — click any row to copy
            </div>
          )}
        </>
      }
    />
    <RefSection title=".net naming conventions">
      <RefTable rows={CONVENTIONS} />
    </RefSection>
    </>
  );
}
