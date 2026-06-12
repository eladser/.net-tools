import { useState, useMemo } from 'react';
import { Textarea, Row, Checkbox } from '@/components/ui';

export function RegexTool() {
  const [pattern, setPattern] = useState('');
  const [input, setInput] = useState('');
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);

  const result = useMemo(() => {
    if (!pattern) return null;
    // Live matching is synchronous — a backtracking pattern on a huge input would freeze the tab
    if (input.length > 20000) {
      return { matches: [], error: 'Input over 20k characters — trim it for live matching' };
    }
    try {
      const regex = new RegExp(pattern, 'g' + (flagI ? 'i' : '') + (flagM ? 'm' : ''));
      const matches = [...input.matchAll(regex)];
      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid pattern' };
    }
  }, [pattern, input, flagI, flagM]);

  // Build highlighted segments
  const segments = useMemo(() => {
    if (!result || result.error || result.matches.length === 0) return null;
    const parts: Array<{ text: string; hit: boolean }> = [];
    let pos = 0;
    for (const m of result.matches) {
      if (m.index === undefined || m[0] === '') continue;
      if (m.index > pos) parts.push({ text: input.slice(pos, m.index), hit: false });
      parts.push({ text: m[0], hit: true });
      pos = m.index + m[0].length;
    }
    if (pos < input.length) parts.push({ text: input.slice(pos), hit: false });
    return parts;
  }, [result, input]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        placeholder={'\\b\\w+@\\w+\\.\\w+\\b'}
        className="field-input"
      />
      <Row>
        <Checkbox label="Ignore case" checked={flagI} onChange={setFlagI} />
        <Checkbox label="Multiline" checked={flagM} onChange={setFlagM} />
        {result && !result.error && pattern && (
          <span className="font-mono text-xs text-faint ml-auto">
            {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}
          </span>
        )}
      </Row>
      <Textarea
        rows={6}
        placeholder="Test input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {result?.error && <p className="font-mono text-xs text-bad">{result.error}</p>}
      {segments && (
        <pre className="font-mono text-sm bg-bg border border-border rounded-md px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all">
          {segments.map((s, i) =>
            s.hit
              ? <mark key={i} className="bg-accent/25 text-accent rounded-sm">{s.text}</mark>
              : <span key={i} className="text-muted">{s.text}</span>
          )}
        </pre>
      )}
      {result && !result.error && result.matches.length > 0 && result.matches[0].length > 1 && (
        <div className="font-mono text-xs text-faint">
          Groups in first match: {result.matches[0].slice(1).map((g, i) => `$${i + 1}="${g ?? ''}"`).join('  ')}
        </div>
      )}
    </div>
  );
}
