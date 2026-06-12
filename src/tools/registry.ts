import type { ComponentType } from 'react';
import { JsonFormat } from './JsonFormat';
import { JsonToCsharp } from './JsonToCsharp';
import { GuidTool } from './GuidTool';
import { PasswordTool } from './PasswordTool';
import { HashTool } from './HashTool';
import { CronTool } from './CronTool';
import { Base64Tool } from './Base64Tool';
import { UrlTool } from './UrlTool';
import { EscapeTool } from './EscapeTool';
import { BaseConvert } from './BaseConvert';
import { FileSize } from './FileSize';
import { TimestampTool } from './TimestampTool';
import { TimeSpanTool } from './TimeSpanTool';
import { JwtTool } from './JwtTool';
import { StackTrace } from './StackTrace';
import { ConnString } from './ConnString';
import { EnumFlags } from './EnumFlags';
import { RegexTool } from './RegexTool';
import { HttpCodes } from './HttpCodes';
import { DotnetVersions } from './DotnetVersions';

export interface Tool {
  id: string;
  name: string;
  desc: string;
  group: string;
  keywords: string;
  component: ComponentType;
}

export const TOOLS: Tool[] = [
  // JSON & C#
  { id: 'json-format', name: 'JSON Formatter', desc: 'Format, validate, and minify JSON.', group: 'JSON & C#', keywords: 'pretty print validate minify', component: JsonFormat },
  { id: 'json-to-csharp', name: 'JSON to C#', desc: 'Generate C# classes or records from JSON, with System.Text.Json attributes.', group: 'JSON & C#', keywords: 'class record poco dto generate', component: JsonToCsharp },

  // Generators
  { id: 'guid', name: 'GUID Generator', desc: 'Random v4 or timestamp-ordered v7 GUIDs, in the format you need.', group: 'Generators', keywords: 'uuid v4 v7 CreateVersion7 unique id', component: GuidTool },
  { id: 'password', name: 'Password Generator', desc: 'Random passwords from crypto.getRandomValues, with entropy readout.', group: 'Generators', keywords: 'secure random secret', component: PasswordTool },
  { id: 'hash', name: 'Hash Generator', desc: 'SHA-256, SHA-384, SHA-512, SHA-1 and MD5 of any text.', group: 'Generators', keywords: 'sha256 sha512 md5 checksum digest', component: HashTool },
  { id: 'cron', name: 'Cron Builder', desc: 'Build a cron expression and read it back in plain words.', group: 'Generators', keywords: 'schedule quartz ncrontab', component: CronTool },

  // Converters
  { id: 'base64', name: 'Base64', desc: 'Encode and decode Base64 or Base64Url, UTF-8 safe.', group: 'Converters', keywords: 'base64url encode decode', component: Base64Tool },
  { id: 'url-encode', name: 'URL Encode', desc: 'Encode and decode URL components.', group: 'Converters', keywords: 'percent escape uri', component: UrlTool },
  { id: 'string-escape', name: 'String Escape', desc: 'Escape for C# (including raw string literals), JSON, or SQL.', group: 'Converters', keywords: 'raw string literal verbatim quote', component: EscapeTool },
  { id: 'number-base', name: 'Number Base', desc: 'Decimal, hex, binary, and octal — edit any one.', group: 'Converters', keywords: 'hex binary octal radix', component: BaseConvert },
  { id: 'file-size', name: 'File Size', desc: 'Bytes through EB, in binary (1024) or decimal (1000) mode.', group: 'Converters', keywords: 'kb mb gb kib mib bytes', component: FileSize },

  // Time
  { id: 'timestamp', name: 'Unix Timestamp', desc: 'Timestamps to dates, dates to timestamps, with C# snippets.', group: 'Time', keywords: 'epoch unix DateTimeOffset utc', component: TimestampTool },
  { id: 'timespan', name: 'TimeSpan', desc: '.NET ticks, totals, and TimeSpan strings from time components.', group: 'Time', keywords: 'ticks duration milliseconds microseconds', component: TimeSpanTool },

  // Security & Debug
  { id: 'jwt', name: 'JWT Decoder', desc: 'Decode header and payload, with expiry check. Nothing leaves the page.', group: 'Security & Debug', keywords: 'token bearer claims decode', component: JwtTool },
  { id: 'stack-trace', name: 'Stack Trace', desc: 'Paste a .NET stack trace, read it with files and line numbers separated.', group: 'Security & Debug', keywords: 'exception parse analyzer', component: StackTrace },
  { id: 'conn-string', name: 'Connection String', desc: 'SQL Server, PostgreSQL, MySQL, SQLite, Redis, and MongoDB.', group: 'Security & Debug', keywords: 'database sqlserver postgres connection', component: ConnString },
  { id: 'enum-flags', name: 'Enum Flags', desc: 'Decompose a [Flags] value into its bits, with common .NET presets.', group: 'Security & Debug', keywords: 'bitwise flags bitmask binary', component: EnumFlags },
  { id: 'regex', name: 'Regex Tester', desc: 'Live regex matching with groups and flags.', group: 'Security & Debug', keywords: 'regular expression match pattern test', component: RegexTool },

  // Reference
  { id: 'http-codes', name: 'HTTP Status Codes', desc: 'Searchable status code reference.', group: 'Reference', keywords: '404 500 200 status', component: HttpCodes },
  { id: 'dotnet-versions', name: '.NET Versions', desc: 'Versions, TFMs, C# pairings, and support windows at a glance.', group: 'Reference', keywords: 'tfm lts sts support eol net8 net9 net10 net11', component: DotnetVersions },
];

export const GROUPS = [...new Set(TOOLS.map(t => t.group))];
