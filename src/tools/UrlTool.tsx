import { useState } from 'react';
import { Textarea, Output, Bench, PaneLabel } from '@/components/ui';

export function UrlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (dir: 'encode' | 'decode') => {
    try {
      setOutput(dir === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
      setError('');
    } catch {
      setOutput('');
      setError('Invalid URL encoding');
    }
  };

  return (
    <Bench
      left={
        <>
          <PaneLabel>input</PaneLabel>
          <Textarea
            rows={10}
            placeholder="Text or URL-encoded component"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button onClick={() => run('encode')} className="btn-primary">Encode</button>
            <button onClick={() => run('decode')} className="btn-secondary">Decode</button>
          </div>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>result</PaneLabel>
          <Output text={output} placeholder="Encoded or decoded component lands here" />
        </>
      }
    />
  );
}
