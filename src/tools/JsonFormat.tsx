import { useState } from 'react';
import { Textarea, Output, Bench, PaneLabel } from '@/components/ui';

export function JsonFormat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (indent: number | undefined) => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, indent));
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  return (
    <Bench
      left={
        <>
          <PaneLabel>input</PaneLabel>
          <Textarea
            rows={18}
            placeholder='{"name": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button onClick={() => run(2)} className="btn-primary">Format</button>
            <button onClick={() => run(undefined)} className="btn-secondary">Minify</button>
          </div>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>result</PaneLabel>
          <Output text={output} placeholder="Formatted JSON lands here" />
        </>
      }
    />
  );
}
