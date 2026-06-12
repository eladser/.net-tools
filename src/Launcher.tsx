import { useState, useEffect } from 'react';
import { TOOLS, GROUPS } from './tools/registry';

// Nov 2026 GA, per the .NET release train
const NET11_GA = new Date('2026-11-10T00:00:00Z');

function StatusStrip() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const unix = Math.floor(now.getTime() / 1000);
  const daysToNet11 = Math.max(0, Math.ceil((NET11_GA.getTime() - now.getTime()) / 86400000));

  return (
    <div className="font-mono text-xs text-faint border-y border-border py-2.5 flex items-center gap-x-6 gap-y-1 flex-wrap">
      <span>unix <span className="text-muted">{unix}</span></span>
      <span className="hidden sm:inline">utc <span className="text-muted">{now.toISOString().slice(0, 19)}Z</span></span>
      <span>current LTS <span className="text-accent">.NET 10</span> <span className="hidden md:inline">until Nov 2028</span></span>
      <span className="hidden lg:inline">.NET 11 GA in <span className="text-muted">~{daysToNet11} days</span></span>
    </div>
  );
}

export function Launcher({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-7">
      <div className="max-w-2xl space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={`${import.meta.env.BASE_URL}icon-192.png`}
            alt=""
            className="w-12 h-12 rounded-xl shrink-0 hidden sm:block"
          />
          <p className="text-sm text-muted leading-relaxed">
            Twenty-five small tools for the daily .NET grind: convert, decode, generate, look up.
            Everything runs in this tab and nothing you paste goes anywhere, which you can check
            in the network panel. Built because alt-tabbing to a search engine for a GUID got old.
          </p>
        </div>
        <StatusStrip />
      </div>

      <div className="columns-1 md:columns-2 xl:columns-3 gap-10">
      {GROUPS.map((group) => (
        <section key={group} className="break-inside-avoid mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-faint border-b border-border pb-1.5 mb-1">
            {group}
          </h2>
          {TOOLS.filter(t => t.group === group).map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="w-full text-left px-2 py-2 -mx-2 rounded hover:bg-elevated/70 transition-colors group/item"
            >
              <span className="text-sm font-medium text-fg group-hover/item:text-accent transition-colors">
                {t.name}
              </span>
              <span className="block text-[13px] text-muted leading-snug mt-0.5">{t.desc}</span>
            </button>
          ))}
        </section>
      ))}
      </div>
    </div>
  );
}
