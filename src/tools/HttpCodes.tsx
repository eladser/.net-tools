import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const CODES: Array<[number, string, string]> = [
  [100, 'Continue', 'Keep sending the request body'],
  [101, 'Switching Protocols', 'Upgrading, e.g. to WebSocket'],
  [200, 'OK', 'It worked'],
  [201, 'Created', 'Resource created — return a Location header'],
  [202, 'Accepted', 'Queued for async processing'],
  [204, 'No Content', 'Success with an empty body — typical for DELETE'],
  [206, 'Partial Content', 'Range request response'],
  [301, 'Moved Permanently', 'Update your links; method may change to GET'],
  [302, 'Found', 'Temporary redirect, method may change to GET'],
  [304, 'Not Modified', 'Cached copy is still valid'],
  [307, 'Temporary Redirect', 'Like 302 but the method is preserved'],
  [308, 'Permanent Redirect', 'Like 301 but the method is preserved'],
  [400, 'Bad Request', 'Malformed syntax or invalid payload'],
  [401, 'Unauthorized', 'Not authenticated — really means "unauthenticated"'],
  [403, 'Forbidden', 'Authenticated but not allowed'],
  [404, 'Not Found', 'No such resource'],
  [405, 'Method Not Allowed', 'Wrong verb — return an Allow header'],
  [408, 'Request Timeout', 'Client took too long to send'],
  [409, 'Conflict', 'State conflict, e.g. concurrent edit or duplicate'],
  [410, 'Gone', 'Deliberately removed, permanently'],
  [412, 'Precondition Failed', 'If-Match / ETag check failed'],
  [413, 'Payload Too Large', 'Body exceeds server limits'],
  [415, 'Unsupported Media Type', 'Wrong Content-Type'],
  [418, "I'm a teapot", 'RFC 2324. Yes, really'],
  [422, 'Unprocessable Entity', 'Valid syntax, invalid semantics — validation errors'],
  [428, 'Precondition Required', 'Server demands a conditional request'],
  [429, 'Too Many Requests', 'Rate limited — return Retry-After'],
  [500, 'Internal Server Error', 'Unhandled exception territory'],
  [501, 'Not Implemented', 'Verb not supported by the server'],
  [502, 'Bad Gateway', 'Upstream returned garbage'],
  [503, 'Service Unavailable', 'Overloaded or down for maintenance'],
  [504, 'Gateway Timeout', 'Upstream took too long'],
];

const TONE: Record<number, string> = {
  1: 'text-muted', 2: 'text-ok', 3: 'text-accent', 4: 'text-warn', 5: 'text-bad',
};

export function HttpCodes() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CODES;
    return CODES.filter(([code, name, desc]) =>
      String(code).startsWith(q) || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint w-3.5 h-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="404, conflict, retry…"
          className="field-input pl-8"
        />
      </div>
      <div className="divide-y divide-border/60 border-y border-border">
        {filtered.map(([code, name, desc]) => (
          <div key={code} className="flex items-baseline gap-4 py-2 px-1">
            <span className={`font-mono text-sm font-semibold w-10 shrink-0 ${TONE[Math.floor(code / 100)]}`}>
              {code}
            </span>
            <span className="text-sm text-fg w-44 shrink-0">{name}</span>
            <span className="text-sm text-muted hidden sm:block">{desc}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 px-1 font-mono text-xs text-faint">No matching status code</p>
        )}
      </div>
    </div>
  );
}
