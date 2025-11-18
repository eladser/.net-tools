// =================== NEW DEVELOPER TOOLS IMPLEMENTATION ===================
// High-value tools for .NET developers

// =================== JSON VALIDATOR & FORMATTER ===================

function validateAndFormatJson() {
    const input = document.getElementById('jsonValidatorInput')?.value || '';
    const output = document.getElementById('jsonValidatorOutput');
    const validation = document.getElementById('jsonValidationResult');

    if (!output || !validation) return;

    if (!input.trim()) {
        validation.innerHTML = '<div class="validation-result error">Please enter JSON to validate</div>';
        output.textContent = '';
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        output.textContent = formatted;

        // Highlight syntax if Prism is available
        if (window.Prism) {
            output.innerHTML = `<code class="language-json">${escapeHtml(formatted)}</code>`;
            window.Prism.highlightElement(output.querySelector('code'));
        }

        const stats = getJsonStats(parsed);
        validation.innerHTML = `
            <div class="validation-result success">
                ✓ Valid JSON
                <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.9;">
                    ${stats.objects} objects, ${stats.arrays} arrays, ${stats.properties} properties, ${stats.depth} max depth
                </div>
            </div>
        `;
    } catch (error) {
        const errorInfo = getJsonError(input, error);
        validation.innerHTML = `
            <div class="validation-result error">
                ✗ Invalid JSON at line ${errorInfo.line}, column ${errorInfo.column}
                <div style="margin-top: 0.5rem; font-size: 0.9rem;">
                    ${error.message}
                </div>
            </div>
        `;
        output.textContent = '';
    }
}

function minifyJson() {
    const input = document.getElementById('jsonValidatorInput')?.value || '';
    const output = document.getElementById('jsonValidatorOutput');

    if (!output) return;

    try {
        const parsed = JSON.parse(input);
        output.textContent = JSON.stringify(parsed);
    } catch (error) {
        output.textContent = 'Invalid JSON';
    }
}

function getJsonStats(obj, depth = 0) {
    let stats = { objects: 0, arrays: 0, properties: 0, depth: depth };

    if (Array.isArray(obj)) {
        stats.arrays++;
        obj.forEach(item => {
            const childStats = getJsonStats(item, depth + 1);
            stats.objects += childStats.objects;
            stats.arrays += childStats.arrays;
            stats.properties += childStats.properties;
            stats.depth = Math.max(stats.depth, childStats.depth);
        });
    } else if (typeof obj === 'object' && obj !== null) {
        stats.objects++;
        const keys = Object.keys(obj);
        stats.properties += keys.length;
        keys.forEach(key => {
            const childStats = getJsonStats(obj[key], depth + 1);
            stats.objects += childStats.objects;
            stats.arrays += childStats.arrays;
            stats.properties += childStats.properties;
            stats.depth = Math.max(stats.depth, childStats.depth);
        });
    }

    return stats;
}

function getJsonError(json, error) {
    const match = error.message.match(/position (\d+)/);
    if (match) {
        const position = parseInt(match[1]);
        const lines = json.substring(0, position).split('\n');
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    }
    return { line: 1, column: 1 };
}

// =================== EXCEPTION STACK TRACE ANALYZER ===================

function analyzeStackTrace() {
    const input = document.getElementById('stackTraceInput')?.value || '';
    const output = document.getElementById('stackTraceOutput');

    if (!output) return;

    if (!input.trim()) {
        output.innerHTML = '<div class="validation-result error">Please enter a stack trace to analyze</div>';
        return;
    }

    const lines = input.split('\n');
    const analysis = {
        exceptionType: '',
        message: '',
        frames: [],
        innerException: null
    };

    // Parse exception type and message
    const firstLine = lines[0];
    const exceptionMatch = firstLine.match(/^(.+?Exception): (.+)$/);
    if (exceptionMatch) {
        analysis.exceptionType = exceptionMatch[1];
        analysis.message = exceptionMatch[2];
    } else {
        analysis.message = firstLine;
    }

    // Parse stack frames
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        // Match "at Namespace.Class.Method(...) in file:line lineNumber"
        const frameMatch = line.match(/at (.+?) in (.+):line (\d+)/);
        if (frameMatch) {
            analysis.frames.push({
                method: frameMatch[1],
                file: frameMatch[2],
                line: frameMatch[3]
            });
        } else {
            // Match "at Namespace.Class.Method(...)"
            const simpleFrameMatch = line.match(/at (.+)/);
            if (simpleFrameMatch) {
                analysis.frames.push({
                    method: simpleFrameMatch[1],
                    file: null,
                    line: null
                });
            }
        }
    }

    // Render analysis
    output.innerHTML = `
        <div class="stack-trace-analysis">
            <div class="exception-header">
                <div class="exception-type">${escapeHtml(analysis.exceptionType || 'Exception')}</div>
                <div class="exception-message">${escapeHtml(analysis.message)}</div>
            </div>

            ${analysis.frames.length > 0 ? `
                <div class="stack-frames">
                    <h4>Stack Trace:</h4>
                    ${analysis.frames.map((frame, index) => `
                        <div class="stack-frame ${index === 0 ? 'error-location' : ''}">
                            <div class="frame-header">
                                <span class="frame-number">#${index}</span>
                                <span class="frame-method">${escapeHtml(frame.method)}</span>
                            </div>
                            ${frame.file ? `
                                <div class="frame-location">
                                    <span class="frame-file">${escapeHtml(frame.file)}</span>
                                    <span class="frame-line">:${frame.line}</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="stack-trace-tips">
                <h4>Quick Tips:</h4>
                <ul>
                    <li>The first frame (${analysis.frames[0]?.method || 'unknown'}) is where the exception was thrown</li>
                    <li>${analysis.frames.filter(f => f.file).length} of ${analysis.frames.length} frames have source location</li>
                    <li>Check for null references, array bounds, and type mismatches</li>
                </ul>
            </div>
        </div>
    `;
}

// =================== STRING ESCAPING TOOL ===================

function escapeString() {
    const input = document.getElementById('escapeInput')?.value || '';
    const format = document.getElementById('escapeFormat')?.value || 'csharp';
    const output = document.getElementById('escapeOutput');

    if (!output) return;

    if (!input) {
        output.textContent = '';
        return;
    }

    let result = '';

    switch (format) {
        case 'csharp':
            result = input
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            result = `"${result}"`;
            break;

        case 'json':
            result = JSON.stringify(input);
            break;

        case 'sql':
            result = input.replace(/'/g, "''");
            result = `'${result}'`;
            break;

        case 'regex':
            result = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            break;

        case 'url':
            result = encodeURIComponent(input);
            break;

        case 'html':
            result = input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            break;

        case 'xml':
            result = input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
            break;
    }

    output.textContent = result;
}

function unescapeString() {
    const input = document.getElementById('escapeInput')?.value || '';
    const format = document.getElementById('escapeFormat')?.value || 'csharp';
    const output = document.getElementById('escapeOutput');

    if (!output) return;

    if (!input) {
        output.textContent = '';
        return;
    }

    let result = input;

    try {
        switch (format) {
            case 'csharp':
            case 'json':
                // Remove surrounding quotes if present
                if ((result.startsWith('"') && result.endsWith('"')) ||
                    (result.startsWith("'") && result.endsWith("'"))) {
                    result = result.slice(1, -1);
                }
                result = result
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '\r')
                    .replace(/\\t/g, '\t')
                    .replace(/\\"/g, '"')
                    .replace(/\\'/g, "'")
                    .replace(/\\\\/g, '\\');
                break;

            case 'sql':
                if (result.startsWith("'") && result.endsWith("'")) {
                    result = result.slice(1, -1);
                }
                result = result.replace(/''/g, "'");
                break;

            case 'url':
                result = decodeURIComponent(result);
                break;

            case 'html':
            case 'xml':
                result = result
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&apos;/g, "'")
                    .replace(/&amp;/g, '&');
                break;
        }

        output.textContent = result;
    } catch (error) {
        output.textContent = 'Error unescaping: ' + error.message;
    }
}

// =================== CRON EXPRESSION BUILDER ===================

function buildCronExpression() {
    const minute = document.getElementById('cronMinute')?.value || '*';
    const hour = document.getElementById('cronHour')?.value || '*';
    const dayOfMonth = document.getElementById('cronDayOfMonth')?.value || '*';
    const month = document.getElementById('cronMonth')?.value || '*';
    const dayOfWeek = document.getElementById('cronDayOfWeek')?.value || '*';

    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

    const output = document.getElementById('cronExpressionOutput');
    const description = document.getElementById('cronDescription');

    if (output) output.value = expression;
    if (description) description.innerHTML = describeCronExpression(minute, hour, dayOfMonth, month, dayOfWeek);
}

function describeCronExpression(minute, hour, dayOfMonth, month, dayOfWeek) {
    let parts = [];

    // Minute
    if (minute === '*') parts.push('every minute');
    else if (minute.includes('/')) parts.push(`every ${minute.split('/')[1]} minutes`);
    else if (minute.includes(',')) parts.push(`at minutes ${minute}`);
    else parts.push(`at minute ${minute}`);

    // Hour
    if (hour !== '*') {
        if (hour.includes('/')) parts.push(`every ${hour.split('/')[1]} hours`);
        else if (hour.includes(',')) parts.push(`at hours ${hour}`);
        else parts.push(`at ${hour}:00`);
    }

    // Day of month
    if (dayOfMonth !== '*') {
        if (dayOfMonth.includes('/')) parts.push(`every ${dayOfMonth.split('/')[1]} days`);
        else if (dayOfMonth.includes(',')) parts.push(`on days ${dayOfMonth}`);
        else parts.push(`on day ${dayOfMonth}`);
    }

    // Month
    if (month !== '*') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (month.includes(',')) {
            const monthNames = month.split(',').map(m => months[parseInt(m) - 1]).join(', ');
            parts.push(`in ${monthNames}`);
        } else {
            parts.push(`in ${months[parseInt(month) - 1]}`);
        }
    }

    // Day of week
    if (dayOfWeek !== '*') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (dayOfWeek.includes(',')) {
            const dayNames = dayOfWeek.split(',').map(d => days[parseInt(d)]).join(', ');
            parts.push(`on ${dayNames}`);
        } else {
            parts.push(`on ${days[parseInt(dayOfWeek)]}`);
        }
    }

    return `<div class="cron-description">Runs ${parts.join(', ')}</div>`;
}

function parseCronExpression() {
    const input = document.getElementById('cronExpressionOutput')?.value || '';
    const parts = input.trim().split(/\s+/);

    if (parts.length === 5) {
        if (document.getElementById('cronMinute')) document.getElementById('cronMinute').value = parts[0];
        if (document.getElementById('cronHour')) document.getElementById('cronHour').value = parts[1];
        if (document.getElementById('cronDayOfMonth')) document.getElementById('cronDayOfMonth').value = parts[2];
        if (document.getElementById('cronMonth')) document.getElementById('cronMonth').value = parts[3];
        if (document.getElementById('cronDayOfWeek')) document.getElementById('cronDayOfWeek').value = parts[4];

        const description = document.getElementById('cronDescription');
        if (description) description.innerHTML = describeCronExpression(parts[0], parts[1], parts[2], parts[3], parts[4]);
    }
}

// =================== HTTP STATUS CODE REFERENCE ===================

const HTTP_STATUS_CODES = {
    // 1xx Informational
    100: { name: 'Continue', desc: 'The server has received the request headers, and the client should proceed to send the request body.' },
    101: { name: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols.' },

    // 2xx Success
    200: { name: 'OK', desc: 'The request has succeeded.' },
    201: { name: 'Created', desc: 'The request has been fulfilled and resulted in a new resource being created.' },
    202: { name: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.' },
    204: { name: 'No Content', desc: 'The server successfully processed the request, but is not returning any content.' },

    // 3xx Redirection
    301: { name: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
    302: { name: 'Found', desc: 'The resource was found, but at a different URI.' },
    304: { name: 'Not Modified', desc: 'The resource has not been modified since the last request.' },
    307: { name: 'Temporary Redirect', desc: 'The request should be repeated with another URI, but future requests can use the original URI.' },
    308: { name: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.' },

    // 4xx Client Errors
    400: { name: 'Bad Request', desc: 'The server cannot process the request due to a client error.' },
    401: { name: 'Unauthorized', desc: 'Authentication is required and has failed or has not been provided.' },
    403: { name: 'Forbidden', desc: 'The server understood the request but refuses to authorize it.' },
    404: { name: 'Not Found', desc: 'The requested resource could not be found.' },
    405: { name: 'Method Not Allowed', desc: 'The request method is not supported for the requested resource.' },
    408: { name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
    409: { name: 'Conflict', desc: 'The request could not be processed because of conflict in the request.' },
    410: { name: 'Gone', desc: 'The resource requested is no longer available and will not be available again.' },
    429: { name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.' },

    // 5xx Server Errors
    500: { name: 'Internal Server Error', desc: 'A generic error message when the server encounters an unexpected condition.' },
    501: { name: 'Not Implemented', desc: 'The server does not support the functionality required to fulfill the request.' },
    502: { name: 'Bad Gateway', desc: 'The server received an invalid response from the upstream server.' },
    503: { name: 'Service Unavailable', desc: 'The server is currently unavailable (overloaded or down).' },
    504: { name: 'Gateway Timeout', desc: 'The server did not receive a timely response from the upstream server.' }
};

function searchHttpStatus() {
    const query = document.getElementById('httpStatusSearch')?.value.toLowerCase() || '';
    const output = document.getElementById('httpStatusResults');

    if (!output) return;

    if (!query) {
        // Show all
        displayHttpStatuses(Object.keys(HTTP_STATUS_CODES), output);
        return;
    }

    // Search by code or name
    const matches = Object.keys(HTTP_STATUS_CODES).filter(code => {
        const status = HTTP_STATUS_CODES[code];
        return code.includes(query) ||
               status.name.toLowerCase().includes(query) ||
               status.desc.toLowerCase().includes(query);
    });

    displayHttpStatuses(matches, output);
}

function displayHttpStatuses(codes, output) {
    if (codes.length === 0) {
        output.innerHTML = '<div class="validation-result error">No matching HTTP status codes found</div>';
        return;
    }

    const grouped = {
        '1xx': [], '2xx': [], '3xx': [], '4xx': [], '5xx': []
    };

    codes.forEach(code => {
        const category = code[0] + 'xx';
        grouped[category].push(code);
    });

    const categoryNames = {
        '1xx': 'Informational',
        '2xx': 'Success',
        '3xx': 'Redirection',
        '4xx': 'Client Errors',
        '5xx': 'Server Errors'
    };

    const categoryColors = {
        '1xx': '#3b82f6',
        '2xx': '#10b981',
        '3xx': '#f59e0b',
        '4xx': '#ef4444',
        '5xx': '#8b5cf6'
    };

    output.innerHTML = Object.keys(grouped)
        .filter(category => grouped[category].length > 0)
        .map(category => `
            <div class="http-category">
                <h4 style="color: ${categoryColors[category]}">${category} ${categoryNames[category]}</h4>
                <div class="http-status-list">
                    ${grouped[category].map(code => {
                        const status = HTTP_STATUS_CODES[code];
                        return `
                            <div class="http-status-item">
                                <div class="http-status-header">
                                    <span class="http-code" style="color: ${categoryColors[category]}">${code}</span>
                                    <span class="http-name">${status.name}</span>
                                </div>
                                <div class="http-desc">${status.desc}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
}

// =================== SQL QUERY FORMATTER ===================

function formatSqlQuery() {
    const input = document.getElementById('sqlQueryInput')?.value || '';
    const output = document.getElementById('sqlQueryOutput');

    if (!output) return;

    if (!input.trim()) {
        output.textContent = '';
        return;
    }

    let formatted = input;

    // Keywords to uppercase
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN',
        'LIKE', 'IS', 'NULL', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
        'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO',
        'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP',
        'INDEX', 'VIEW', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC'
    ];

    // Format the query
    keywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        formatted = formatted.replace(regex, keyword);
    });

    // Add line breaks
    formatted = formatted
        .replace(/\bSELECT\b/g, '\nSELECT\n  ')
        .replace(/\bFROM\b/g, '\nFROM\n  ')
        .replace(/\bWHERE\b/g, '\nWHERE\n  ')
        .replace(/\bAND\b/g, '\n  AND ')
        .replace(/\bOR\b/g, '\n  OR ')
        .replace(/\bJOIN\b/g, '\nJOIN ')
        .replace(/\bLEFT JOIN\b/g, '\nLEFT JOIN ')
        .replace(/\bRIGHT JOIN\b/g, '\nRIGHT JOIN ')
        .replace(/\bINNER JOIN\b/g, '\nINNER JOIN ')
        .replace(/\bON\b/g, '\n  ON ')
        .replace(/\bGROUP BY\b/g, '\nGROUP BY\n  ')
        .replace(/\bORDER BY\b/g, '\nORDER BY\n  ')
        .replace(/\bHAVING\b/g, '\nHAVING\n  ')
        .replace(/,/g, ',\n  ');

    // Clean up extra whitespace
    formatted = formatted
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n');

    output.textContent = formatted;
}

// =================== XML ↔ JSON CONVERTER ===================

function xmlToJson() {
    const input = document.getElementById('xmlJsonInput')?.value || '';
    const output = document.getElementById('xmlJsonOutput');

    if (!output) return;

    if (!input.trim()) {
        output.textContent = '';
        return;
    }

    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, 'text/xml');

        // Check for parse errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Invalid XML');
        }

        const json = xmlToJsonObject(xmlDoc.documentElement);
        output.textContent = JSON.stringify(json, null, 2);

        // Highlight syntax if Prism is available
        if (window.Prism) {
            output.innerHTML = `<code class="language-json">${escapeHtml(JSON.stringify(json, null, 2))}</code>`;
            window.Prism.highlightElement(output.querySelector('code'));
        }
    } catch (error) {
        output.textContent = 'Error converting XML to JSON: ' + error.message;
    }
}

function jsonToXml() {
    const input = document.getElementById('xmlJsonInput')?.value || '';
    const output = document.getElementById('xmlJsonOutput');

    if (!output) return;

    if (!input.trim()) {
        output.textContent = '';
        return;
    }

    try {
        const json = JSON.parse(input);
        const xml = jsonToXmlString(json, 'root');
        output.textContent = formatXml(xml);
    } catch (error) {
        output.textContent = 'Error converting JSON to XML: ' + error.message;
    }
}

function xmlToJsonObject(xml) {
    const obj = {};

    if (xml.nodeType === 1) { // Element
        // Attributes
        if (xml.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let i = 0; i < xml.attributes.length; i++) {
                const attr = xml.attributes[i];
                obj['@attributes'][attr.name] = attr.value;
            }
        }
    } else if (xml.nodeType === 3) { // Text
        return xml.nodeValue.trim();
    }

    // Children
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const child = xml.childNodes[i];
            const nodeName = child.nodeName;

            if (child.nodeType === 3) { // Text node
                const text = child.nodeValue.trim();
                if (text) {
                    if (Object.keys(obj).length === 0) {
                        return text;
                    }
                    obj['#text'] = text;
                }
            } else {
                if (typeof obj[nodeName] === 'undefined') {
                    obj[nodeName] = xmlToJsonObject(child);
                } else {
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    obj[nodeName].push(xmlToJsonObject(child));
                }
            }
        }
    }

    return obj;
}

function jsonToXmlString(obj, rootName = 'root') {
    if (typeof obj !== 'object' || obj === null) {
        return `<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
    }

    let xml = `<${rootName}`;

    // Add attributes
    if (obj['@attributes']) {
        for (const attr in obj['@attributes']) {
            xml += ` ${attr}="${escapeXml(obj['@attributes'][attr])}"`;
        }
    }

    xml += '>';

    // Add children
    for (const key in obj) {
        if (key === '@attributes') continue;

        if (key === '#text') {
            xml += escapeXml(obj[key]);
        } else if (Array.isArray(obj[key])) {
            obj[key].forEach(item => {
                xml += jsonToXmlString(item, key);
            });
        } else if (typeof obj[key] === 'object') {
            xml += jsonToXmlString(obj[key], key);
        } else {
            xml += `<${key}>${escapeXml(String(obj[key]))}</${key}>`;
        }
    }

    xml += `</${rootName}>`;
    return xml;
}

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatXml(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\n$2$3');

    xml.split('\n').forEach(node => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad > 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        formatted += PADDING.repeat(pad) + node + '\n';
        pad += indent;
    });

    return formatted.trim();
}

// =================== DIFF/COMPARE TOOL ===================

function comparetexts() {
    const text1 = document.getElementById('compareText1')?.value || '';
    const text2 = document.getElementById('compareText2')?.value || '';
    const output = document.getElementById('compareOutput');

    if (!output) return;

    if (!text1 && !text2) {
        output.innerHTML = '<div class="validation-result error">Please enter text in both fields to compare</div>';
        return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    const diff = computeDiff(lines1, lines2);

    output.innerHTML = `
        <div class="diff-summary">
            <div class="diff-stat added">+${diff.added} added</div>
            <div class="diff-stat removed">-${diff.removed} removed</div>
            <div class="diff-stat unchanged">${diff.unchanged} unchanged</div>
        </div>
        <div class="diff-content">
            ${diff.lines.map(line => `
                <div class="diff-line ${line.type}">
                    <span class="diff-line-number">${line.number}</span>
                    <span class="diff-line-marker">${line.marker}</span>
                    <span class="diff-line-text">${escapeHtml(line.text)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function computeDiff(lines1, lines2) {
    const result = {
        lines: [],
        added: 0,
        removed: 0,
        unchanged: 0
    };

    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
        const line1 = lines1[i];
        const line2 = lines2[i];

        if (line1 === line2) {
            result.lines.push({ type: 'unchanged', number: i + 1, marker: ' ', text: line1 || '' });
            result.unchanged++;
        } else if (line1 === undefined) {
            result.lines.push({ type: 'added', number: i + 1, marker: '+', text: line2 });
            result.added++;
        } else if (line2 === undefined) {
            result.lines.push({ type: 'removed', number: i + 1, marker: '-', text: line1 });
            result.removed++;
        } else {
            result.lines.push({ type: 'removed', number: i + 1, marker: '-', text: line1 });
            result.lines.push({ type: 'added', number: i + 1, marker: '+', text: line2 });
            result.removed++;
            result.added++;
        }
    }

    return result;
}

// =================== UTILITY FUNCTIONS ===================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =================== INITIALIZATION ===================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize JSON Validator
    const jsonInput = document.getElementById('jsonValidatorInput');
    if (jsonInput) {
        let debounceTimer;
        jsonInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(validateAndFormatJson, 500);
        });
    }

    // Initialize String Escaper
    const escapeInput = document.getElementById('escapeInput');
    const escapeFormat = document.getElementById('escapeFormat');
    if (escapeInput) {
        escapeInput.addEventListener('input', escapeString);
    }
    if (escapeFormat) {
        escapeFormat.addEventListener('change', escapeString);
    }

    // Initialize HTTP Status Search
    const httpSearch = document.getElementById('httpStatusSearch');
    if (httpSearch) {
        httpSearch.addEventListener('input', searchHttpStatus);
        searchHttpStatus(); // Show all initially
    }

    // Initialize Cron Builder
    ['cronMinute', 'cronHour', 'cronDayOfMonth', 'cronMonth', 'cronDayOfWeek'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', buildCronExpression);
        }
    });
    buildCronExpression(); // Initialize

    // Initialize SQL Formatter
    const sqlInput = document.getElementById('sqlQueryInput');
    if (sqlInput) {
        let debounceTimer;
        sqlInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(formatSqlQuery, 500);
        });
    }
});
