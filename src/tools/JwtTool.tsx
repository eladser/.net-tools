import { useState } from 'react';
import { Textarea, Output, Bench, PaneLabel, RefSection, RefTable } from '@/components/ui';

const CLAIMS: Array<[string, string]> = [
  ['sub', 'subject — who the token is about'],
  ['iss', 'issuer'],
  ['aud', 'audience — who should accept it'],
  ['exp / nbf / iat', 'expiry, not-before, issued-at (all Unix seconds)'],
  ['jti', 'unique token id, for revocation lists'],
  ['scope / roles', 'authorization payload, naming varies by issuer'],
];

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
    <>
    <Bench
      left={
        <>
          <PaneLabel>token</PaneLabel>
          <Textarea
            rows={10}
            placeholder="eyJhbGciOi…"
            value={input}
            onChange={(e) => decode(e.target.value)}
          />
          {error && <p className="font-mono text-xs text-bad">{error}</p>}
          {expiry && (
            <p className={`font-mono text-xs ${expiry.expired ? 'text-bad' : 'text-ok'}`}>{expiry.text}</p>
          )}
          <p className="font-mono text-xs text-faint">Decoding only — the signature is not verified, and the token never leaves this page.</p>
        </>
      }
      right={
        header ? (
          <>
            <PaneLabel>header</PaneLabel>
            <Output text={header} />
            <PaneLabel>payload</PaneLabel>
            <Output text={payload} />
          </>
        ) : (
          <>
            <PaneLabel>decoded</PaneLabel>
            <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
              Header and payload land here
            </div>
          </>
        )
      }
    />
    <RefSection title="registered claims">
      <RefTable rows={CLAIMS} />
    </RefSection>
    </>
  );
}
