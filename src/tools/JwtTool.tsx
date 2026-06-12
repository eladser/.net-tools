import { useState } from 'react';
import { Textarea, Output } from '@/components/ui';

function decodeSegment(seg: string): unknown {
  let b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
  b64 += '='.repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function JwtTool() {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [expiry, setExpiry] = useState<{ text: string; expired: boolean } | null>(null);
  const [error, setError] = useState('');

  const decode = (raw: string) => {
    setInput(raw);
    const token = raw.trim();
    if (!token) {
      setHeader(''); setPayload(''); setExpiry(null); setError('');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setHeader(''); setPayload(''); setExpiry(null);
      setError('A JWT has three dot-separated segments');
      return;
    }

    try {
      const h = decodeSegment(parts[0]);
      const p = decodeSegment(parts[1]) as Record<string, unknown>;
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setError('');

      if (typeof p.exp === 'number') {
        const expDate = new Date(p.exp * 1000);
        const expired = expDate.getTime() < Date.now();
        setExpiry({
          text: `${expired ? 'Expired' : 'Expires'} ${expDate.toLocaleString()}`,
          expired,
        });
      } else {
        setExpiry(null);
      }
    } catch {
      setHeader(''); setPayload(''); setExpiry(null);
      setError('Could not decode — not valid base64url JSON');
    }
  };

  return (
    <div className="space-y-3">
      <Textarea
        rows={4}
        placeholder="eyJhbGciOi…"
        value={input}
        onChange={(e) => decode(e.target.value)}
      />
      {error && <p className="font-mono text-xs text-bad">{error}</p>}
      {expiry && (
        <p className={`font-mono text-xs ${expiry.expired ? 'text-bad' : 'text-ok'}`}>{expiry.text}</p>
      )}
      {header && (
        <div className="space-y-3">
          <div>
            <div className="font-mono text-xs text-faint mb-1">header</div>
            <Output text={header} />
          </div>
          <div>
            <div className="font-mono text-xs text-faint mb-1">payload</div>
            <Output text={payload} />
          </div>
        </div>
      )}
      <p className="font-mono text-xs text-faint">Decoding only — the signature is not verified, and the token never leaves this page.</p>
    </div>
  );
}
