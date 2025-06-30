// Enhanced .NET Tools JavaScript with Dark/Light Mode and New Features

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-toggle .theme-icon') || document.querySelector('.theme-toggle');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Tab Management
class TabManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabButtons();
        this.setupScrollAnimations();
    }

    setupTabButtons() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Utility Functions
class Utils {
    static copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }

    static showCopyFeedback(element) {
        const original = element.style.background;
        const originalColor = element.style.color;
        element.style.background = 'var(--success-color)';
        element.style.color = 'white';
        element.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            element.style.background = original;
            element.style.color = originalColor;
            element.style.transform = '';
        }, 200);
    }

    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Crypto utilities for hashing (browser-compatible)
class CryptoUtils {
    static async hashString(algorithm, str) {
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static async md5(str) {
        // MD5 implementation since it's not natively supported
        return this.simpleMD5(str);
    }

    static simpleMD5(str) {
        // Simple MD5 implementation for demo purposes
        const md5 = require('crypto-js/md5');
        return md5(str).toString();
    }

    static async sha1(str) {
        return await this.hashString('SHA-1', str);
    }

    static async sha256(str) {
        return await this.hashString('SHA-256', str);
    }
}

// JSON to C# Converter
function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('csharpOutput');
    
    if (!jsonInput) {
        output.textContent = 'Please enter JSON data';
        return;
    }
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        const csharpClass = generateCsharpClass(jsonObj, 'RootObject');
        output.textContent = csharpClass;
        
        // Add syntax highlighting if Prism is available
        if (typeof Prism !== 'undefined') {
            output.innerHTML = Prism.highlight(csharpClass, Prism.languages.csharp, 'csharp');
        }
    } catch (error) {
        output.textContent = 'Error: Invalid JSON format\n' + error.message;
    }
}

function generateCsharpClass(obj, className) {
    let result = `public class ${className}\n{\n`;
    
    for (const [key, value] of Object.entries(obj)) {
        const propertyName = toPascalCase(key);
        const propertyType = getCsharpType(value, propertyName);
        
        result += `    public ${propertyType} ${propertyName} { get; set; }\n`;
    }
    
    result += '}\n';
    
    // Generate nested classes
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += '\n' + generateCsharpClass(value, toPascalCase(key));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            result += '\n' + generateCsharpClass(value[0], toPascalCase(key.replace(/s$/, '')));
        }
    }
    
    return result;
}

function getCsharpType(value, propertyName = '') {
    if (value === null) return 'object';
    if (typeof value === 'string') {
        // Check if it looks like a DateTime
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            return 'DateTime';
        }
        return 'string';
    }
    if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'double';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
        if (value.length > 0) {
            const itemType = getCsharpType(value[0]);
            return `List<${itemType}>`;
        }
        return 'List<object>';
    }
    if (typeof value === 'object') {
        return toPascalCase(propertyName) || 'object';
    }
    return 'object';
}

// String Case Converters
function convertStringCases() {
    const input = document.getElementById('stringInput').value;
    
    document.getElementById('pascalCase').textContent = toPascalCase(input);
    document.getElementById('camelCase').textContent = toCamelCase(input);
    document.getElementById('snakeCase').textContent = toSnakeCase(input);
    document.getElementById('kebabCase').textContent = toKebabCase(input);
}

function toPascalCase(str) {
    return str.replace(/(?:^|\s|[-_])+(.)/g, (match, chr) => chr.toUpperCase()).replace(/\s+/g, '');
}

function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(str) {
    return str
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
}

function toKebabCase(str) {
    return str
        .replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
}

// GUID Generator
function generateGuid() {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    
    document.getElementById('guidStandard').textContent = guid;
    document.getElementById('guidNoHyphens').textContent = guid.replace(/-/g, '');
    document.getElementById('guidUppercase').textContent = guid.toUpperCase();
    document.getElementById('guidCsharp').textContent = `new Guid("${guid}")`;
}

// Password Generator
function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
        document.getElementById('generatedPassword').textContent = 'Please select at least one character type.';
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generatedPassword').textContent = password;
}

// Unix Timestamp Converter
function convertTimestamp() {
    const timestamp = document.getElementById('unixTimestamp').value;
    
    if (!timestamp) {
        clearTimestampResults();
        return;
    }
    
    try {
        const date = new Date(parseInt(timestamp) * 1000);
        
        document.getElementById('dateTimeResult').textContent = date.toLocaleString();
        document.getElementById('isoResult').textContent = date.toISOString();
        document.getElementById('csharpDateCode').textContent = 
            `DateTimeOffset.FromUnixTimeSeconds(${timestamp}).DateTime`;
    } catch (error) {
        clearTimestampResults();
        document.getElementById('dateTimeResult').textContent = 'Invalid timestamp';
    }
}

function useCurrentTime() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    document.getElementById('unixTimestamp').value = currentTimestamp;
    convertTimestamp();
}

function clearTimestampResults() {
    document.getElementById('dateTimeResult').textContent = '';
    document.getElementById('isoResult').textContent = '';
    document.getElementById('csharpDateCode').textContent = '';
}

// Base64 Encoder/Decoder
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    const result = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('base64Result').textContent = result;
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    try {
        const result = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64Result').textContent = result;
    } catch (error) {
        document.getElementById('base64Result').textContent = 'Invalid Base64 string';
    }
}

// Connection String Builder
function buildConnectionString() {
    const server = document.getElementById('serverName').value || 'localhost';
    const database = document.getElementById('databaseName').value || 'MyDatabase';
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const integratedSecurity = document.getElementById('integratedSecurity').checked;
    
    let connectionString = `Server=${server};Database=${database};`;
    
    if (integratedSecurity) {
        connectionString += 'Integrated Security=true;';
    } else if (username) {
        connectionString += `User Id=${username};`;
        if (password) {
            connectionString += `Password=${password};`;
        }
    }
    
    connectionString += 'TrustServerCertificate=true;';
    
    document.getElementById('connectionStringResult').textContent = connectionString;
}

// Lorem Ipsum Generator
function generateLoremIpsum() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value);
    
    const words = [
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
    
    if (type === 'words') {
        const selectedWords = [];
        for (let i = 0; i < count; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        result = selectedWords.join(' ');
    } else if (type === 'sentences') {
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5;
            const sentence = [];
            for (let j = 0; j < sentenceLength; j++) {
                sentence.push(words[Math.floor(Math.random() * words.length)]);
            }
            result += sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '. ';
        }
    } else if (type === 'paragraphs') {
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            let paragraph = '';
            for (let j = 0; j < sentenceCount; j++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                for (let k = 0; k < sentenceLength; k++) {
                    sentence.push(words[Math.floor(Math.random() * words.length)]);
                }
                paragraph += sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1) + '. ';
            }
            result += paragraph + '\n\n';
        }
    }
    
    document.getElementById('loremResult').value = result.trim();
}

// Regex Tester
function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTestString').value;
    const resultsDiv = document.getElementById('regexResults');
    
    if (!pattern) {
        resultsDiv.textContent = 'Please enter a regex pattern';
        return;
    }
    
    try {
        const regex = new RegExp(pattern, 'gm');
        const matches = [...testString.matchAll(regex)];
        
        if (matches.length === 0) {
            resultsDiv.textContent = 'No matches found.';
            return;
        }
        
        let result = `Found ${matches.length} match${matches.length === 1 ? '' : 'es'}:\n\n`;
        
        matches.forEach((match, index) => {
            result += `Match ${index + 1}: "${match[0]}"\n`;
            if (match.groups) {
                Object.entries(match.groups).forEach(([groupName, groupValue]) => {
                    result += `  Group "${groupName}": "${groupValue}"\n`;
                });
            }
            result += `  Position: ${match.index}\n\n`;
        });
        
        resultsDiv.textContent = result;
    } catch (error) {
        resultsDiv.textContent = 'Error: Invalid regex pattern\n' + error.message;
    }
}

// Email Validator
function validateEmail() {
    const email = document.getElementById('emailInput').value;
    const resultDiv = document.getElementById('emailResult');
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    
    resultDiv.className = `validation-result ${isValid ? 'valid' : 'invalid'}`;
    resultDiv.textContent = isValid ? 
        `✅ Valid email address` : 
        `❌ Invalid email format`;
}

// Phone Validator
function validatePhone() {
    const phone = document.getElementById('phoneInput').value;
    const format = document.getElementById('phoneFormat').value;
    const resultDiv = document.getElementById('phoneResult');
    
    let regex;
    let formatName;
    
    switch (format) {
        case 'us':
            regex = /^(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
            formatName = 'US';
            break;
        case 'international':
            regex = /^\+[1-9]\d{1,14}$/;
            formatName = 'International';
            break;
        case 'uk':
            regex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
            formatName = 'UK';
            break;
        default:
            regex = /^\+?[\d\s\-\(\)]+$/;
            formatName = 'General';
    }
    
    const isValid = regex.test(phone);
    
    resultDiv.className = `validation-result ${isValid ? 'valid' : 'invalid'}`;
    resultDiv.textContent = isValid ? 
        `✅ Valid ${formatName} phone number` : 
        `❌ Invalid ${formatName} phone format`;
}

// URL Validator
function validateUrl() {
    const url = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('urlResult');
    
    try {
        new URL(url);
        resultDiv.className = 'validation-result valid';
        resultDiv.textContent = '✅ Valid URL format';
    } catch {
        resultDiv.className = 'validation-result invalid';
        resultDiv.textContent = '❌ Invalid URL format';
    }
}

// JSON Formatter
function formatJson() {
    const input = document.getElementById('jsonFormatterInput').value;
    const output = document.getElementById('jsonFormatterOutput');
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        output.textContent = formatted;
        
        if (typeof Prism !== 'undefined') {
            output.innerHTML = Prism.highlight(formatted, Prism.languages.json, 'json');
        }
    } catch (error) {
        output.textContent = 'Error: Invalid JSON\n' + error.message;
    }
}

function minifyJson() {
    const input = document.getElementById('jsonFormatterInput').value;
    const output = document.getElementById('jsonFormatterOutput');
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        output.textContent = minified;
    } catch (error) {
        output.textContent = 'Error: Invalid JSON\n' + error.message;
    }
}

// XML Formatter
function formatXml() {
    const input = document.getElementById('xmlFormatterInput').value;
    const output = document.getElementById('xmlFormatterOutput');
    
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, 'text/xml');
        
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid XML');
        }
        
        const formatted = formatXmlString(input);
        output.textContent = formatted;
    } catch (error) {
        output.textContent = 'Error: Invalid XML\n' + error.message;
    }
}

function formatXmlString(xml) {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    
    return formatted.split('\r\n').map(line => {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (line.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        }
        
        const padding = PADDING.repeat(pad);
        pad += indent;
        return padding + line;
    }).join('\n');
}

// SQL Formatter
function formatSql() {
    const input = document.getElementById('sqlFormatterInput').value;
    const output = document.getElementById('sqlFormatterOutput');
    
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
        'FULL JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE',
        'DELETE', 'CREATE', 'ALTER', 'DROP', 'INDEX', 'TABLE', 'DATABASE'
    ];
    
    let formatted = input.toUpperCase();
    
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
    });
    
    // Clean up extra newlines and indentation
    formatted = formatted
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index) => {
            if (line.startsWith('SELECT') || line.startsWith('FROM') || 
                line.startsWith('WHERE') || line.startsWith('GROUP BY') || 
                line.startsWith('ORDER BY')) {
                return line;
            }
            return '    ' + line;
        })
        .join('\n');
    
    output.textContent = formatted;
}

// CSS Formatter
function formatCss() {
    const input = document.getElementById('cssFormatterInput').value;
    const output = document.getElementById('cssFormatterOutput');
    
    let formatted = input
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .replace(/,/g, ',\n')
        .split('\n')
        .map(line => {
            line = line.trim();
            if (line.endsWith('{') || line.endsWith('}')) {
                return line;
            }
            if (line.length > 0 && !line.endsWith('}')) {
                return '    ' + line;
            }
            return line;
        })
        .filter(line => line.length > 0)
        .join('\n');
    
    output.textContent = formatted;
}

function minifyCss() {
    const input = document.getElementById('cssFormatterInput').value;
    const output = document.getElementById('cssFormatterOutput');
    
    const minified = input
        .replace(/\s+/g, ' ')
        .replace(/\s*\{\s*/g, '{')
        .replace(/\s*\}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*:\s*/g, ':')
        .trim();
    
    output.textContent = minified;
}

// Hash Generator
async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    
    if (!input) {
        return;
    }
    
    try {
        // Simple hash functions for demo (in real app, you'd use proper crypto libraries)
        const md5Hash = await hashMD5(input);
        const sha1Hash = await CryptoUtils.sha1(input);
        const sha256Hash = await CryptoUtils.sha256(input);
        
        document.getElementById('md5Hash').textContent = md5Hash;
        document.getElementById('sha1Hash').textContent = sha1Hash;
        document.getElementById('sha256Hash').textContent = sha256Hash;
    } catch (error) {
        console.error('Error generating hashes:', error);
    }
}

// Simple MD5 hash (demo implementation - use proper crypto library in production)
async function hashMD5(str) {
    // This is a simplified hash for demo purposes
    let hash = 0;
    if (str.length === 0) return hash.toString(16);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32);
}

// Color Converter
function convertColor() {
    const colorInput = document.getElementById('colorInput').value;
    const colorPicker = document.getElementById('colorPicker');
    
    let color = colorInput || colorPicker.value;
    
    try {
        // Convert to RGB
        let rgb = hexToRgb(color);
        if (!rgb && color.includes('rgb')) {
            rgb = parseRgb(color);
        }
        
        if (rgb) {
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            document.getElementById('hexColor').textContent = hex;
            document.getElementById('rgbColor').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            document.getElementById('hslColor').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            
            colorPicker.value = hex;
        }
    } catch (error) {
        console.error('Color conversion error:', error);
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function parseRgb(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return match ? {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
    } : null;
}

// Unit Converter
function convertUnits() {
    const value = parseFloat(document.getElementById('unitValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (isNaN(value)) {
        document.getElementById('unitResult').textContent = 'Please enter a valid number';
        return;
    }
    
    // Convert to bytes first
    let bytes = value;
    switch (fromUnit) {
        case 'kb': bytes *= 1024; break;
        case 'mb': bytes *= 1024 * 1024; break;
        case 'gb': bytes *= 1024 * 1024 * 1024; break;
    }
    
    // Convert from bytes to target unit
    let result = bytes;
    switch (toUnit) {
        case 'kb': result /= 1024; break;
        case 'mb': result /= 1024 * 1024; break;
        case 'gb': result /= 1024 * 1024 * 1024; break;
    }
    
    document.getElementById('unitResult').textContent = 
        `${result.toLocaleString()} ${toUnit.toUpperCase()}`;
}

// Text Tools
function updateTextStats() {
    const text = document.getElementById('textToolsInput').value;
    
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = 
        text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('lineCount').textContent = 
        text.split('\n').length;
}

function textToUpperCase() {
    const input = document.getElementById('textToolsInput');
    input.value = input.value.toUpperCase();
    updateTextStats();
}

function textToLowerCase() {
    const input = document.getElementById('textToolsInput');
    input.value = input.value.toLowerCase();
    updateTextStats();
}

function textToTitleCase() {
    const input = document.getElementById('textToolsInput');
    input.value = input.value.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    updateTextStats();
}

function reverseText() {
    const input = document.getElementById('textToolsInput');
    input.value = input.value.split('').reverse().join('');
    updateTextStats();
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme and tab management
    new ThemeManager();
    new TabManager();
    
    // Setup auto-updating inputs
    const stringInput = document.getElementById('stringInput');
    if (stringInput) {
        stringInput.addEventListener('input', Utils.debounce(convertStringCases, 300));
        convertStringCases(); // Initialize
    }
    
    const unixTimestamp = document.getElementById('unixTimestamp');
    if (unixTimestamp) {
        unixTimestamp.addEventListener('input', Utils.debounce(convertTimestamp, 300));
        convertTimestamp(); // Initialize
    }
    
    const colorInputs = ['colorInput', 'colorPicker'];
    colorInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', Utils.debounce(convertColor, 300));
        }
    });
    
    const textToolsInput = document.getElementById('textToolsInput');
    if (textToolsInput) {
        textToolsInput.addEventListener('input', Utils.debounce(updateTextStats, 300));
        updateTextStats(); // Initialize
    }
    
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.addEventListener('input', Utils.debounce(validateEmail, 300));
    }
    
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', Utils.debounce(validatePhone, 300));
    }
    
    const urlInputValidator = document.getElementById('urlInput');
    if (urlInputValidator) {
        urlInputValidator.addEventListener('input', Utils.debounce(validateUrl, 300));
    }
    
    const hashInput = document.getElementById('hashInput');
    if (hashInput) {
        hashInput.addEventListener('input', Utils.debounce(generateHashes, 500));
    }
    
    // Initialize tools
    generateGuid();
    generatePassword();
    convertColor();
    
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
});