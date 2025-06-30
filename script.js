="stat-value">${Utils.formatNumber(stats.charactersNoSpaces)}</div>
            <div class="stat-label">Characters (no spaces)</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${Utils.formatNumber(stats.words)}</div>
            <div class="stat-label">Words</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.sentences}</div>
            <div class="stat-label">Sentences</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.paragraphs}</div>
            <div class="stat-label">Paragraphs</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${stats.readingTime} min</div>
            <div class="stat-label">Reading Time</div>
        </div>
    `;
    
    // Word frequency analysis
    const words = input.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
        if (word.length > 2) { // Ignore very short words
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });
    
    const sortedWords = Object.entries(frequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    if (sortedWords.length > 0) {
        frequencyDiv.innerHTML = `
            <h4>Top 10 Most Frequent Words</h4>
            <div style="display: grid; gap: 0.5rem;">
                ${sortedWords.map(([word, count]) => 
                    `<div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-tertiary); border-radius: var(--border-radius);">
                        <span>${word}</span>
                        <span>${count}</span>
                    </div>`
                ).join('')}
            </div>
        `;
    }
}

// =================== LOREM IPSUM GENERATOR ===================

function generateLorem() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value) || 3;
    const startWithLorem = document.getElementById('startWithLorem').checked;
    const output = document.getElementById('loremOutput');
    
    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
        'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
        'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];
    
    let result = '';
    
    switch (type) {
        case 'words':
            const words = [];
            for (let i = 0; i < count; i++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            if (startWithLorem && words[0] !== 'lorem') {
                words[0] = 'Lorem';
            }
            result = words.join(' ');
            break;
            
        case 'sentences':
            const sentences = [];
            for (let i = 0; i < count; i++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                for (let j = 0; j < sentenceLength; j++) {
                    sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                }
                sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                sentences.push(sentence.join(' ') + '.');
            }
            if (startWithLorem) {
                sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
            }
            result = sentences.join(' ');
            break;
            
        case 'paragraphs':
        default:
            const paragraphs = [];
            for (let i = 0; i < count; i++) {
                const sentences = [];
                const sentenceCount = Math.floor(Math.random() * 5) + 3;
                for (let j = 0; j < sentenceCount; j++) {
                    const sentenceLength = Math.floor(Math.random() * 10) + 5;
                    const sentence = [];
                    for (let k = 0; k < sentenceLength; k++) {
                        sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                    }
                    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                    sentences.push(sentence.join(' ') + '.');
                }
                paragraphs.push(sentences.join(' '));
            }
            if (startWithLorem) {
                paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + paragraphs[0].split('. ').slice(1).join('. ');
            }
            result = paragraphs.join('\n\n');
            break;
    }
    
    output.textContent = result;
}

// =================== JSON FORMATTER & VALIDATOR ===================

function formatJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        output.textContent = 'Please enter JSON to format';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        output.textContent = formatted;
        validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON</div>';
        
        if (typeof Prism !== 'undefined') {
            output.innerHTML = Prism.highlight(formatted, Prism.languages.json, 'json');
        }
    } catch (error) {
        validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
        output.textContent = '';
    }
}

function minifyJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        output.textContent = 'Please enter JSON to minify';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        output.textContent = minified;
        validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON (minified)</div>';
    } catch (error) {
        validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
        output.textContent = '';
    }
}

function validateJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        validationResult.innerHTML = '<div class="validation-result error">Please enter JSON to validate</div>';
        return;
    }
    
    try {
        JSON.parse(input);
        validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON</div>';
    } catch (error) {
        validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
    }
}

// =================== REGEX TESTER ===================

function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTestString').value;
    const global = document.getElementById('regexGlobal').checked;
    const caseInsensitive = document.getElementById('regexCaseInsensitive').checked;
    const multiline = document.getElementById('regexMultiline').checked;
    const output = document.getElementById('regexResults');
    
    if (!pattern) {
        output.innerHTML = '<div class="validation-result error">Please enter a regex pattern</div>';
        return;
    }
    
    if (!testString) {
        output.innerHTML = '<div class="validation-result error">Please enter a test string</div>';
        return;
    }
    
    try {
        let flags = '';
        if (global) flags += 'g';
        if (caseInsensitive) flags += 'i';
        if (multiline) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = testString.match(regex);
        
        if (matches) {
            let result = `<div class="validation-result success">✓ Pattern matched ${matches.length} time(s)</div>`;
            result += '<div style="margin-top: 1rem;"><strong>Matches:</strong></div>';
            result += '<div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius); margin-top: 0.5rem;">';
            
            matches.forEach((match, index) => {
                result += `<div>Match ${index + 1}: <code>${Utils.escapeHtml(match)}</code></div>`;
            });
            
            result += '</div>';
            
            // Show highlighted text
            const highlighted = testString.replace(regex, '<mark style="background: var(--warning-color); color: white; padding: 2px 4px; border-radius: 3px;">$&</mark>');
            result += '<div style="margin-top: 1rem;"><strong>Highlighted Text:</strong></div>';
            result += `<div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius); margin-top: 0.5rem; line-height: 1.6;">${highlighted}</div>`;
            
            output.innerHTML = result;
        } else {
            output.innerHTML = '<div class="validation-result warning">No matches found</div>';
        }
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">✗ Invalid regex: ${error.message}</div>`;
    }
}

// =================== PASSWORD GENERATOR & ANALYZER ===================

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value) || 16;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const excludeSimilar = document.getElementById('excludeSimilar').checked;
    const output = document.getElementById('generatedPassword');
    
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
        chars = chars.replace(/[0O1lI]/g, '');
    }
    
    if (!chars) {
        output.value = 'Please select at least one character type';
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    output.value = password;
    analyzePassword();
}

function analyzePassword() {
    const password = document.getElementById('generatedPassword').value;
    const strengthResult = document.getElementById('passwordStrengthResult');
    const suggestions = document.getElementById('passwordSuggestions');
    
    if (!password) {
        strengthResult.innerHTML = '';
        suggestions.innerHTML = '';
        return;
    }
    
    const analysis = {
        score: 0,
        feedback: [],
        strength: 'Very Weak'
    };
    
    // Length check
    if (password.length >= 8) analysis.score += 1;
    else analysis.feedback.push('Use at least 8 characters');
    
    if (password.length >= 12) analysis.score += 1;
    if (password.length >= 16) analysis.score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include special characters');
    
    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Avoid repeating characters');
    
    if (!/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def/.test(password.toLowerCase())) {
        analysis.score += 1;
    } else {
        analysis.feedback.push('Avoid sequential characters');
    }
    
    // Determine strength
    if (analysis.score >= 8) analysis.strength = 'Very Strong';
    else if (analysis.score >= 6) analysis.strength = 'Strong';
    else if (analysis.score >= 4) analysis.strength = 'Good';
    else if (analysis.score >= 2) analysis.strength = 'Fair';
    else analysis.strength = 'Weak';
    
    const strengthColors = {
        'Very Weak': 'strength-weak',
        'Weak': 'strength-weak',
        'Fair': 'strength-fair',
        'Good': 'strength-good',
        'Strong': 'strength-strong',
        'Very Strong': 'strength-strong'
    };
    
    strengthResult.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <strong>Password Strength: ${analysis.strength}</strong>
            <div class="strength-bar">
                <div class="strength-fill ${strengthColors[analysis.strength]}" style="width: ${(analysis.score / 9) * 100}%"></div>
            </div>
            <small>Score: ${analysis.score}/9</small>
        </div>
    `;
    
    if (analysis.feedback.length > 0) {
        suggestions.innerHTML = `
            <h4>Suggestions for Improvement:</h4>
            <ul>
                ${analysis.feedback.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
    } else {
        suggestions.innerHTML = '<div class="validation-result success">✓ Excellent password!</div>';
    }
}

// =================== HASH GENERATOR ===================

async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    const generateMD5 = document.getElementById('generateMD5').checked;
    const generateSHA1 = document.getElementById('generateSHA1').checked;
    const generateSHA256 = document.getElementById('generateSHA256').checked;
    const output = document.getElementById('hashResults');
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter text to hash</div>';
        return;
    }
    
    const hashes = [];
    
    try {
        if (generateMD5) {
            const md5Hash = CryptoUtils.md5(input);
            hashes.push({ type: 'MD5', value: md5Hash });
        }
        
        if (generateSHA1) {
            const sha1Hash = await CryptoUtils.sha1(input);
            hashes.push({ type: 'SHA-1', value: sha1Hash });
        }
        
        if (generateSHA256) {
            const sha256Hash = await CryptoUtils.sha256(input);
            hashes.push({ type: 'SHA-256', value: sha256Hash });
        }
        
        if (hashes.length === 0) {
            output.innerHTML = '<div class="validation-result error">Please select at least one hash algorithm</div>';
            return;
        }
        
        output.innerHTML = hashes.map(hash => `
            <div class="hash-item">
                <div class="hash-type">${hash.type}</div>
                <div class="hash-value" onclick="Utils.copyToClipboard('${hash.value}').then(() => Utils.showCopyFeedback(this))">${hash.value}</div>
            </div>
        `).join('');
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">Error generating hashes: ${error.message}</div>`;
    }
}

// =================== JWT TOKEN DECODER ===================

function decodeJWT() {
    const input = document.getElementById('jwtInput').value.trim();
    const output = document.getElementById('jwtResults');
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter a JWT token</div>';
        return;
    }
    
    try {
        const parts = input.split('.');
        
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
        }
        
        // Decode header
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Decode payload
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        // Format dates in payload
        const formatPayload = { ...payload };
        ['iat', 'exp', 'nbf'].forEach(field => {
            if (formatPayload[field]) {
                formatPayload[field + '_formatted'] = new Date(formatPayload[field] * 1000).toISOString();
            }
        });
        
        output.innerHTML = `
            <div class="jwt-section">
                <div class="jwt-section-header">Header</div>
                <div class="jwt-section-content">${JSON.stringify(header, null, 2)}</div>
            </div>
            <div class="jwt-section">
                <div class="jwt-section-header">Payload</div>
                <div class="jwt-section-content">${JSON.stringify(formatPayload, null, 2)}</div>
            </div>
            <div class="validation-result warning">
                ⚠️ Signature verification requires the secret key and is not performed here.
            </div>
        `;
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">✗ Invalid JWT token: ${error.message}</div>`;
    }
}

// =================== QR CODE GENERATOR ===================

function generateQRCode() {
    const text = document.getElementById('qrText').value;
    const size = document.getElementById('qrSize').value;
    const errorCorrection = document.getElementById('qrErrorCorrection').value;
    const output = document.getElementById('qrOutput');
    
    if (!text) {
        output.innerHTML = '<div class="validation-result error">Please enter text for QR code</div>';
        return;
    }
    
    // Using QR Server API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}`;
    
    output.innerHTML = `
        <img src="${qrUrl}" alt="QR Code" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
        <div style="margin-top: 1rem;">
            <a href="${qrUrl}" download="qrcode.png" class="btn btn-secondary">Download QR Code</a>
        </div>
    `;
}

// =================== UNIT CONVERTER ===================

const unitConversions = {
    length: {
        units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
        toMeter: {
            'mm': 0.001,
            'cm': 0.01,
            'm': 1,
            'km': 1000,
            'in': 0.0254,
            'ft': 0.3048,
            'yd': 0.9144,
            'mi': 1609.344
        }
    },
    weight: {
        units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
        toGram: {
            'mg': 0.001,
            'g': 1,
            'kg': 1000,
            'oz': 28.3495,
            'lb': 453.592,
            'ton': 1000000
        }
    },
    temperature: {
        units: ['C', 'F', 'K'],
        convert: (value, from, to) => {
            // Convert to Celsius first
            let celsius;
            if (from === 'F') celsius = (value - 32) * 5/9;
            else if (from === 'K') celsius = value - 273.15;
            else celsius = value;
            
            // Convert from Celsius to target
            if (to === 'F') return celsius * 9/5 + 32;
            else if (to === 'K') return celsius + 273.15;
            else return celsius;
        }
    },
    data: {
        units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        toByte: {
            'B': 1,
            'KB': 1024,
            'MB': 1024 ** 2,
            'GB': 1024 ** 3,
            'TB': 1024 ** 4,
            'PB': 1024 ** 5
        }
    }
};

function updateUnitOptions() {
    const category = document.getElementById('unitCategory').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    const units = unitConversions[category].units;
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units.forEach(unit => {
        fromUnit.appendChild(new Option(unit, unit));
        toUnit.appendChild(new Option(unit, unit));
    });
    
    // Set different default values
    if (units.length > 1) {
        toUnit.selectedIndex = 1;
    }
}

function convertUnits() {
    const category = document.getElementById('unitCategory').value;
    const value = parseFloat(document.getElementById('unitValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const result = document.getElementById('unitResultValue');
    
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
        
        // Convert to base unit, then to target unit
        const baseValue = value * conversion[baseUnit][fromUnit];
        convertedValue = baseValue / conversion[baseUnit][toUnit];
    }
    
    result.textContent = `${convertedValue.toLocaleString()} ${toUnit}`;
}

// =================== DATE CALCULATOR ===================

function calculateDateDifference() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const output = document.getElementById('dateResults');
    
    if (!startDate || !endDate) {
        output.innerHTML = '<div class="validation-result error">Please select both start and end dates</div>';
        return;
    }
    
    const timeDiff = Math.abs(endDate - startDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.abs((endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()));
    const yearsDiff = Math.abs(endDate.getFullYear() - startDate.getFullYear());
    
    output.innerHTML = `
        <div class="result-item">
            <label>Days:</label>
            <span class="selectable">${daysDiff}</span>
        </div>
        <div class="result-item">
            <label>Weeks:</label>
            <span class="selectable">${weeksDiff}</span>
        </div>
        <div class="result-item">
            <label>Months:</label>
            <span class="selectable">${monthsDiff}</span>
        </div>
        <div class="result-item">
            <label>Years:</label>
            <span class="selectable">${yearsDiff}</span>
        </div>
        <div class="result-item">
            <label>Hours:</label>
            <span class="selectable">${daysDiff * 24}</span>
        </div>
        <div class="result-item">
            <label>Minutes:</label>
            <span class="selectable">${daysDiff * 24 * 60}</span>
        </div>
    `;
}

function addDaysToDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const daysToAdd = parseInt(document.getElementById('daysToAdd').value) || 0;
    const output = document.getElementById('dateResults');
    
    if (!startDate) {
        output.innerHTML = '<div class="validation-result error">Please select a start date</div>';
        return;
    }
    
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    
    output.innerHTML = `
        <div class="result-item">
            <label>Result Date:</label>
            <span class="selectable">${resultDate.toLocaleDateString()}</span>
        </div>
        <div class="result-item">
            <label>ISO Format:</label>
            <span class="selectable">${resultDate.toISOString().split('T')[0]}</span>
        </div>
        <div class="result-item">
            <label>Full Date:</label>
            <span class="selectable">${resultDate.toDateString()}</span>
        </div>
    `;
}

// =================== RANDOM DATA GENERATOR ===================

function generateRandomData() {
    const dataType = document.getElementById('randomDataType').value;
    const count = parseInt(document.getElementById('randomCount').value) || 10;
    const output = document.getElementById('randomOutput');
    
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
        companies: () => {
            const prefixes = ['Global', 'Universal', 'International', 'Advanced', 'Digital', 'Smart', 'Modern', 'Future', 'Premier', 'Elite'];
            const suffixes = ['Solutions', 'Technologies', 'Systems', 'Innovations', 'Services', 'Dynamics', 'Enterprises', 'Group', 'Corp', 'Industries'];
            return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
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

function convertNumberBase() {
    const input = document.getElementById('numberInput').value.trim();
    const inputBase = parseInt(document.getElementById('inputBase').value);
    const output = document.getElementById('baseResults');
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter a number</div>';
        return;
    }
    
    try {
        // Parse the input number in the specified base
        const decimal = parseInt(input, inputBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid number for the specified base');
        }
        
        const conversions = [
            { name: 'Binary', base: 2, value: decimal.toString(2) },
            { name: 'Octal', base: 8, value: decimal.toString(8) },
            { name: 'Decimal', base: 10, value: decimal.toString(10) },
            { name: 'Hexadecimal', base: 16, value: decimal.toString(16).toUpperCase() }
        ];
        
        output.innerHTML = conversions.map(conv => `
            <div class="base-item">
                <div class="base-type">${conv.name}</div>
                <div class="base-value" onclick="Utils.copyToClipboard('${conv.value}').then(() => Utils.showCopyFeedback(this))">${conv.value}</div>
            </div>
        `).join('');
        
        // Add bit representation for small numbers
        if (decimal >= 0 && decimal < 256) {
            const bits = decimal.toString(2).padStart(8, '0');
            output.innerHTML += `
                <div class="base-item">
                    <div class="base-type">8-bit Binary</div>
                    <div class="base-value" onclick="Utils.copyToClipboard('${bits}').then(() => Utils.showCopyFeedback(this))">${bits}</div>
                </div>
            `;
        }
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">✗ ${error.message}</div>`;
    }
}

// =================== INITIALIZATION ===================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    new TabManager();
    
    // Setup auto-updating inputs
    const stringInput = document.getElementById('stringInput');
    if (stringInput) {
        stringInput.addEventListener('input', Utils.debounce(convertStringCases, 300));
        convertStringCases();
    }
    
    const textAnalysisInput = document.getElementById('textAnalysisInput');
    if (textAnalysisInput) {
        textAnalysisInput.addEventListener('input', Utils.debounce(analyzeText, 500));
    }
    
    const unixTimestamp = document.getElementById('unixTimestamp');
    if (unixTimestamp) {
        unixTimestamp.addEventListener('input', Utils.debounce(convertTimestampToDate, 300));
        convertTimestampToDate();
    }
    
    // Initialize unit converter
    updateUnitOptions();
    
    // Set default dates for date calculator
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    if (startDateInput) startDateInput.value = today;
    if (endDateInput) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        endDateInput.value = nextWeek.toISOString().split('T')[0];
    }
    
    // Setup copy functionality for selectable elements
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('selectable')) {
            const text = e.target.textContent || e.target.value;
            if (text && text.trim() !== '') {
                Utils.copyToClipboard(text).then(() => {
                    Utils.showCopyFeedback(e.target);
                }).catch(err => {
                    console.log('Could not copy text: ', err);
                });
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add initial animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.animate-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .bounce-animation {
        animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    .glow-animation {
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        to {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
    }
    
    .slide-in-animation {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.8s ease-out;
    }
    
    .slide-in-animation.visible {
        opacity: 1;
        transform: translateX(0);
    }
    
    .fade-in-delay {
        opacity: 0;
        animation: fadeIn 1s ease-out 0.5s forwards;
    }
`;
document.head.appendChild(style);