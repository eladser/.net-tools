import { useState, useMemo } from 'react';
import { Textarea, Bench, PaneLabel } from '@/components/ui';

interface Frame {
  raw: string;
  method?: string;
  params?: string;
  file?: string;
  line?: string;
  isException?: boolean;
}

function parse(input: string): Frame[] {
  const lines = input.split('\n').map(l => l.trim()).filter(Boolean);
  const frameRegex = /^(?:at )(.+?)(?:\((.*?)\))?(?:\s+in\s+(.+?):line (\d+))?$/;

  return lines.map((line) => {
    if (!line.startsWith('at ')) {
      return { raw: line, isException: true };
    }
    const m = line.match(frameRegex);
    if (!m) return { raw: line };
    const [, method, params, file, lineNum] = m;
    return { raw: line, method, params, file, line: lineNum };
  });
}

export function StackTrace() {
  const [input, setInput] = useState('');
  const frames = useMemo(() => (input.trim() ? parse(input) : []), [input]);
  const withSource = frames.filter(f => f.file).length;

  return (
    <Bench
      left={
        <>
          <PaneLabel>stack trace</PaneLabel>
          <Textarea
            rows={16}
            placeholder={'System.NullReferenceException: Object reference not set…\n   at MyApp.Services.UserService.GetUser(Int32 id) in C:\\src\\UserService.cs:line 42'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </>
      }
      right={frames.length > 0 ? (
        <>
          <PaneLabel>{frames.filter(f => !f.isException).length} frames · {withSource} with source info</PaneLabel>
          <div className="divide-y divide-border/60 border-y border-border">
            {frames.map((f, i) => (
              <div key={i} className="py-2 px-1">
                {f.isException ? (
                  <span className="font-mono text-sm text-bad break-all">{f.raw}</span>
                ) : f.method ? (
                  <>
                    <span className="font-mono text-sm text-fg break-all">{f.method}</span>
                    {f.params !== undefined && (
                      <span className="font-mono text-sm text-faint break-all">({f.params})</span>
                    )}
                    {f.file && (
                      <div className="font-mono text-xs text-accent/80 mt-0.5 break-all">
                        {f.file}
                        {f.line && <span className="text-warn">:{f.line}</span>}
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-mono text-sm text-muted break-all">{f.raw}</span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <PaneLabel>parsed</PaneLabel>
          <div className="border border-dashed border-border rounded-md px-3 py-4 text-center font-mono text-xs text-faint">
            Frames land here, methods and source lines separated
          </div>
        </>
      )}
    />
  );
}
