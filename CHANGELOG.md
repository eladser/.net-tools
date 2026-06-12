# Changelog

## 2.0.0 — 2026-06-12

Full rework. Same idea — client-side utilities for .NET developers — different execution.

### Interface
- Sidebar navigation with grouped tools, search (`/` or Ctrl+K), and one tool per view instead of an 18-tool scroll page. Every tool has a shareable link (`#json-to-csharp`).
- Dark terminal-native design, matching SimpleConfigDiff — these tools are a family now.
- Click-to-copy on every result row; copy buttons on output blocks.
- Installable as an offline app (PWA).

### Tool upgrades
- **JSON to C#**: snake_case keys become PascalCase properties with `[JsonPropertyName]`, ISO dates map to `DateTime`, GUID strings to `Guid`, array items merge into a single type, integers past 2^31 become `long`, and arrays use `List<T>`.
- **GUID**: added time-ordered v7 (the layout `Guid.CreateVersion7()` produces in .NET 9+), and v4 now comes from `crypto.randomUUID` instead of `Math.random`.
- **Password**: actually cryptographically secure now — `crypto.getRandomValues` with rejection sampling instead of `Math.random`, which the old version used while claiming "secure".
- **Base64**: added Base64Url mode (.NET 9's `System.Buffers.Text.Base64Url`), tolerant of stripped padding.
- **String escape**: added C# 11 raw string literals (`"""…"""` with a quote fence that adapts to your content) and verbatim strings.
- **JWT decoder**: handles unpadded base64url segments (the old one threw on many real tokens), and shows expiry status.
- **Number base**: BigInt under the hood — 64-bit values no longer silently lose precision.
- **Connection strings**: added Redis and MongoDB.
- **Timestamp**: added milliseconds, relative time, and a `DateTimeOffset` snippet.
- **Hashes**: added SHA-384; MD5 verified against reference vectors.
- **Enum flags**: bits are clickable — toggle them and read the value back as a C# expression.

### New
- **.NET versions reference**: TFMs, C# pairings, LTS/STS support windows, and headline features for every release from Framework 4.8.1 through the .NET 11 preview.

### Removed
- Google Analytics. The old site claimed "no tracking" while shipping GA — now the claim is true.
- Light theme. One theme, done properly.

### Stack
- Vanilla JS (one 717-line file, inline onclick handlers) → React 19 + TypeScript + Vite 8 + Tailwind 4, one module per tool.
- Fonts self-hosted; zero external requests of any kind.

## 1.x — 2025

Single-page vanilla JS collection of ~18 tools: JSON formatter, JSON to C#, GUID/password/hash generators, cron builder, Base64, timestamps, string escape, URL encode, JWT decoder, stack trace parser, connection strings, enum flags, regex tester, number base, file size, TimeSpan, HTTP status codes.
