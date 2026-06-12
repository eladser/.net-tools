# .NET Tools

A collection of practical developer utilities for .NET developers. No frameworks, no tracking - just useful tools that work in your browser.

**[Live Demo](https://eladser.github.io/.net-tools)**

## Tools

### JSON
- **Formatter & Validator** - Format, validate, and minify JSON with error highlighting
- **JSON to C#** - Generate C# classes or records from JSON with nullable support

### Generators
- **GUID Generator** - Generate UUIDs in various formats (standard, no hyphens, braces, C#)
- **Password Generator** - Create secure passwords with entropy-based strength meter
- **Hash Generator** - Compute MD5, SHA-1, SHA-256, SHA-512 hashes
- **Cron Builder** - Build cron expressions visually with human-readable descriptions

### Converters
- **Base64** - Encode/decode Base64 with UTF-8 support
- **Unix Timestamp** - Convert timestamps to human-readable dates and C# DateTime
- **Number Base Converter** - Convert between decimal, hex, binary, and octal
- **File Size Converter** - Convert bytes through KB, MB, GB, TB, PB, EB (binary/decimal modes)
- **TimeSpan Calculator** - Convert .NET ticks, milliseconds, and time components
- **String Escape** - Escape/unescape strings for C#, JSON, or SQL
- **URL Encode** - Encode/decode URL components

### Security & Debug
- **JWT Decoder** - Decode JSON Web Tokens to inspect header and payload
- **Stack Trace Analyzer** - Parse .NET stack traces into readable format
- **Enum Flags Calculator** - Visualize bitwise [Flags] enum values with presets
- **Connection String Builder** - Generate connection strings for SQL Server, MySQL, PostgreSQL, SQLite
- **Regex Tester** - Test regular expressions with real-time matching

### Reference
- **HTTP Status Codes** - Quick searchable reference for HTTP status codes

## Features

- 100% client-side - no data leaves your browser
- Dark/light theme with system preference detection
- Responsive design
- No dependencies, no tracking
- Clean, minimal UI

## Local Development

```bash
git clone https://github.com/eladser/.net-tools.git
cd .net-tools

# Open index.html directly, or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## Tech Stack

- Vanilla JavaScript
- CSS custom properties for theming
- Web Crypto API for hashing
- GitHub Pages for hosting

## Support

If you find this useful, consider [buying me a coffee](https://ko-fi.com/eladser).

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Created by [eladser](https://github.com/eladser)
