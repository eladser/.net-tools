import { useState } from 'react';
import { load, dump } from 'js-yaml';
import { Textarea, Output, Bench, PaneLabel } from '@/components/ui';

export function JsonYamlTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (dir: 'toYaml' | 'toJson') => {
    try {
      if (dir === 'toYaml') {
        setOutput(dump(JSON.parse(input), { lineWidth: 100 }));
      } else {
        setOutput(JSON.stringify(load(input), null, 2));
      }
      setError('');
    } catch (e) {
      setOutput('');
      setError(e instanceof Error ? e.message.split('\n')[0] : 'Conversion failed');
    }
  };

  return (
    <Bench
      left={
        <>
          <PaneLabel>input</PaneLabel>
          <Textarea
            rows={16}
            placeholder={'JSON or YAML — appsettings.json one way, docker-compose the other'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button onClick={() => run('toYaml')} className="btn-primary">JSON → YAML</button>
            <button onClick={() => run('toJson')} className="btn-secondary">YAML → JSON</button>
          </div>
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
        </>
      }
      right={
        <>
          <PaneLabel>result</PaneLabel>
          <Output text={output} placeholder="Converted document lands here" />
        </>
      }
    />
  );
}
