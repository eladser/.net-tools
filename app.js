// .NET Tools - Clean implementation

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// Toast notification
function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

// Copy to clipboard
function copyOutput(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.textContent || el.innerText;
    navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => toast('Failed to copy'));
}

// JSON Formatter
function formatJson() {
    const input = document.getElementById('jsonInput')?.value;
    const output = document.getElementById('jsonOutput');
    const error = document.getElementById('jsonError');
    if (!input || !output) return;

    try {
        const parsed = JSON.parse(input);
        output.textContent = JSON.stringify(parsed, null, 2);
        if (error) error.textContent = '';
    } catch (e) {
        output.textContent = '';
        if (error) error.textContent = e.message;
    }
}

function minifyJson() {
    const input = document.getElementById('jsonInput')?.value;
    const output = document.getElementById('jsonOutput');
    const error = document.getElementById('jsonError');
    if (!input || !output) return;

    try {
        const parsed = JSON.parse(input);
        output.textContent = JSON.stringify(parsed);
        if (error) error.textContent = '';
    } catch (e) {
        output.textContent = '';
        if (error) error.textContent = e.message;
    }
}

// JSON to C#
function jsonToCsharp() {
    const input = document.getElementById('jsonToCsharpInput')?.value;
    const output = document.getElementById('csharpOutput');
    const nullable = document.getElementById('useNullable')?.checked;
    const records = document.getElementById('useRecords')?.checked;
    const rootName = document.getElementById('rootClassName')?.value || 'Root';

    if (!input || !output) return;

    try {
        const parsed = JSON.parse(input);
        const classes = [];
        generateClass(parsed, rootName, classes, nullable, records);
        output.textContent = classes.join('\n\n');
    } catch (e) {
        output.textContent = '// Error: ' + e.message;
    }
}

function generateClass(obj, name, classes, nullable, records) {
    const keyword = records ? 'record' : 'class';
    let props = [];

    for (const [key, value] of Object.entries(obj)) {
        const propName = key.charAt(0).toUpperCase() + key.slice(1);
        let type = getCsharpType(value, propName, classes, nullable, records);
        if (nullable && type !== 'string' && !type.endsWith('?') && !type.endsWith('[]')) {
            type += '?';
        }
        props.push(`    public ${type} ${propName} { get; set; }`);
    }

    classes.push(`public ${keyword} ${name}\n{\n${props.join('\n')}\n}`);
}

function getCsharpType(value, propName, classes, nullable, records) {
    if (value === null) return 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'object[]';
        return getCsharpType(value[0], propName, classes, nullable, records) + '[]';
    }
    if (typeof value === 'object') {
        generateClass(value, propName, classes, nullable, records);
        return propName;
    }
    return 'object';
}

// GUID Generator
function generateGuids() {
    const count = parseInt(document.getElementById('guidCount')?.value) || 1;
    const format = document.getElementById('guidFormat')?.value || 'standard';
    const output = document.getElementById('guidOutput');
    if (!output) return;

    const guids = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        switch (format) {
            case 'nohyphens': guid = guid.replace(/-/g, ''); break;
            case 'braces': guid = `{${guid}}`; break;
            case 'csharp': guid = `new Guid("${guid}")`; break;
        }
        guids.push(guid);
    }
    output.textContent = guids.join('\n');
}

// Password Generator
function generatePassword() {
    const length = parseInt(document.getElementById('pwdLength')?.value) || 16;
    const upper = document.getElementById('pwdUpper')?.checked;
    const lower = document.getElementById('pwdLower')?.checked;
    const num = document.getElementById('pwdNum')?.checked;
    const sym = document.getElementById('pwdSym')?.checked;
    const output = document.getElementById('pwdOutput');
    const meter = document.getElementById('pwdStrength');

    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (num) chars += '0123456789';
    if (sym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
        if (output) output.textContent = 'Select at least one option';
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (output) output.textContent = password;

    // Strength meter
    if (meter) {
        const entropy = length * Math.log2(chars.length);
        let strength = 'weak';
        if (entropy > 60) strength = 'fair';
        if (entropy > 80) strength = 'good';
        if (entropy > 100) strength = 'strong';
        meter.innerHTML = `<div class="meter-fill ${strength}"></div>`;
    }
}

// Hash Generator
async function generateHashes() {
    const input = document.getElementById('hashInput')?.value;
    const output = document.getElementById('hashOutput');
    if (!input || !output) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = [
        { name: 'MD5', warning: true },
        { name: 'SHA-1', warning: true },
        { name: 'SHA-256', warning: false },
        { name: 'SHA-512', warning: false }
    ];

    let html = '';

    // MD5 (simple implementation for demo)
    html += `<div class="hash-item warning"><span class="type">MD5 (deprecated)</span><span class="value" onclick="navigator.clipboard.writeText(this.textContent);toast('Copied!')">${md5(input)}</span></div>`;

    for (const algo of algorithms.slice(1)) {
        try {
            const hashBuffer = await crypto.subtle.digest(algo.name, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            const warning = algo.warning ? ' warning' : '';
            const label = algo.warning ? ` (deprecated)` : '';
            html += `<div class="hash-item${warning}"><span class="type">${algo.name}${label}</span><span class="value" onclick="navigator.clipboard.writeText(this.textContent);toast('Copied!')">${hashHex}</span></div>`;
        } catch (e) {}
    }

    output.innerHTML = html;
}

// Simple MD5 for display purposes
function md5(string) {
    function rotateLeft(x, n) { return (x << n) | (x >>> (32 - n)); }
    function addUnsigned(x, y) { return (x + y) >>> 0; }
    function utf8Encode(s) { return unescape(encodeURIComponent(s)); }

    string = utf8Encode(string);
    const words = [];
    for (let i = 0; i < string.length * 8; i += 8) {
        words[i >> 5] |= (string.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    words[(string.length * 8) >> 5] |= 0x80 << ((string.length * 8) % 32);
    words[(((string.length * 8 + 64) >>> 9) << 4) + 14] = string.length * 8;

    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    const S = [7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];
    const K = [];
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);

    for (let i = 0; i < words.length; i += 16) {
        let [aa, bb, cc, dd] = [a, b, c, d];
        for (let j = 0; j < 64; j++) {
            let f, g;
            if (j < 16) { f = (b & c) | (~b & d); g = j; }
            else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
            else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
            else { f = c ^ (b | ~d); g = (7 * j) % 16; }
            const temp = d;
            d = c; c = b;
            b = addUnsigned(b, rotateLeft(addUnsigned(a, addUnsigned(f, addUnsigned(K[j], words[i + g] || 0))), S[(j >> 4) * 4 + (j % 4)]));
            a = temp;
        }
        a = addUnsigned(a, aa); b = addUnsigned(b, bb); c = addUnsigned(c, cc); d = addUnsigned(d, dd);
    }

    const toHex = n => Array.from({length: 4}, (_, i) => ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('');
    return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

// Cron Builder
function updateCron() {
    const min = document.getElementById('cronMin')?.value || '*';
    const hour = document.getElementById('cronHour')?.value || '*';
    const day = document.getElementById('cronDay')?.value || '*';
    const mon = document.getElementById('cronMon')?.value || '*';
    const wkd = document.getElementById('cronWkd')?.value || '*';
    const expr = document.getElementById('cronExpr');
    const desc = document.getElementById('cronDesc');

    if (expr) expr.textContent = `${min} ${hour} ${day} ${mon} ${wkd}`;

    if (desc) {
        let text = 'Runs ';
        if (min === '*') text += 'every minute';
        else if (min === '0') text += 'at minute 0';
        else text += `at minute ${min}`;

        if (hour !== '*') text += ` of hour ${hour}`;
        if (day !== '*') text += ` on day ${day}`;
        if (mon !== '*') text += ` in month ${mon}`;
        if (wkd !== '*') text += ` on weekday ${wkd}`;

        desc.textContent = text;
    }
}

['cronMin', 'cronHour', 'cronDay', 'cronMon', 'cronWkd'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateCron);
});
updateCron();

// Base64
function encodeB64() {
    const input = document.getElementById('b64Input')?.value || '';
    const output = document.getElementById('b64Output');
    if (output) output.textContent = btoa(unescape(encodeURIComponent(input)));
}

function decodeB64() {
    const input = document.getElementById('b64Input')?.value || '';
    const output = document.getElementById('b64Output');
    try {
        if (output) output.textContent = decodeURIComponent(escape(atob(input)));
    } catch (e) {
        if (output) output.textContent = 'Invalid Base64';
    }
}

// Timestamp
function tsNow() {
    const input = document.getElementById('tsInput');
    if (input) input.value = Math.floor(Date.now() / 1000);
    convertTs();
}

function convertTs() {
    const input = document.getElementById('tsInput')?.value;
    const output = document.getElementById('tsOutput');
    if (!input || !output) return;

    let date;
    if (/^\d+$/.test(input)) {
        const ts = parseInt(input);
        date = new Date(ts > 9999999999 ? ts : ts * 1000);
    } else {
        date = new Date(input);
    }

    if (isNaN(date.getTime())) {
        output.innerHTML = '<div class="ts-item"><span class="value">Invalid date</span></div>';
        return;
    }

    const unix = Math.floor(date.getTime() / 1000);
    output.innerHTML = `
        <div class="ts-item"><span class="label">Unix</span><span class="value">${unix}</span></div>
        <div class="ts-item"><span class="label">ISO 8601</span><span class="value">${date.toISOString()}</span></div>
        <div class="ts-item"><span class="label">Local</span><span class="value">${date.toLocaleString()}</span></div>
        <div class="ts-item"><span class="label">C# DateTime</span><span class="value">new DateTime(${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()})</span></div>
    `;
}

// String Escape
function escapeStr() {
    const input = document.getElementById('escInput')?.value || '';
    const format = document.getElementById('escFormat')?.value || 'csharp';
    const output = document.getElementById('escOutput');
    if (!output) return;

    let result = input;
    switch (format) {
        case 'csharp':
            result = input.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
            result = `"${result}"`;
            break;
        case 'json':
            result = JSON.stringify(input);
            break;
        case 'sql':
            result = input.replace(/'/g, "''");
            result = `'${result}'`;
            break;
    }
    output.textContent = result;
}

function unescapeStr() {
    const input = document.getElementById('escInput')?.value || '';
    const format = document.getElementById('escFormat')?.value || 'csharp';
    const output = document.getElementById('escOutput');
    if (!output) return;

    let result = input;
    try {
        switch (format) {
            case 'csharp':
            case 'json':
                result = JSON.parse(input);
                break;
            case 'sql':
                result = input.replace(/^'|'$/g, '').replace(/''/g, "'");
                break;
        }
    } catch (e) {
        result = 'Invalid escaped string';
    }
    output.textContent = result;
}

// URL Encode
function encodeUrl() {
    const input = document.getElementById('urlInput')?.value || '';
    const output = document.getElementById('urlOutput');
    if (output) output.textContent = encodeURIComponent(input);
}

function decodeUrl() {
    const input = document.getElementById('urlInput')?.value || '';
    const output = document.getElementById('urlOutput');
    try {
        if (output) output.textContent = decodeURIComponent(input);
    } catch (e) {
        if (output) output.textContent = 'Invalid URL encoding';
    }
}

// JWT Decoder
function decodeJwt() {
    const input = document.getElementById('jwtInput')?.value || '';
    const output = document.getElementById('jwtOutput');
    if (!output) return;

    const parts = input.split('.');
    if (parts.length !== 3) {
        output.innerHTML = '<div class="text-muted">Invalid JWT format</div>';
        return;
    }

    try {
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        output.innerHTML = `
            <div class="jwt-part">
                <div class="title">Header</div>
                <pre>${JSON.stringify(header, null, 2)}</pre>
            </div>
            <div class="jwt-part">
                <div class="title">Payload</div>
                <pre>${JSON.stringify(payload, null, 2)}</pre>
            </div>
            <div class="jwt-part">
                <div class="title">Signature</div>
                <pre>${parts[2]}</pre>
            </div>
        `;
    } catch (e) {
        output.innerHTML = '<div class="text-muted">Failed to decode JWT</div>';
    }
}

// Stack Trace Analyzer
function parseStack() {
    const input = document.getElementById('stackInput')?.value || '';
    const output = document.getElementById('stackOutput');
    if (!output) return;

    const lines = input.split('\n').filter(l => l.trim());
    if (lines.length === 0) {
        output.innerHTML = '<div class="text-muted">Paste a stack trace to analyze</div>';
        return;
    }

    let html = '';

    // First line is usually the exception
    if (lines[0] && !lines[0].trim().startsWith('at ')) {
        html += `<div class="stack-item error-line">${escapeHtml(lines[0])}</div>`;
    }

    // Parse stack frames
    const frameRegex = /at (.+?)(?:\((.*?)\))?(?:\s+in\s+(.+?):line (\d+))?$/;
    for (const line of lines.slice(1)) {
        const match = line.match(frameRegex);
        if (match) {
            const [, method, params, file, lineNum] = match;
            html += `<div class="stack-item">
                <span class="stack-method">${escapeHtml(method || '')}</span>
                ${params ? `<span class="text-muted">(${escapeHtml(params)})</span>` : ''}
                ${file ? `<br><span class="stack-file">${escapeHtml(file)}</span>` : ''}
                ${lineNum ? `<span class="stack-line">:${lineNum}</span>` : ''}
            </div>`;
        } else if (line.trim()) {
            html += `<div class="stack-item">${escapeHtml(line)}</div>`;
        }
    }

    output.innerHTML = html || '<div class="text-muted">No stack frames found</div>';
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Connection String Builder
function updateDbFields() {
    const dbType = document.getElementById('dbType')?.value;
    const serverInput = document.getElementById('dbServer');
    const userInput = document.getElementById('dbUser');
    const passInput = document.getElementById('dbPass');

    if (dbType === 'sqlite') {
        if (serverInput) serverInput.placeholder = 'Path to .db file';
        if (userInput) userInput.style.display = 'none';
        if (passInput) passInput.style.display = 'none';
    } else {
        if (serverInput) serverInput.placeholder = 'Server';
        if (userInput) userInput.style.display = '';
        if (passInput) passInput.style.display = '';
    }
}

function buildConnStr() {
    const dbType = document.getElementById('dbType')?.value;
    const server = document.getElementById('dbServer')?.value || 'localhost';
    const database = document.getElementById('dbName')?.value || 'MyDb';
    const user = document.getElementById('dbUser')?.value || 'sa';
    const pass = document.getElementById('dbPass')?.value || '';
    const integrated = document.getElementById('dbIntegrated')?.checked;
    const trust = document.getElementById('dbTrust')?.checked;
    const output = document.getElementById('connOutput');

    if (!output) return;

    let connStr = '';

    switch (dbType) {
        case 'sqlserver':
            connStr = `Server=${server};Database=${database};`;
            if (integrated) connStr += 'Integrated Security=True;';
            else connStr += `User Id=${user};Password=${pass};`;
            if (trust) connStr += 'TrustServerCertificate=True;';
            break;
        case 'mysql':
            connStr = `Server=${server};Database=${database};Uid=${user};Pwd=${pass};`;
            break;
        case 'postgres':
            connStr = `Host=${server};Database=${database};Username=${user};Password=${pass};`;
            break;
        case 'sqlite':
            connStr = `Data Source=${server};`;
            break;
    }

    output.textContent = connStr;
}

// Regex Tester
function testRegex() {
    const pattern = document.getElementById('regexPat')?.value || '';
    const input = document.getElementById('regexInput')?.value || '';
    const ignoreCase = document.getElementById('regexI')?.checked;
    const global = document.getElementById('regexG')?.checked;
    const multiline = document.getElementById('regexM')?.checked;
    const output = document.getElementById('regexOutput');

    if (!output) return;

    if (!pattern) {
        output.innerHTML = '<div class="text-muted">Enter a pattern to test</div>';
        return;
    }

    try {
        let flags = '';
        if (ignoreCase) flags += 'i';
        if (global) flags += 'g';
        if (multiline) flags += 'm';

        const regex = new RegExp(pattern, flags);
        const matches = input.match(regex);

        if (matches && matches.length > 0) {
            output.innerHTML = matches.map(m => `<span class="match">${escapeHtml(m)}</span>`).join(' ');
        } else {
            output.innerHTML = '<div class="no-match">No matches found</div>';
        }
    } catch (e) {
        output.innerHTML = `<div class="error">${escapeHtml(e.message)}</div>`;
    }
}

document.getElementById('regexPat')?.addEventListener('input', testRegex);
document.getElementById('regexInput')?.addEventListener('input', testRegex);
document.getElementById('regexI')?.addEventListener('change', testRegex);
document.getElementById('regexG')?.addEventListener('change', testRegex);
document.getElementById('regexM')?.addEventListener('change', testRegex);

// HTTP Status Codes
const httpCodes = [
    {code: 100, desc: 'Continue'}, {code: 101, desc: 'Switching Protocols'},
    {code: 200, desc: 'OK'}, {code: 201, desc: 'Created'}, {code: 202, desc: 'Accepted'},
    {code: 204, desc: 'No Content'}, {code: 206, desc: 'Partial Content'},
    {code: 301, desc: 'Moved Permanently'}, {code: 302, desc: 'Found'}, {code: 304, desc: 'Not Modified'},
    {code: 307, desc: 'Temporary Redirect'}, {code: 308, desc: 'Permanent Redirect'},
    {code: 400, desc: 'Bad Request'}, {code: 401, desc: 'Unauthorized'}, {code: 403, desc: 'Forbidden'},
    {code: 404, desc: 'Not Found'}, {code: 405, desc: 'Method Not Allowed'}, {code: 408, desc: 'Request Timeout'},
    {code: 409, desc: 'Conflict'}, {code: 410, desc: 'Gone'}, {code: 413, desc: 'Payload Too Large'},
    {code: 415, desc: 'Unsupported Media Type'}, {code: 418, desc: "I'm a teapot"},
    {code: 422, desc: 'Unprocessable Entity'}, {code: 429, desc: 'Too Many Requests'},
    {code: 500, desc: 'Internal Server Error'}, {code: 501, desc: 'Not Implemented'},
    {code: 502, desc: 'Bad Gateway'}, {code: 503, desc: 'Service Unavailable'}, {code: 504, desc: 'Gateway Timeout'}
];

function renderHttpCodes(filter = '') {
    const container = document.getElementById('httpList');
    if (!container) return;

    const filtered = httpCodes.filter(c =>
        c.code.toString().includes(filter) ||
        c.desc.toLowerCase().includes(filter.toLowerCase())
    );

    container.innerHTML = filtered.map(c => {
        const category = `c${Math.floor(c.code / 100)}xx`;
        return `<div class="http-item"><span class="http-code ${category}">${c.code}</span><span class="http-desc">${c.desc}</span></div>`;
    }).join('');
}

document.getElementById('httpSearch')?.addEventListener('input', (e) => renderHttpCodes(e.target.value));
renderHttpCodes();

// Number Base Converter
function convertBase(source) {
    const decInput = document.getElementById('baseDec');
    const hexInput = document.getElementById('baseHex');
    const binInput = document.getElementById('baseBin');
    const octInput = document.getElementById('baseOct');
    const error = document.getElementById('baseError');

    if (!decInput || !hexInput || !binInput || !octInput) return;

    let value;
    try {
        switch (source) {
            case 'dec':
                value = parseInt(decInput.value, 10);
                break;
            case 'hex':
                value = parseInt(hexInput.value, 16);
                break;
            case 'bin':
                value = parseInt(binInput.value, 2);
                break;
            case 'oct':
                value = parseInt(octInput.value, 8);
                break;
        }

        if (isNaN(value) || value < 0) {
            if (error) error.textContent = 'Invalid number';
            return;
        }

        if (error) error.textContent = '';

        if (source !== 'dec') decInput.value = value.toString(10);
        if (source !== 'hex') hexInput.value = value.toString(16).toUpperCase();
        if (source !== 'bin') binInput.value = value.toString(2);
        if (source !== 'oct') octInput.value = value.toString(8);
    } catch (e) {
        if (error) error.textContent = 'Invalid number';
    }
}

document.getElementById('baseDec')?.addEventListener('input', () => convertBase('dec'));
document.getElementById('baseHex')?.addEventListener('input', () => convertBase('hex'));
document.getElementById('baseBin')?.addEventListener('input', () => convertBase('bin'));
document.getElementById('baseOct')?.addEventListener('input', () => convertBase('oct'));

// File Size Converter
function convertSize(source) {
    const inputs = {
        bytes: document.getElementById('sizeBytes'),
        kb: document.getElementById('sizeKB'),
        mb: document.getElementById('sizeMB'),
        gb: document.getElementById('sizeGB'),
        tb: document.getElementById('sizeTB'),
        pb: document.getElementById('sizePB'),
        eb: document.getElementById('sizeEB')
    };

    if (!inputs.bytes) return;

    const binary = document.querySelector('input[name="sizeMode"]:checked')?.value === 'binary';
    const base = binary ? 1024 : 1000;

    const multipliers = {
        bytes: 1,
        kb: base,
        mb: Math.pow(base, 2),
        gb: Math.pow(base, 3),
        tb: Math.pow(base, 4),
        pb: Math.pow(base, 5),
        eb: Math.pow(base, 6)
    };

    let bytes;
    try {
        const inputVal = parseFloat(inputs[source]?.value);
        if (isNaN(inputVal) || inputVal < 0) return;
        bytes = inputVal * multipliers[source];

        const formatNum = (n) => {
            if (n === 0) return '0';
            if (n >= 1) return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
            // For small numbers, show up to 10 decimal places without scientific notation
            return n.toFixed(10).replace(/\.?0+$/, '');
        };

        for (const [unit, input] of Object.entries(inputs)) {
            if (unit !== source && input) {
                input.value = formatNum(bytes / multipliers[unit]);
            }
        }
    } catch (e) {}
}

['sizeBytes', 'sizeKB', 'sizeMB', 'sizeGB', 'sizeTB', 'sizePB', 'sizeEB'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => convertSize(id.replace('size', '').toLowerCase()));
});
document.querySelectorAll('input[name="sizeMode"]').forEach(r => {
    r.addEventListener('change', () => convertSize('bytes'));
});

// TimeSpan Calculator
function calculateTimespan() {
    const days = parseInt(document.getElementById('tsDays')?.value) || 0;
    const hours = parseInt(document.getElementById('tsHours')?.value) || 0;
    const minutes = parseInt(document.getElementById('tsMinutes')?.value) || 0;
    const seconds = parseInt(document.getElementById('tsSeconds')?.value) || 0;
    const ms = parseInt(document.getElementById('tsMs')?.value) || 0;
    const output = document.getElementById('timespanOutput');

    if (!output) return;

    const totalMs = ((((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000 + ms);
    const ticks = BigInt(totalMs) * 10000n;

    const totalSeconds = totalMs / 1000;
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalMinutes / 60;

    // Format as TimeSpan string
    const pad = (n, d = 2) => n.toString().padStart(d, '0');
    const tsString = `${days}.${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}0000`;

    output.innerHTML = `
        <div class="ts-item"><span class="label">Ticks</span><span class="value">${ticks.toString()}</span></div>
        <div class="ts-item"><span class="label">Total ms</span><span class="value">${totalMs.toLocaleString()}</span></div>
        <div class="ts-item"><span class="label">Total seconds</span><span class="value">${totalSeconds.toLocaleString()}</span></div>
        <div class="ts-item"><span class="label">Total hours</span><span class="value">${totalHours.toFixed(4)}</span></div>
        <div class="ts-item"><span class="label">TimeSpan</span><span class="value">${tsString}</span></div>
        <div class="ts-item"><span class="label">C#</span><span class="value">new TimeSpan(${days}, ${hours}, ${minutes}, ${seconds}, ${ms})</span></div>
    `;
}

['tsDays', 'tsHours', 'tsMinutes', 'tsSeconds', 'tsMs'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateTimespan);
});
calculateTimespan();

// Enum Flags Calculator
const flagPresets = {
    file: [
        { name: 'ReadOnly', value: 1 },
        { name: 'Hidden', value: 2 },
        { name: 'System', value: 4 },
        { name: 'Directory', value: 16 },
        { name: 'Archive', value: 32 },
        { name: 'Device', value: 64 },
        { name: 'Normal', value: 128 },
        { name: 'Temporary', value: 256 },
        { name: 'SparseFile', value: 512 },
        { name: 'ReparsePoint', value: 1024 },
        { name: 'Compressed', value: 2048 },
        { name: 'Encrypted', value: 16384 }
    ],
    binding: [
        { name: 'Default', value: 0 },
        { name: 'IgnoreCase', value: 1 },
        { name: 'DeclaredOnly', value: 2 },
        { name: 'Instance', value: 4 },
        { name: 'Static', value: 8 },
        { name: 'Public', value: 16 },
        { name: 'NonPublic', value: 32 },
        { name: 'FlattenHierarchy', value: 64 },
        { name: 'InvokeMethod', value: 256 },
        { name: 'CreateInstance', value: 512 },
        { name: 'GetField', value: 1024 },
        { name: 'SetField', value: 2048 },
        { name: 'GetProperty', value: 4096 },
        { name: 'SetProperty', value: 8192 }
    ],
    custom: [
        { name: 'None', value: 0 },
        { name: 'Flag1', value: 1 },
        { name: 'Flag2', value: 2 },
        { name: 'Flag3', value: 4 },
        { name: 'Flag4', value: 8 },
        { name: 'Flag5', value: 16 },
        { name: 'Flag6', value: 32 },
        { name: 'Flag7', value: 64 },
        { name: 'Flag8', value: 128 }
    ]
};

let currentPreset = 'file';

function setFlagsPreset(preset) {
    currentPreset = preset;
    calculateFlags();
}

function calculateFlags() {
    const input = document.getElementById('flagsInput')?.value || '0';
    const output = document.getElementById('flagsOutput');
    if (!output) return;

    const value = parseInt(input, 10);
    if (isNaN(value) || value < 0) {
        output.innerHTML = '<div class="text-muted">Enter a valid number</div>';
        return;
    }

    const flags = flagPresets[currentPreset] || flagPresets.custom;
    let html = '';

    for (const flag of flags) {
        const isSet = flag.value === 0 ? value === 0 : (value & flag.value) === flag.value;
        const activeClass = isSet ? ' active' : '';
        html += `<div class="flag-item${activeClass}">
            <span class="flag-bit">${flag.value}</span>
            <span class="flag-name">${flag.name}</span>
            <span class="flag-value">0x${flag.value.toString(16).toUpperCase()}</span>
        </div>`;
    }

    // Show binary representation
    const binary = value.toString(2).padStart(16, '0');
    html += `<div class="ts-item" style="margin-top: 12px">
        <span class="label">Binary</span>
        <span class="value mono">${binary}</span>
    </div>`;

    output.innerHTML = html;
}

document.getElementById('flagsInput')?.addEventListener('input', calculateFlags);
calculateFlags();
