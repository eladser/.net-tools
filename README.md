# .NET Tools

Browser utilities for .NET developers. Twenty tools behind one sidebar — paste, convert, copy, move on. Everything runs client-side; nothing you type leaves the page. No analytics, no tracking, and that's verifiable in the network tab.

**[eladser.github.io/.net-tools](https://eladser.github.io/.net-tools/)**

## Tools

**JSON & C#** — JSON formatter/validator, and a JSON-to-C# generator that handles snake_case → PascalCase with `[JsonPropertyName]`, spots `DateTime` and `Guid` values, merges array items into one type, and picks `int`/`long`/`double` correctly.

**Generators** — GUIDs (random v4, or time-ordered v7 matching `Guid.CreateVersion7()` from .NET 9), passwords from `crypto.getRandomValues` with an entropy readout, SHA-256/384/512 plus legacy SHA-1/MD5, and a cron expression builder.

**Converters** — Base64 and Base64Url, URL encoding, string escaping for C# (regular, verbatim `@"…"`, and C# 11 raw `"""…"""` literals), number bases with BigInt precision past 2^53, and file sizes in 1024 or 1000 mode.

**Time** — Unix timestamps to everything (ISO, local, relative, `DateTimeOffset` snippet) and a TimeSpan calculator with ticks and microseconds.

**Security & Debug** — JWT decoder with expiry check, .NET stack trace parser, connection string builder (SQL Server, PostgreSQL, MySQL, SQLite, Redis, MongoDB), `[Flags]` enum bit visualizer with clickable bits, and a live regex tester.

**Reference** — searchable HTTP status codes and a .NET version table: TFMs, C# pairings, LTS/STS windows, and what shipped in each release through the .NET 11 preview.

Direct-link any tool: `…/.net-tools/#json-to-csharp`, `…/#guid`, `…/#jwt`. Press `/` or Ctrl+K to search.

Installable as an offline app (PWA) — open the site in Chrome or Edge and click the install icon in the address bar.

## Development

```bash
git clone https://github.com/eladser/.net-tools.git
cd .net-tools
npm install
npm run dev      # localhost:3001
npm run build
npm run lint
```

React 19, Vite 8, Tailwind 4, TypeScript. No runtime dependencies beyond React.

## License

MIT
