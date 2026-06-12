import { useState } from 'react';
import { Textarea, ResultRows, Bench, PaneLabel, RefSection, RefCode } from '@/components/ui';
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
    <>
    <Bench
      left={
        <>
          <PaneLabel>input</PaneLabel>
          <Textarea
            rows={10}
            placeholder="Text to hash"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={run} className="btn-primary">Hash</button>
        </>
      }
      right={
        <>
          <PaneLabel>digests</PaneLabel>
          {rows.length > 0 ? (
            <>
              <ResultRows rows={rows} />
              <p className="font-mono text-xs text-faint">SHA-1 and MD5 are broken for security use — shown for checksums and legacy systems only.</p>
            </>
          ) : (
            <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
              Hashes land here — click any row to copy
            </div>
          )}
        </>
      }
    />
    <RefSection title="the one-liners since .net 5">
      <RefCode code={`Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(s)));

// Passwords are a different problem — never a bare hash:
Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);`} />
    </RefSection>
    </>
  );
}
