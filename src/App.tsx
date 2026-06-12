import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { TOOLS, GROUPS } from './tools/registry';
import { Launcher } from './Launcher';
import { version } from '../package.json';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const HOME = 'home';

function toolFromHash(): string {
  const id = window.location.hash.replace(/^#\/?/, '');
  return TOOLS.some(t => t.id === id) ? id : HOME;
}

export default function App() {
  const [activeId, setActiveId] = useState(toolFromHash);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHash = () => setActiveId(toolFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inEditor = (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA';
      if (((e.ctrlKey || e.metaKey) && e.key === 'k') || (e.key === '/' && !inEditor)) {
        e.preventDefault();
        setMenuOpen(true);
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = TOOLS.find(t => t.id === activeId) ?? null;

  const filtered = useMemo(() => {
    if (!query.trim()) return TOOLS;
    const q = query.toLowerCase();
    return TOOLS.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.keywords.includes(q) ||
      t.desc.toLowerCase().includes(q)
    );
  }, [query]);

  const select = (id: string) => {
    window.location.hash = id === HOME ? '' : id;
    setActiveId(id);
    setMenuOpen(false);
    setQuery('');
  };

  const ToolBody = active?.component;

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <a
          href="#"
          className="flex items-center gap-2.5 font-mono text-sm select-none"
          onClick={(e) => { e.preventDefault(); select(HOME); }}
        >
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="w-5 h-5 rounded" />
          <span className="text-fg font-semibold">.NET Tools</span>
        </a>
      </div>

      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint w-3.5 h-3.5" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search · /"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) select(filtered[0].id);
              if (e.key === 'Escape') setQuery('');
            }}
            className="w-full pl-8 pr-3 py-1.5 text-sm font-mono border border-border rounded-md bg-bg text-fg placeholder:text-faint focus:border-accent"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {GROUPS.map((group) => {
          const tools = filtered.filter(t => t.group === group);
          if (tools.length === 0) return null;
          return (
            <div key={group} className="mb-4">
              <div className="px-1 pb-1 font-mono text-[11px] uppercase tracking-wider text-faint">{group}</div>
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => select(t.id)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                    t.id === activeId
                      ? 'bg-elevated text-accent'
                      : 'text-muted hover:text-fg hover:bg-elevated/50'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-2 font-mono text-xs text-faint">Nothing matches "{query}"</p>
        )}
      </nav>

      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="font-mono text-xs text-faint">v{version}</span>
        <a
          href="https://github.com/eladser/.net-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-fg transition-colors"
          aria-label="GitHub repository"
        >
          <GithubIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg text-fg lg:grid lg:grid-cols-[240px_1fr]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-12 border-b border-border bg-bg/95 backdrop-blur-sm">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="text-muted hover:text-fg">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="flex items-center gap-2 font-mono text-sm">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="w-5 h-5 rounded" />
          <span className="font-semibold">.NET Tools</span>
        </span>
      </div>

      {/* Sidebar: fixed panel on desktop, drawer on mobile */}
      <aside className="hidden lg:block border-r border-border bg-surface h-dvh sticky top-0">
        {sidebar}
      </aside>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-surface border-r border-border h-full animate-slide-up">{sidebar}</div>
          <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="min-w-0">
        {active && ToolBody ? (
          <div className="max-w-410 px-5 sm:px-8 py-6">
            <header className="mb-5 flex items-baseline gap-3 flex-wrap">
              <h1 className="text-lg font-semibold tracking-tight">{active.name}</h1>
              <p className="text-sm text-muted">{active.desc}</p>
            </header>
            <div key={active.id} className="@container animate-fade-in">
              <ToolBody />
            </div>
          </div>
        ) : (
          <div className="max-w-410 px-5 sm:px-8 py-6">
            <header className="mb-6 flex items-baseline gap-3 flex-wrap">
              <h1 className="text-lg font-semibold tracking-tight">All tools</h1>
              <p className="text-sm text-muted">
                Client-side, nothing leaves the page. Press <kbd className="font-mono text-xs border border-border rounded px-1">/</kbd> to search.
              </p>
            </header>
            <div className="animate-fade-in">
              <Launcher onSelect={select} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
