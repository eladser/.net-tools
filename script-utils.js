// =================== ENHANCED SCRIPT UTILS ===================
// Complete implementation of all .NET Tools utilities

// =================== UNIT CONVERTER ===================

const unitConversions = {
    length: {
        units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
        toMeter: {
            'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
            'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344
        }
    },
    weight: {
        units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
        toGram: {
            'mg': 0.001, 'g': 1, 'kg': 1000,
            'oz': 28.3495, 'lb': 453.592, 'ton': 1000000
        }
    },
    temperature: {
        units: ['C', 'F', 'K'],
        convert: (value, from, to) => {
            let celsius;
            if (from === 'F') celsius = (value - 32) * 5/9;
            else if (from === 'K') celsius = value - 273.15;
            else celsius = value;
            
            if (to === 'F') return celsius * 9/5 + 32;
            else if (to === 'K') return celsius + 273.15;
            else return celsius;
        }
    },
    data: {
        units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        toByte: {
            'B': 1, 'KB': 1024, 'MB': 1024 ** 2,
            'GB': 1024 ** 3, 'TB': 1024 ** 4, 'PB': 1024 ** 5
        }
    }
};

function updateUnitOptions() {
    const category = document.getElementById('unitCategory')?.value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    if (!category || !fromUnit || !toUnit) return;
    
    const units = unitConversions[category].units;
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units.forEach(unit => {
        fromUnit.appendChild(new Option(unit, unit));
        toUnit.appendChild(new Option(unit, unit));
    });
    
    if (units.length > 1) toUnit.selectedIndex = 1;
}

function convertUnits() {
    const category = document.getElementById('unitCategory')?.value;
    const value = parseFloat(document.getElementById('unitValue')?.value);
    const fromUnit = document.getElementById('fromUnit')?.value;
    const toUnit = document.getElementById('toUnit')?.value;
    const result = document.getElementById('unitResult');
    
    if (!result) return;
    
    if (isNaN(value)) {
        result.textContent = 'Please enter a valid number';
        return;
    }
    
    let convertedValue;
    
    if (category === 'temperature') {
        convertedValue = unitConversions.temperature.convert(value, fromUnit, toUnit);
    } else {
        const conversion = unitConversions[category];
        const baseUnit = category === 'length' ? 'toMeter' : 
                         category === 'weight' ? 'toGram' : 'toByte';
        
        const baseValue = value * conversion[baseUnit][fromUnit];
        convertedValue = baseValue / conversion[baseUnit][toUnit];
    }
    
    result.textContent = `${convertedValue.toLocaleString()} ${toUnit}`;
}

// =================== DATE CALCULATOR ===================

function calculateDateDifference() {
    const startDate = new Date(document.getElementById('startDate')?.value);
    const endDate = new Date(document.getElementById('endDate')?.value);
    
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
        updateDateResults('Please select both start and end dates', '', '', '', '', '');
        return;
    }
    
    const timeDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.abs((endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()));
    const yearsDiff = Math.abs(endDate.getFullYear() - startDate.getFullYear());
    const hoursDiff = daysDiff * 24;
    const minutesDiff = hoursDiff * 60;
    
    updateDateResults(daysDiff, weeksDiff, monthsDiff, yearsDiff, hoursDiff, minutesDiff);
}

function updateDateResults(days, weeks, months, years, hours, minutes) {
    const updates = {
        'totalDays': days,
        'totalWeeks': weeks,
        'totalMonths': months,
        'totalYears': years,
        'totalHours': hours,
        'totalMinutes': minutes
    };
    
    Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// =================== RANDOM DATA GENERATOR ===================

function generateRandomData() {
    const dataType = document.getElementById('randomType')?.value || 'numbers';
    const count = parseInt(document.getElementById('randomCount')?.value) || 5;
    const output = document.getElementById('randomResult');
    
    if (!output) return;
    
    const generators = {
        names: () => {
            const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
            return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        },
        emails: () => {
            const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
            const username = Math.random().toString(36).substring(2, 8);
            return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
        },
        phones: () => {
            const areaCode = Math.floor(Math.random() * 900) + 100;
            const exchange = Math.floor(Math.random() * 900) + 100;
            const number = Math.floor(Math.random() * 9000) + 1000;
            return `(${areaCode}) ${exchange}-${number}`;
        },
        addresses: () => {
            const streetNumbers = Math.floor(Math.random() * 9999) + 1;
            const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln', 'Maple Way', 'Park Blvd', 'First Ave', 'Second St', 'Third Rd'];
            const cities = ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Washington', 'Chester', 'Greenville', 'Salem', 'Fairview', 'Oxford'];
            const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
            const zipCode = Math.floor(Math.random() * 90000) + 10000;
            return `${streetNumbers} ${streetNames[Math.floor(Math.random() * streetNames.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, ${states[Math.floor(Math.random() * states.length)]} ${zipCode}`;
        },
        strings: () => {
            return Math.random().toString(36).substring(2, 12);
        },
        numbers: () => {
            return Math.floor(Math.random() * 1000000);
        }
    };
    
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(generators[dataType]());
    }
    
    output.textContent = data.join('\n');
}

// =================== NUMBER BASE CONVERTER ===================

function convertNumberBases() {
    const input = document.getElementById('numberInput')?.value.trim();
    const inputBase = parseInt(document.getElementById('inputBase')?.value);
    
    if (!input) {
        updateBaseResults('Please enter a number', '', '', '');
        return;
    }
    
    try {
        const decimal = parseInt(input, inputBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid number for the specified base');
        }
        
        updateBaseResults(
            decimal.toString(2),
            decimal.toString(8),
            decimal.toString(10),
            decimal.toString(16).toUpperCase()
        );
        
    } catch (error) {
        updateBaseResults(`Error: ${error.message}`, '', '', '');
    }
}

function updateBaseResults(binary, octal, decimal, hex) {
    const updates = {
        'binaryResult': binary,
        'octalResult': octal,
        'decimalResult': decimal,
        'hexResult': hex
    };
    
    Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// =================== CONNECTION STRING BUILDER ===================

function buildConnectionString() {
    const dbType = document.getElementById('dbType')?.value;
    const server = document.getElementById('server')?.value.trim();
    const database = document.getElementById('database')?.value.trim();
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value.trim();
    const integratedSecurity = document.getElementById('integratedSecurity')?.checked;
    const trustServerCertificate = document.getElementById('trustServerCertificate')?.checked;
    const output = document.getElementById('connectionStringOutput');
    
    if (!output) return;
    
    if (!server && dbType !== 'sqlite') {
        output.value = 'Server is required';
        return;
    }
    if (!database) {
        output.value = 'Database is required';
        return;
    }
    
    let connectionString = '';
    
    switch (dbType) {
        case 'sqlserver':
            connectionString = buildSqlServerConnectionString(server, database, username, password, integratedSecurity, trustServerCertificate);
            break;
        case 'mysql':
            connectionString = buildMySqlConnectionString(server, database, username, password);
            break;
        case 'postgresql':
            connectionString = buildPostgreSqlConnectionString(server, database, username, password);
            break;
        case 'sqlite':
            connectionString = buildSqliteConnectionString(database);
            break;
        default:
            connectionString = 'Unsupported database type';
    }
    
    output.value = connectionString;
}

function buildSqlServerConnectionString(server, database, username, password, integratedSecurity, trustServerCertificate) {
    let parts = [`Server=${server}`, `Database=${database}`];
    
    if (integratedSecurity) {
        parts.push('Integrated Security=true');
    } else {
        if (username) parts.push(`User Id=${username}`);
        if (password) parts.push(`Password=${password}`);
    }
    
    if (trustServerCertificate) parts.push('TrustServerCertificate=true');
    parts.push('MultipleActiveResultSets=true', 'ConnectRetryCount=3', 'ConnectRetryInterval=5');
    
    return parts.join(';');
}

function buildMySqlConnectionString(server, database, username, password) {
    let parts = [`Server=${server}`, `Database=${database}`];
    if (username) parts.push(`Uid=${username}`);
    if (password) parts.push(`Pwd=${password}`);
    parts.push('Port=3306', 'CharSet=utf8mb4', 'SslMode=Preferred', 'AllowUserVariables=true');
    return parts.join(';');
}

function buildPostgreSqlConnectionString(server, database, username, password) {
    let parts = [`Host=${server}`, `Database=${database}`, 'Port=5432'];
    if (username) parts.push(`Username=${username}`);
    if (password) parts.push(`Password=${password}`);
    parts.push('Pooling=true', 'SSL Mode=Prefer', 'Trust Server Certificate=true');
    return parts.join(';');
}

function buildSqliteConnectionString(database) {
    return `Data Source=${database}.db;Cache=Shared;Pooling=true;`;
}

// =================== PASSWORD GENERATOR ===================

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength')?.value) || 16;
    const includeUppercase = document.getElementById('includeUppercase')?.checked;
    const includeLowercase = document.getElementById('includeLowercase')?.checked;
    const includeNumbers = document.getElementById('includeNumbers')?.checked;
    const includeSymbols = document.getElementById('includeSymbols')?.checked;
    const excludeSimilar = document.getElementById('excludeSimilar')?.checked;
    const output = document.getElementById('generatedPassword');
    
    if (!output) return;
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        output.value = 'Please select at least one character type';
        return;
    }
    
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    const requiredChars = [];
    
    if (includeUppercase) {
        const upperChars = excludeSimilar ? uppercase.replace(/[OI]/g, '') : uppercase;
        chars += upperChars;
        requiredChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (includeLowercase) {
        const lowerChars = excludeSimilar ? lowercase.replace(/[l]/g, '') : lowercase;
        chars += lowerChars;
        requiredChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (includeNumbers) {
        const numberChars = excludeSimilar ? numbers.replace(/[01]/g, '') : numbers;
        chars += numberChars;
        requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (includeSymbols) {
        chars += symbols;
        requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    
    let password = requiredChars.join('');
    for (let i = password.length; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    output.value = password;
    analyzePasswordStrength(password);
}

function analyzePasswordStrength(password) {
    const strengthDisplay = document.getElementById('passwordStrength');
    if (!strengthDisplay || !password) return;
    
    const analysis = calculatePasswordStrength(password);
    const strengthColors = {
        'Very Weak': '#ff4444', 'Weak': '#ff8800', 'Fair': '#ffbb00',
        'Good': '#88cc00', 'Strong': '#44cc00', 'Very Strong': '#00aa44'
    };
    
    strengthDisplay.innerHTML = `
        <div class="strength-meter">
            <div class="strength-bar" style="width: ${analysis.score}%; background-color: ${strengthColors[analysis.rating]}"></div>
        </div>
        <div class="strength-info">
            <div class="strength-rating" style="color: ${strengthColors[analysis.rating]}">
                ${analysis.rating} (${analysis.score}/100)
            </div>
            <div class="strength-details">
                <div>Length: ${analysis.length} characters</div>
                <div>Character types: ${analysis.charTypes}</div>
                <div>Entropy: ${analysis.entropy.toFixed(1)} bits</div>
                <div>Time to crack: ${analysis.crackTime}</div>
            </div>
            ${analysis.suggestions.length > 0 ? `
                <div class="strength-suggestions">
                    <div>Suggestions:</div>
                    ${analysis.suggestions.map(s => `<div>• ${s}</div>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function calculatePasswordStrength(password) {
    let score = 0;
    const suggestions = [];
    const length = password.length;
    
    // Length scoring
    if (length >= 12) score += 25;
    else if (length >= 8) score += 15;
    else if (length >= 6) score += 10;
    else suggestions.push('Use at least 8 characters (12+ recommended)');
    
    // Character diversity
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    
    const charTypes = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
    score += charTypes * 10;
    
    if (charTypes < 3) suggestions.push('Use a mix of uppercase, lowercase, numbers, and symbols');
    
    // Pattern penalties
    if (/(..).*\1/.test(password)) {
        score -= 10;
        suggestions.push('Avoid repeated patterns');
    }
    
    // Entropy calculation
    let charset = 0;
    if (hasLower) charset += 26;
    if (hasUpper) charset += 26;
    if (hasNumbers) charset += 10;
    if (hasSymbols) charset += 32;
    
    const entropy = length * Math.log2(charset);
    const timeSeconds = Math.pow(charset, length) / (2 * 1e9);
    const crackTime = formatCrackTime(timeSeconds);
    
    score = Math.max(0, Math.min(100, score));
    
    let rating;
    if (score < 20) rating = 'Very Weak';
    else if (score < 40) rating = 'Weak';
    else if (score < 60) rating = 'Fair';
    else if (score < 80) rating = 'Good';
    else if (score < 95) rating = 'Strong';
    else rating = 'Very Strong';
    
    return { score: Math.round(score), rating, length, charTypes, entropy, crackTime, suggestions: suggestions.slice(0, 3) };
}

function formatCrackTime(seconds) {
    if (seconds < 1) return 'Instantly';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
}

// =================== HASH GENERATOR ===================

async function generateHashes() {
    const input = document.getElementById('hashInput')?.value || '';
    const generateMD5 = document.getElementById('generateMD5')?.checked;
    const generateSHA1 = document.getElementById('generateSHA1')?.checked;
    const generateSHA256 = document.getElementById('generateSHA256')?.checked;
    const generateSHA512 = document.getElementById('generateSHA512')?.checked;
    const output = document.getElementById('hashResults');
    
    if (!output) return;
    
    if (!input.trim()) {
        output.innerHTML = '<div class="validation-result error">Please enter text to hash</div>';
        return;
    }
    
    const results = [];
    
    try {
        if (generateMD5) results.push({ name: 'MD5', value: await generateMD5Hash(input), warning: true });
        if (generateSHA1) results.push({ name: 'SHA-1', value: await generateSHA1Hash(input), warning: true });
        if (generateSHA256) results.push({ name: 'SHA-256', value: await generateSHA256Hash(input) });
        if (generateSHA512) results.push({ name: 'SHA-512', value: await generateSHA512Hash(input) });
        
        output.innerHTML = results.map(result => `
            <div class="hash-item ${result.warning ? 'warning' : ''}">
                <div class="hash-type">
                    ${result.name}
                    ${result.warning ? '<span class="warning-badge">⚠️ Not Secure</span>' : ''}
                </div>
                <div class="hash-value selectable" title="Click to copy">
                    ${result.value}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">Error: ${error.message}</div>`;
    }
}

async function generateSHA256Hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
}

async function generateSHA512Hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    return bufferToHex(hashBuffer);
}

async function generateSHA1Hash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    return bufferToHex(hashBuffer);
}

function bufferToHex(buffer) {
    const byteArray = new Uint8Array(buffer);
    return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 implementation (for demo purposes)
async function generateMD5Hash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
}

// =================== BASE64 ENCODER/DECODER ===================

function encodeBase64() {
    const input = document.getElementById('base64Input')?.value || '';
    const urlSafe = document.getElementById('urlSafeBase64')?.checked;
    const output = document.getElementById('base64Result');
    
    if (!output) return;
    
    if (!input) {
        output.textContent = 'Please enter text to encode';
        return;
    }
    
    try {
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) {
            encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        output.textContent = encoded;
    } catch (error) {
        output.textContent = `Error encoding: ${error.message}`;
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input')?.value || '';
    const urlSafe = document.getElementById('urlSafeBase64')?.checked;
    const output = document.getElementById('base64Result');
    
    if (!output) return;
    
    if (!input) {
        output.textContent = 'Please enter Base64 to decode';
        return;
    }
    
    try {
        let decoded = input;
        if (urlSafe) {
            decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
            while (decoded.length % 4) decoded += '=';
        }
        const result = decodeURIComponent(escape(atob(decoded)));
        output.textContent = result;
    } catch (error) {
        output.textContent = `Error decoding: ${error.message}`;
    }
}

function validateBase64() {
    const input = document.getElementById('base64Input')?.value || '';
    const output = document.getElementById('base64Result');
    
    if (!output) return;
    
    if (!input) {
        output.textContent = 'Please enter Base64 to validate';
        return;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    const urlSafeRegex = /^[A-Za-z0-9_-]*$/;
    
    const isValid = base64Regex.test(input) || urlSafeRegex.test(input);
    output.innerHTML = isValid 
        ? '<div class="validation-result success">✓ Valid Base64 format</div>'
        : '<div class="validation-result error">✗ Invalid Base64 format</div>';
}

// =================== JWT TOKEN DECODER ===================

function decodeJWT() {
    const input = document.getElementById('jwtInput')?.value.trim();
    const output = document.getElementById('jwtResults');
    
    if (!output) return;
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter a JWT token</div>';
        return;
    }
    
    try {
        const parts = input.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format - must have 3 parts separated by dots');
        }
        
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const signature = parts[2];
        
        output.innerHTML = `
            <div class="jwt-section">
                <h4>Header</h4>
                <pre class="jwt-content">${JSON.stringify(header, null, 2)}</pre>
            </div>
            <div class="jwt-section">
                <h4>Payload</h4>
                <pre class="jwt-content">${JSON.stringify(payload, null, 2)}</pre>
            </div>
            <div class="jwt-section">
                <h4>Signature</h4>
                <div class="jwt-signature">${signature}</div>
            </div>
            ${payload.exp ? `
                <div class="jwt-section">
                    <h4>Token Info</h4>
                    <div>Expires: ${new Date(payload.exp * 1000).toLocaleString()}</div>
                    <div>Status: ${payload.exp * 1000 > Date.now() ? 'Valid' : 'Expired'}</div>
                </div>
            ` : ''}
        `;
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">Error: ${error.message}</div>`;
    }
}

// =================== C# TYPE CONVERTER ===================

function generateTypeConversion() {
    const fromType = document.getElementById('fromType')?.value;
    const toType = document.getElementById('toType')?.value;
    const includeNullHandling = document.getElementById('includeNullHandling')?.checked;
    const includeErrorHandling = document.getElementById('includeErrorHandling')?.checked;
    const includeValidation = document.getElementById('includeValidation')?.checked;
    const useExtensionMethod = document.getElementById('useExtensionMethod')?.checked;
    const output = document.getElementById('typeConversionOutput');
    
    if (!output) return;
    
    const code = generateConversionCode(fromType, toType, {
        includeNullHandling,
        includeErrorHandling,
        includeValidation,
        useExtensionMethod
    });
    
    output.textContent = code;
    
    // Highlight syntax if Prism is available
    if (window.Prism) {
        output.innerHTML = `<code class="language-csharp">${code}</code>`;
        window.Prism.highlightElement(output.querySelector('code'));
    }
}

function generateConversionCode(fromType, toType, options) {
    const methodName = `ConvertTo${capitalize(toType)}`;
    const paramName = fromType === 'string' ? 'value' : 'input';
    
    let code = '';
    
    // Add using statements
    code += 'using System;\n';
    if (options.includeValidation) code += 'using System.ComponentModel.DataAnnotations;\n';
    code += '\n';
    
    // Method signature
    if (options.useExtensionMethod) {
        code += `public static class ${capitalize(fromType)}Extensions\n{\n`;
        code += `    public static ${toType}${options.includeNullHandling ? '?' : ''} ${methodName}(this ${fromType}${options.includeNullHandling ? '?' : ''} ${paramName})\n    {\n`;
    } else {
        code += `public static ${toType}${options.includeNullHandling ? '?' : ''} ${methodName}(${fromType}${options.includeNullHandling ? '?' : ''} ${paramName})\n{\n`;
    }
    
    // Null handling
    if (options.includeNullHandling) {
        code += `    if (${paramName} == null)\n        return null;\n\n`;
    }
    
    // Validation
    if (options.includeValidation && fromType === 'string') {
        code += `    if (string.IsNullOrWhiteSpace(${paramName}))\n        throw new ArgumentException("Value cannot be null or whitespace", nameof(${paramName}));\n\n`;
    }
    
    // Conversion logic
    if (options.includeErrorHandling) {
        code += '    try\n    {\n';
        code += `        ${getConversionLogic(fromType, toType, paramName, '        ')}`;
        code += '    }\n';
        code += '    catch (Exception ex)\n';
        code += '    {\n';
        code += `        throw new InvalidOperationException($"Cannot convert '{${paramName}}' to ${toType}", ex);\n`;
        code += '    }\n';
    } else {
        code += getConversionLogic(fromType, toType, paramName, '    ');
    }
    
    code += '}\n';
    
    if (options.useExtensionMethod) {
        code += '}\n';
    }
    
    return code;
}

function getConversionLogic(fromType, toType, paramName, indent) {
    const conversions = {
        'string-int': `return int.Parse(${paramName});\n`,
        'string-double': `return double.Parse(${paramName});\n`,
        'string-decimal': `return decimal.Parse(${paramName});\n`,
        'string-bool': `return bool.Parse(${paramName});\n`,
        'string-DateTime': `return DateTime.Parse(${paramName});\n`,
        'string-Guid': `return Guid.Parse(${paramName});\n`,
        'int-string': `return ${paramName}.ToString();\n`,
        'double-string': `return ${paramName}.ToString();\n`,
        'decimal-string': `return ${paramName}.ToString();\n`,
        'bool-string': `return ${paramName}.ToString();\n`,
        'DateTime-string': `return ${paramName}.ToString("yyyy-MM-dd HH:mm:ss");\n`,
        'Guid-string': `return ${paramName}.ToString();\n`,
        'int-double': `return (double)${paramName};\n`,
        'double-int': `return (int)Math.Round(${paramName});\n`,
        'int-decimal': `return (decimal)${paramName};\n`,
        'decimal-int': `return (int)Math.Round(${paramName});\n`
    };
    
    const key = `${fromType}-${toType}`;
    const logic = conversions[key] || `return (${toType})${paramName}; // Generic cast\n`;
    
    return indent + logic;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =================== TEXT STATISTICS ===================

function analyzeText() {
    const input = document.getElementById('textStatsInput')?.value || '';
    
    if (!input.trim()) {
        updateTextStats(0, 0, 0, 0, 0, 0);
        return;
    }
    
    const chars = input.length;
    const words = input.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lines = input.split('\n').length;
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    
    updateTextStats(chars, words, lines, paragraphs, avgWordsPerSentence, readingTime);
}

function updateTextStats(chars, words, lines, paragraphs, avgWords, readingTime) {
    const updates = {
        'charCount': chars,
        'wordCount': words,
        'lineCount': lines,
        'paragraphCount': paragraphs,
        'avgWordsPerSentence': avgWords,
        'readingTime': readingTime
    };
    
    Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// =================== INITIALIZATION ===================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize unit converter
    const unitCategory = document.getElementById('unitCategory');
    if (unitCategory) {
        unitCategory.addEventListener('change', updateUnitOptions);
        updateUnitOptions();
    }
    
    // Initialize connection string builder
    const dbType = document.getElementById('dbType');
    if (dbType) {
        dbType.addEventListener('change', buildConnectionString);
        ['server', 'database', 'username', 'password', 'integratedSecurity', 'trustServerCertificate'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', buildConnectionString);
                element.addEventListener('change', buildConnectionString);
            }
        });
    }
    
    // Initialize password generator
    const passwordLength = document.getElementById('passwordLength');
    if (passwordLength) {
        ['passwordLength', 'includeUppercase', 'includeLowercase', 'includeNumbers', 'includeSymbols', 'excludeSimilar'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', generatePassword);
            }
        });
        generatePassword(); // Generate initial password
    }
    
    // Initialize hash generator
    const hashInput = document.getElementById('hashInput');
    if (hashInput) {
        let debounceTimer;
        hashInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (hashInput.value.trim()) generateHashes();
            }, 500);
        });
        if (hashInput.value.trim()) generateHashes();
    }
    
    // Initialize text statistics
    const textStatsInput = document.getElementById('textStatsInput');
    if (textStatsInput) {
        textStatsInput.addEventListener('input', analyzeText);
        analyzeText();
    }
});
