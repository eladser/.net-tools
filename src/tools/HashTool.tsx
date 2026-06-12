import { useState } from 'react';
import { Textarea, ResultRows } from '@/components/ui';
import { md5 } from '@/lib/md5';

export function HashTool() {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<Array<{ label: string; value: string; tone?: 'warn' }>>([]);

  const run = async () => {
    if (!input) {
      setRows([]);
      return;
    }
    const data = new TextEncoder().encode(input);
    const digest = async (algo: string) => {
      const buf = await crypto.subtle.digest(algo, data);
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    };

    setRows([
      { label: 'SHA-256', value: await digest('SHA-256') },
      { label: 'SHA-384', value: await digest('SHA-384') },
      { label: 'SHA-512', value: await digest('SHA-512') },
      { label: 'SHA-1 (legacy)', value: await digest('SHA-1'), tone: 'warn' },
      { label: 'MD5 (legacy)', value: md5(input), tone: 'warn' },
    ]);
  };

  return (
    <div className="space-y-3">
      <Textarea
        rows={5}
        placeholder="Text to hash"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={run} className="btn-primary">Hash</button>
      {rows.length > 0 && <ResultRows rows={rows} />}
      {rows.length > 0 && (
        <p className="font-mono text-xs text-faint">SHA-1 and MD5 are broken for security use — shown for checksums and legacy systems only.</p>
      )}
    </div>
  );
}
