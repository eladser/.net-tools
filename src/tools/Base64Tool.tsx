import { useState } from 'react';
import { Textarea, Output, Segmented } from '@/components/ui';

type Mode = 'base64' | 'base64url';

function encode(text: string, mode: Mode): string {
  const bytes = new TextEncoder().encode(text);
  // chunked — spreading a large array as arguments overflows the call stack
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  let b64 = btoa(binary);
  if (mode === 'base64url') {
    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return b64;
}

function decode(text: string, mode: Mode): string {
  let b64 = text.trim();
  if (mode === 'base64url') {
    b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  }
  // restore padding either way — tolerant of stripped '='
  b64 += '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('base64');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (dir: 'encode' | 'decode') => {
    try {
      setOutput(dir === 'encode' ? encode(input, mode) : decode(input, mode));
      setError('');
    } catch {
      setOutput('');
      setError(`Not valid ${mode === 'base64url' ? 'Base64Url' : 'Base64'}`);
    }
  };

  return (
    <div className="space-y-3">
      <Segmented
        options={[{ value: 'base64', label: 'Base64' }, { value: 'base64url', label: 'Base64Url' }]}
        value={mode}
        onChange={setMode}
      />
      <Textarea
        rows={5}
        placeholder={mode === 'base64url' ? 'JWT segments, URL-safe tokens…' : 'Text or Base64 to convert'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button onClick={() => run('encode')} className="btn-primary">Encode</button>
        <button onClick={() => run('decode')} className="btn-secondary">Decode</button>
      </div>
      {error && <p className="font-mono text-xs text-bad">{error}</p>}
      <Output text={output} />
      {mode === 'base64url' && (
        <p className="font-mono text-xs text-faint">
          URL-safe alphabet (-_ instead of +/), no padding. System.Buffers.Text.Base64Url in .NET 9+.
        </p>
      )}
    </div>
  );
}
