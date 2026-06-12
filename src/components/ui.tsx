import { useState, useCallback, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [text]);

  return (
    <button onClick={copy} className="btn-secondary text-xs" disabled={!text}>
      {copied ? <Check className="w-3 h-3 text-ok" /> : <Copy className="w-3 h-3" />}
      {label ?? 'Copy'}
    </button>
  );
}

// Output block with a copy affordance. Renders nothing until there's content.
export function Output({ text, placeholder }: { text: string; placeholder?: string }) {
  if (!text) {
    return placeholder ? (
      <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
        {placeholder}
      </div>
    ) : null;
  }
  return (
    <div className="relative group">
      <pre className="font-mono text-sm bg-bg border border-border rounded-md px-3 py-2.5 overflow-x-auto whitespace-pre-wrap break-all text-fg">
        {text}
      </pre>
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={text} />
      </div>
    </div>
  );
}

export function Field({ label, children, grow }: { label: string; children: ReactNode; grow?: boolean }) {
  return (
    <label className={`flex items-center gap-2 text-sm text-muted ${grow ? 'flex-1' : ''}`}>
      <span className="shrink-0">{label}</span>
      {children}
    </label>
  );
}

export function Checkbox({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-muted cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent w-3.5 h-3.5"
      />
      {label}
    </label>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-4 flex-wrap">{children}</div>;
}

// Workbench: input/controls left, result right. Container-query driven, so the
// same tool renders side-by-side in focus view and stacked inside a wall panel.
export function Bench({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-x-6 gap-y-4 items-start">
      <div className="space-y-3 min-w-0">{left}</div>
      <div className="space-y-3 min-w-0">{right}</div>
    </div>
  );
}

export function PaneLabel({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[11px] uppercase tracking-wider text-faint">{children}</div>;
}

// Per-tool reference content below the bench — what makes a single-tool page
// worth a full page. Tables, snippets, lookups specific to that tool.
export function RefSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 pt-5 border-t border-border space-y-3 max-w-4xl">
      <PaneLabel>{title}</PaneLabel>
      {children}
    </section>
  );
}

export function RefTable({ rows, onPick, pickHint }: {
  rows: Array<[string, string]>;
  onPick?: (key: string) => void;
  pickHint?: string;
}) {
  return (
    <div>
      <div className="divide-y divide-border/60 border-y border-border">
        {rows.map(([k, v]) => {
          const inner = (
            <>
              <span className="font-mono text-sm text-fg w-56 shrink-0 break-all">{k}</span>
              <span className="text-sm text-muted">{v}</span>
            </>
          );
          return onPick ? (
            <button
              key={k}
              onClick={() => onPick(k)}
              className="w-full flex items-baseline gap-4 py-1.5 px-1 text-left hover:bg-elevated/60 transition-colors"
            >
              {inner}
            </button>
          ) : (
            <div key={k} className="flex items-baseline gap-4 py-1.5 px-1">{inner}</div>
          );
        })}
      </div>
      {onPick && pickHint && <p className="font-mono text-xs text-faint mt-2">{pickHint}</p>}
    </div>
  );
}

export function RefCode({ code }: { code: string }) {
  return (
    <div className="relative group">
      <pre className="font-mono text-[13px] leading-relaxed bg-bg border border-border rounded-md px-3 py-2.5 overflow-x-auto text-muted">
        {code}
      </pre>
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      {...props}
      className={`field-input resize-y min-h-24 ${props.className ?? ''}`}
    />
  );
}

// Segmented control for small mode switches
export function Segmented<T extends string>({ options, value, onChange }: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center border border-border rounded-md overflow-hidden text-xs">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1.5 transition-colors border-r border-border last:border-r-0 font-mono ${
            value === o.value ? 'bg-elevated text-fg' : 'bg-surface text-muted hover:text-fg'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Key/value result rows (timestamp, timespan, hashes)
export function ResultRows({ rows }: { rows: Array<{ label: string; value: string; tone?: 'warn' }> }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border/60 border-y border-border">
      {rows.map((r, i) => (
        <button
          key={r.label}
          onClick={() => {
            navigator.clipboard.writeText(r.value).then(() => {
              setCopiedIdx(i);
              setTimeout(() => setCopiedIdx((c) => (c === i ? null : c)), 1200);
            });
          }}
          className="w-full flex items-baseline gap-4 py-1.5 px-1 text-left hover:bg-elevated/50 transition-colors group"
          title="Click to copy"
        >
          <span className={`text-xs w-28 shrink-0 ${r.tone === 'warn' ? 'text-warn' : 'text-faint'}`}>
            {r.label}
          </span>
          <span className="font-mono text-sm text-fg break-all">{r.value}</span>
          <span className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {copiedIdx === i
              ? <Check className="w-3 h-3 text-ok" />
              : <Copy className="w-3 h-3 text-faint" />}
          </span>
        </button>
      ))}
    </div>
  );
}
