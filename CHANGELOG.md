# Changelog

## 2.1.0 — 2026-06-12

### Added
- ULID generator: sortable 26-char IDs, timestamp plus crypto-random, Crockford base32.
- Case converter: Pascal, camel, snake, kebab, constant, title, and dot case from one input.
- Date format tester: live preview of `DateTime.ToString` format strings, with a common-formats reference.
- Config to env vars: converts appsettings.json keys to `Section__Key` environment variables and back.
- JSON to YAML and back. Adds js-yaml as a dependency.
- The .NET versions reference now expands per release to list its major features.

### Changed
- Tools show input and result side by side on wide screens.
- Tool pages have reference sections: common cron schedules load into the builder on click, date format specifiers load into the tester, plus C# snippets and lookup tables per tool (.NET naming conventions, JWT claims, NuGet driver packages, config provider precedence, GUID v4 vs v7, sizes that matter in .NET).
- The home view lists every tool, with a live status line: Unix time, UTC, the current LTS, and days to the next release.
- New color theme, icon, and social images.
- HTTP status codes flow into two columns on wide screens.

## 2.0.0 — 2026-06-12

Rebuilt on React, TypeScript, and Vite. Twenty tools, all client-side.

### Added
- Sidebar navigation with grouped tools, search (`/` or Ctrl+K), and a shareable link per tool (`#json-to-csharp`).
- GUID v7: time-ordered GUIDs with the same layout as `Guid.CreateVersion7()` in .NET 9.
- Base64Url mode in the Base64 tool.
- C# raw string literals (`"""…"""`) and verbatim strings in the escape tool.
- Redis and MongoDB connection strings.
- SHA-384, plus relative time and `DateTimeOffset` snippets in the timestamp tool.
- .NET versions reference: TFMs, C# pairings, and support windows from Framework 4.8.1 to the .NET 11 preview.
- Installable as an offline app (PWA).
- Click-to-copy on result rows and output blocks.

### Fixed
- Password generation uses `crypto.getRandomValues` with rejection sampling. It was `Math.random()`.
- GUID v4 comes from `crypto.randomUUID()`. Also was `Math.random()`.
- The JWT decoder handles tokens with unpadded base64url segments, which previously failed to decode.
- Number base conversion uses BigInt, so 64-bit values keep their precision.
- JSON to C# converts snake_case keys to PascalCase and adds `[JsonPropertyName]`, maps ISO dates to `DateTime` and GUID strings to `Guid`, merges array items into one type, and uses `long` for values past 2^31.

### Removed
- Google Analytics.
- The light theme.

## 1.x — 2025

Single-page vanilla JS collection of ~18 tools: JSON formatter, JSON to C#, GUID/password/hash generators, cron builder, Base64, timestamps, string escape, URL encode, JWT decoder, stack trace parser, connection strings, enum flags, regex tester, number base, file size, TimeSpan, HTTP status codes.
