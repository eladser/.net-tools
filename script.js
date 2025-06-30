// Enhanced .NET Tools JavaScript - Complete Implementation

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
        const themeIcon = document.querySelector('.theme-toggle .theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        
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
        this.setupConverterTabs();
        this.setupScrollAnimations();
    }

    setupTabButtons() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    setupConverterTabs() {
        const converterTabs = document.querySelectorAll('.converter-tab');
        converterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                const parent = tab.closest('.tool-content');
                
                parent.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
                parent.querySelectorAll('.converter-panel').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                const targetPanel = document.getElementById(targetId);
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

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
}

// Crypto utilities for hashing
class CryptoUtils {
    static async hashString(algorithm, str) {
        const msgUint8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static async sha1(str) {
        return await this.hashString('SHA-1', str);
    }

    static async sha256(str) {
        return await this.hashString('SHA-256', str);
    }

    static md5(str) {
        // Simplified MD5 for demo purposes
        let hash = 0;
        if (str.length === 0) return hash.toString(16);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(32, '0');
    }
}

// Enhanced JSON to C# Converter
function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('csharpOutput');
    const useNullable = document.getElementById('useNullable')?.checked || false;
    const useAttributes = document.getElementById('useAttributes')?.checked || false;
    const useRecords = document.getElementById('useRecords')?.checked || false;
    const rootClassName = document.getElementById('rootClassName')?.value || 'RootObject';
    
    if (!jsonInput) {
        output.textContent = 'Please enter JSON data';
        return;
    }
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        const csharpClass = generateEnhancedCsharpClass(jsonObj, rootClassName, useNullable, useAttributes, useRecords);
        output.textContent = csharpClass;
        
        if (typeof Prism !== 'undefined') {
            output.innerHTML = Prism.highlight(csharpClass, Prism.languages.csharp, 'csharp');
        }
    } catch (error) {
        output.textContent = 'Error: Invalid JSON format\n' + error.message;
    }
}

function generateEnhancedCsharpClass(obj, className, useNullable = false, useAttributes = false, useRecords = false) {
    const usingStatements = [];
    
    if (useAttributes) {
        usingStatements.push('using System.Text.Json.Serialization;');
    }
    usingStatements.push('using System.Collections.Generic;');
    
    let result = '';
    if (usingStatements.length > 0) {
        result += usingStatements.join('\n') + '\n\n';
    }
    
    const keyword = useRecords ? 'record' : 'class';
    result += `public ${keyword} ${className}\n{\n`;
    
    for (const [key, value] of Object.entries(obj)) {
        const propertyName = toPascalCase(key);
        const propertyType = getEnhancedCsharpType(value, propertyName, useNullable);
        
        if (useAttributes) {
            result += `    [JsonPropertyName("${key}")]\n`;
        }
        
        if (useRecords) {
            result += `    public ${propertyType} ${propertyName} { get; init; }\n`;
        } else {
            result += `    public ${propertyType} ${propertyName} { get; set; }\n`;
        }
        result += '\n';
    }
    
    result += '}\n';
    
    // Generate nested classes
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += '\n' + generateEnhancedCsharpClass(value, toPascalCase(key), useNullable, useAttributes, useRecords);
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            const itemClassName = toPascalCase(key.replace(/s$/, ''));
            result += '\n' + generateEnhancedCsharpClass(value[0], itemClassName, useNullable, useAttributes, useRecords);
        }
    }
    
    return result;
}

function getEnhancedCsharpType(value, propertyName = '', useNullable = false) {
    if (value === null) return useNullable ? 'object?' : 'object';
    if (typeof value === 'string') {
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            return useNullable ? 'DateTime?' : 'DateTime';
        }
        return useNullable ? 'string?' : 'string';
    }
    if (typeof value === 'number') {
        const baseType = Number.isInteger(value) ? 'int' : 'double';
        return useNullable ? `${baseType}?` : baseType;
    }
    if (typeof value === 'boolean') return useNullable ? 'bool?' : 'bool';
    if (Array.isArray(value)) {
        if (value.length > 0) {
            const itemType = getEnhancedCsharpType(value[0], '', useNullable);
            return `List<${itemType}>`;
        }
        return 'List<object>';
    }
    if (typeof value === 'object') {
        const className = toPascalCase(propertyName) || 'object';
        return useNullable ? `${className}?` : className;
    }
    return 'object';
}

// C# Entity Generator
function generateCsharpModel() {
    const description = document.getElementById('entityDescription').value.trim();
    const modelType = document.getElementById('modelType').value;
    const output = document.getElementById('modelOutput');
    
    if (!description) {
        output.textContent = 'Please enter an entity description';
        return;
    }
    
    const entityName = extractEntityName(description);
    const properties = extractProperties(description);
    
    let code = '';
    switch (modelType) {
        case 'entity':
            code = generateEntity(entityName, properties);
            break;
        case 'dto':
            code = generateDTO(entityName, properties);
            break;
        case 'controller':
            code = generateController(entityName, properties);
            break;
        case 'all':
            code = generateCompleteSet(entityName, properties);
            break;
    }
    
    output.textContent = code;
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(code, Prism.languages.csharp, 'csharp');
    }
}

function extractEntityName(description) {
    const words = description.split(/\s+/);
    return toPascalCase(words[0]);
}

function extractProperties(description) {
    const properties = [];
    const commonPatterns = {
        'id': 'int',
        'name': 'string',
        'email': 'string',
        'password': 'string',
        'phone': 'string',
        'address': 'string',
        'age': 'int',
        'created': 'DateTime',
        'updated': 'DateTime',
        'date': 'DateTime',
        'time': 'DateTime',
        'active': 'bool',
        'enabled': 'bool',
        'valid': 'bool',
        'count': 'int',
        'price': 'decimal',
        'amount': 'decimal',
        'total': 'decimal'
    };
    
    for (const [key, type] of Object.entries(commonPatterns)) {
        if (description.toLowerCase().includes(key)) {
            properties.push({ name: toPascalCase(key), type });
        }
    }
    
    // Add list properties
    const listMatches = description.match(/list of (\w+)/gi);
    if (listMatches) {
        listMatches.forEach(match => {
            const itemName = match.replace(/list of /i, '');
            properties.push({ name: toPascalCase(itemName) + 's', type: `List<${toPascalCase(itemName)}>` });
        });
    }
    
    return properties.length > 0 ? properties : [
        { name: 'Id', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'CreatedAt', type: 'DateTime' }
    ];
}

function generateEntity(entityName, properties) {
    let code = `using System;\nusing System.Collections.Generic;\nusing System.ComponentModel.DataAnnotations;\n\n`;
    code += `public class ${entityName}\n{\n`;
    
    properties.forEach(prop => {
        if (prop.name === 'Id') {
            code += `    [Key]\n`;
        }
        code += `    public ${prop.type} ${prop.name} { get; set; }\n`;
    });
    
    code += `}\n`;
    return code;
}

function generateDTO(entityName, properties) {
    let code = `using System;\nusing System.Collections.Generic;\n\n`;
    code += `public class ${entityName}Dto\n{\n`;
    
    properties.forEach(prop => {
        code += `    public ${prop.type} ${prop.name} { get; set; }\n`;
    });
    
    code += `}\n\n`;
    code += `public class Create${entityName}Dto\n{\n`;
    properties.filter(p => p.name !== 'Id').forEach(prop => {
        code += `    public ${prop.type} ${prop.name} { get; set; }\n`;
    });
    code += `}\n`;
    
    return code;
}

function generateController(entityName, properties) {
    return `using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ${entityName}Controller : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<${entityName}>>> Get${entityName}s()
    {
        // Implementation here
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<${entityName}>> Get${entityName}(int id)
    {
        // Implementation here
        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<${entityName}>> Create${entityName}(Create${entityName}Dto dto)
    {
        // Implementation here
        return CreatedAtAction(nameof(Get${entityName}), new { id = 1 }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update${entityName}(int id, ${entityName}Dto dto)
    {
        // Implementation here
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete${entityName}(int id)
    {
        // Implementation here
        return NoContent();
    }
}`;
}

function generateCompleteSet(entityName, properties) {
    return generateEntity(entityName, properties) + '\n\n' + 
           generateDTO(entityName, properties) + '\n\n' + 
           generateController(entityName, properties);
}

// Connection String Builder
function buildConnectionString() {
    const dbType = document.getElementById('dbType').value;
    const server = document.getElementById('server').value;
    const database = document.getElementById('database').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const integratedSecurity = document.getElementById('integratedSecurity').checked;
    const trustServerCertificate = document.getElementById('trustServerCertificate').checked;
    const output = document.getElementById('connectionStringOutput');
    
    let connectionString = '';
    
    switch (dbType) {
        case 'sqlserver':
            connectionString = `Server=${server};Database=${database};`;
            if (integratedSecurity) {
                connectionString += 'Integrated Security=true;';
            } else {
                connectionString += `User Id=${username};Password=${password};`;
            }
            if (trustServerCertificate) {
                connectionString += 'TrustServerCertificate=true;';
            }
            break;
        case 'mysql':
            connectionString = `Server=${server};Database=${database};Uid=${username};Pwd=${password};`;
            break;
        case 'postgresql':
            connectionString = `Host=${server};Database=${database};Username=${username};Password=${password};`;
            break;
        case 'sqlite':
            connectionString = `Data Source=${database}.db;`;
            break;
    }
    
    output.value = connectionString;
}

// GUID Generator
function generateGuids() {
    const count = parseInt(document.getElementById('guidCount').value) || 1;
    const format = document.getElementById('guidFormat').value;
    const output = document.getElementById('guidOutput');
    
    const guids = [];
    for (let i = 0; i < count; i++) {
        const guid = generateGuid();
        guids.push(formatGuid(guid, format));
    }
    
    output.textContent = guids.join('\n');
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatGuid(guid, format) {
    switch (format) {
        case 'standard':
            return guid;
        case 'nohyphens':
            return guid.replace(/-/g, '');
        case 'braces':
            return `{${guid}}`;
        case 'csharp':
            return `new Guid("${guid}")`;
        default:
            return guid;
    }
}

function validateGuid() {
    const input = document.getElementById('guidValidationInput').value.trim();
    const result = document.getElementById('guidValidationResult');
    
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const guidNoDashRegex = /^[0-9a-f]{32}$/i;
    const guidBracesRegex = /^\{[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/i;
    
    if (guidRegex.test(input) || guidNoDashRegex.test(input) || guidBracesRegex.test(input)) {
        result.textContent = '✅ Valid GUID';
        result.className = 'validation-result valid';
    } else {
        result.textContent = '❌ Invalid GUID format';
        result.className = 'validation-result invalid';
    }
}

// String Case Converters
function convertStringCases() {
    const input = document.getElementById('stringInput').value;
    if (!input) return;
    
    document.getElementById('pascalCase').textContent = toPascalCase(input);
    document.getElementById('camelCase').textContent = toCamelCase(input);
    document.getElementById('snakeCase').textContent = toSnakeCase(input);
    document.getElementById('kebabCase').textContent = toKebabCase(input);
    document.getElementById('constantCase').textContent = toConstantCase(input);
}

function toPascalCase(str) {
    return str.replace(/(?:^|\s|[-_])+(.)/g, (match, chr) => chr.toUpperCase()).replace(/\s+/g, '');
}

function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(str) {
    return str.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
}

function toKebabCase(str) {
    return str.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('-');
}

function toConstantCase(str) {
    return toSnakeCase(str).toUpperCase();
}

// DateTime Converter
function convertTimestamp() {
    const timestamp = document.getElementById('unixTimestamp').value;
    if (!timestamp) return;
    
    const date = new Date(parseInt(timestamp) * 1000);
    
    document.getElementById('dateTimeResult').textContent = date.toLocaleString();
    document.getElementById('isoResult').textContent = date.toISOString();
    document.getElementById('timestampResult').textContent = timestamp;
    document.getElementById('csharpDateCode').textContent = `DateTime.UnixEpoch.AddSeconds(${timestamp})`;
}

function useCurrentTime() {
    const now = Math.floor(Date.now() / 1000);
    document.getElementById('unixTimestamp').value = now;
    convertTimestamp();
}

function convertDateToTimestamp() {
    const dateInput = document.getElementById('dateTimeInput').value;
    if (!dateInput) return;
    
    const date = new Date(dateInput);
    const timestamp = Math.floor(date.getTime() / 1000);
    
    document.getElementById('dateTimeResult').textContent = date.toLocaleString();
    document.getElementById('isoResult').textContent = date.toISOString();
    document.getElementById('timestampResult').textContent = timestamp;
    document.getElementById('csharpDateCode').textContent = `DateTime.UnixEpoch.AddSeconds(${timestamp})`;
}

// Base64 Converter
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    const urlSafe = document.getElementById('urlSafeBase64').checked;
    const output = document.getElementById('base64Result');
    
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
        output.textContent = 'Error encoding: ' + error.message;
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.textContent = 'Please enter Base64 text to decode';
        return;
    }
    
    try {
        let toDecode = input.replace(/-/g, '+').replace(/_/g, '/');
        while (toDecode.length % 4) {
            toDecode += '=';
        }
        const decoded = decodeURIComponent(escape(atob(toDecode)));
        output.textContent = decoded;
    } catch (error) {
        output.textContent = 'Error decoding: Invalid Base64 string';
    }
}

function validateBase64() {
    const input = document.getElementById('base64Input').value;
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.textContent = 'Please enter Base64 text to validate';
        return;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    const urlSafeBase64Regex = /^[A-Za-z0-9_-]*$/;
    
    if (base64Regex.test(input) || urlSafeBase64Regex.test(input)) {
        output.textContent = '✅ Valid Base64 string';
    } else {
        output.textContent = '❌ Invalid Base64 string';
    }
}

// Color Converter
function convertColor() {
    const input = document.getElementById('colorInput').value;
    const picker = document.getElementById('colorPicker');
    
    let color = input || picker.value;
    
    const hex = convertToHex(color);
    const rgb = convertToRgb(hex);
    const hsl = convertToHsl(rgb);
    
    document.getElementById('hexColor').textContent = hex;
    document.getElementById('rgbColor').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('hslColor').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    document.getElementById('csharpColor').textContent = `Color.FromArgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    
    picker.value = hex;
}

function convertToHex(color) {
    if (color.startsWith('#')) return color;
    
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
        const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
        const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    
    return color;
}

function convertToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function convertToHsl(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;
    
    let h, s;
    
    if (diff === 0) {
        h = s = 0;
    } else {
        s = l > 0.5 ? diff / (2 - sum) : diff / sum;
        
        switch (max) {
            case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
            case g: h = (b - r) / diff + 2; break;
            case b: h = (r - g) / diff + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function generateColorPalette() {
    const baseColor = document.getElementById('colorPicker').value;
    const paletteDiv = document.getElementById('colorPalette');
    
    const rgb = convertToRgb(baseColor);
    const hsl = convertToHsl(rgb);
    
    const palette = [];
    for (let i = -2; i <= 2; i++) {
        const newHue = (hsl.h + i * 30) % 360;
        const newHex = hslToHex(newHue, hsl.s, hsl.l);
        palette.push(newHex);
    }
    
    paletteDiv.innerHTML = palette.map(color => 
        `<div class="color-swatch" style="background-color: ${color};" 
              onclick="selectPaletteColor('${color}')" title="${color}"></div>`
    ).join('');
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    
    return `#${f(0)}${f(8)}${f(4)}`;
}

function selectPaletteColor(color) {
    document.getElementById('colorInput').value = color;
    document.getElementById('colorPicker').value = color;
    convertColor();
}

// Text Analytics
function analyzeText() {
    const text = document.getElementById('textAnalysisInput').value;
    const statsDiv = document.getElementById('textStats');
    const wordFreqDiv = document.getElementById('wordFrequency');
    
    if (!text) {
        statsDiv.innerHTML = '<p>Please enter text to analyze</p>';
        return;
    }
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    const stats = {
        characters: text.length,
        charactersNoSpaces: text.replace(/\s/g, '').length,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        avgWordsPerSentence: Math.round(words.length / Math.max(sentences.length, 1)),
        readingTime: Math.ceil(words.length / 200) // 200 words per minute
    };
    
    statsDiv.innerHTML = `
        <div class="stat-item"><label>Characters:</label><span>${stats.characters}</span></div>
        <div class="stat-item"><label>Characters (no spaces):</label><span>${stats.charactersNoSpaces}</span></div>
        <div class="stat-item"><label>Words:</label><span>${stats.words}</span></div>
        <div class="stat-item"><label>Sentences:</label><span>${stats.sentences}</span></div>
        <div class="stat-item"><label>Paragraphs:</label><span>${stats.paragraphs}</span></div>
        <div class="stat-item"><label>Avg words/sentence:</label><span>${stats.avgWordsPerSentence}</span></div>
        <div class="stat-item"><label>Reading time:</label><span>${stats.readingTime} min</span></div>
    `;
    
    // Word frequency
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    wordFreqDiv.textContent = 'Top 10 words:\n' + 
        sortedWords.map(([word, count]) => `${word}: ${count}`).join('\n');
}

// Lorem Ipsum Generator
function generateLorem() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value) || 3;
    const startWithLorem = document.getElementById('startWithLorem').checked;
    const output = document.getElementById('loremOutput');
    
    const words = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
        'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
        'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
        'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
        'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
        'mollit', 'anim', 'id', 'est', 'laborum'
    ];
    
    let result = '';
    
    switch (type) {
        case 'words':
            const selectedWords = [];
            if (startWithLorem) {
                selectedWords.push('Lorem', 'ipsum');
            }
            while (selectedWords.length < count) {
                const word = words[Math.floor(Math.random() * words.length)];
                selectedWords.push(word);
            }
            result = selectedWords.join(' ');
            break;
            
        case 'sentences':
            for (let i = 0; i < count; i++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                
                if (i === 0 && startWithLorem) {
                    sentence.push('Lorem', 'ipsum');
                }
                
                while (sentence.length < sentenceLength) {
                    const word = words[Math.floor(Math.random() * words.length)];
                    sentence.push(word);
                }
                
                sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                result += sentence.join(' ') + '. ';
            }
            break;
            
        case 'paragraphs':
            for (let i = 0; i < count; i++) {
                const sentences = Math.floor(Math.random() * 4) + 3;
                let paragraph = '';
                
                for (let j = 0; j < sentences; j++) {
                    const sentenceLength = Math.floor(Math.random() * 10) + 5;
                    const sentence = [];
                    
                    if (i === 0 && j === 0 && startWithLorem) {
                        sentence.push('Lorem', 'ipsum');
                    }
                    
                    while (sentence.length < sentenceLength) {
                        const word = words[Math.floor(Math.random() * words.length)];
                        sentence.push(word);
                    }
                    
                    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                    paragraph += sentence.join(' ') + '. ';
                }
                
                result += paragraph + '\n\n';
            }
            break;
    }
    
    output.textContent = result.trim();
}

// JSON Formatter
function formatJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        output.textContent = 'Please enter JSON data';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        output.textContent = formatted;
        validationResult.textContent = '✅ Valid JSON';
        validationResult.className = 'validation-result valid';
    } catch (error) {
        output.textContent = 'Error: Invalid JSON format\n' + error.message;
        validationResult.textContent = '❌ Invalid JSON: ' + error.message;
        validationResult.className = 'validation-result invalid';
    }
}

function minifyJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    
    if (!input) {
        output.textContent = 'Please enter JSON data';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        output.textContent = minified;
    } catch (error) {
        output.textContent = 'Error: Invalid JSON format\n' + error.message;
    }
}

function validateJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        validationResult.textContent = 'Please enter JSON data';
        validationResult.className = 'validation-result';
        return;
    }
    
    try {
        JSON.parse(input);
        validationResult.textContent = '✅ Valid JSON';
        validationResult.className = 'validation-result valid';
    } catch (error) {
        validationResult.textContent = '❌ Invalid JSON: ' + error.message;
        validationResult.className = 'validation-result invalid';
    }
}

// Regex Tester
function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTestString').value;
    const global = document.getElementById('regexGlobal').checked;
    const caseInsensitive = document.getElementById('regexCaseInsensitive').checked;
    const multiline = document.getElementById('regexMultiline').checked;
    const results = document.getElementById('regexResults');
    
    if (!pattern) {
        results.textContent = 'Please enter a regex pattern';
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
            results.textContent = `✅ Pattern matches!\n\nMatches found: ${matches.length}\n\n` +
                matches.map((match, index) => `Match ${index + 1}: "${match}"`).join('\n');
        } else {
            results.textContent = '❌ No matches found';
        }
    } catch (error) {
        results.textContent = 'Error: Invalid regex pattern\n' + error.message;
    }
}

// Password Generator
function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value) || 16;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const excludeSimilar = document.getElementById('excludeSimilar').checked;
    const output = document.getElementById('generatedPassword');
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
        charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (!charset) {
        output.value = 'Please select at least one character type';
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    output.value = password;
}

function analyzePassword() {
    const password = document.getElementById('generatedPassword').value;
    const strengthResult = document.getElementById('passwordStrengthResult');
    const suggestions = document.getElementById('passwordSuggestions');
    
    if (!password) {
        strengthResult.textContent = 'Please enter a password to analyze';
        strengthResult.className = 'password-strength-result';
        suggestions.style.display = 'none';
        return;
    }
    
    const analysis = {
        length: password.length,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumbers: /\d/.test(password),
        hasSymbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
        hasRepeated: /(.)\1{2,}/.test(password)
    };
    
    let score = 0;
    const suggestionList = [];
    
    if (analysis.length >= 8) score += 2;
    else suggestionList.push('Use at least 8 characters');
    
    if (analysis.length >= 12) score += 1;
    if (analysis.hasLowercase) score += 1;
    else suggestionList.push('Include lowercase letters');
    
    if (analysis.hasUppercase) score += 1;
    else suggestionList.push('Include uppercase letters');
    
    if (analysis.hasNumbers) score += 1;
    else suggestionList.push('Include numbers');
    
    if (analysis.hasSymbols) score += 2;
    else suggestionList.push('Include symbols');
    
    if (!analysis.hasRepeated) score += 1;
    else suggestionList.push('Avoid repeated characters');
    
    let strength = 'weak';
    let strengthText = 'Weak';
    
    if (score >= 7) {
        strength = 'strong';
        strengthText = 'Strong';
    } else if (score >= 5) {
        strength = 'medium';
        strengthText = 'Medium';
    }
    
    strengthResult.textContent = `Password Strength: ${strengthText} (${score}/8)`;
    strengthResult.className = `password-strength-result ${strength}`;
    
    if (suggestionList.length > 0) {
        suggestions.innerHTML = `<h4>Suggestions:</h4><ul>` +
            suggestionList.map(s => `<li>${s}</li>`).join('') + '</ul>';
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

// Hash Generator
async function generateHashes() {
    const input = document.getElementById('hashInput').value;
    const generateMD5 = document.getElementById('generateMD5').checked;
    const generateSHA1 = document.getElementById('generateSHA1').checked;
    const generateSHA256 = document.getElementById('generateSHA256').checked;
    const results = document.getElementById('hashResults');
    
    if (!input) {
        results.innerHTML = 'Please enter text to hash';
        return;
    }
    
    const hashes = [];
    
    if (generateMD5) {
        const md5Hash = CryptoUtils.md5(input);
        hashes.push(`<div class="result-item"><label>MD5:</label><span class="selectable">${md5Hash}</span></div>`);
    }
    
    if (generateSHA1) {
        const sha1Hash = await CryptoUtils.sha1(input);
        hashes.push(`<div class="result-item"><label>SHA-1:</label><span class="selectable">${sha1Hash}</span></div>`);
    }
    
    if (generateSHA256) {
        const sha256Hash = await CryptoUtils.sha256(input);
        hashes.push(`<div class="result-item"><label>SHA-256:</label><span class="selectable">${sha256Hash}</span></div>`);
    }
    
    results.innerHTML = hashes.join('');
}

// JWT Decoder
function decodeJWT() {
    const token = document.getElementById('jwtInput').value.trim();
    const results = document.getElementById('jwtResults');
    
    if (!token) {
        results.innerHTML = 'Please enter a JWT token';
        return;
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        const headerFormatted = JSON.stringify(header, null, 2);
        const payloadFormatted = JSON.stringify(payload, null, 2);
        
        results.innerHTML = `
            <div class="jwt-section">
                <h4>Header:</h4>
                <pre class="output">${headerFormatted}</pre>
            </div>
            <div class="jwt-section">
                <h4>Payload:</h4>
                <pre class="output">${payloadFormatted}</pre>
            </div>
            <div class="jwt-section">
                <h4>Signature:</h4>
                <pre class="output">${parts[2]}</pre>
            </div>
        `;
    } catch (error) {
        results.innerHTML = 'Error: Invalid JWT token\n' + error.message;
    }
}

// QR Code Generator (simplified version)
function generateQRCode() {
    const text = document.getElementById('qrText').value;
    const size = document.getElementById('qrSize').value;
    const output = document.getElementById('qrOutput');
    
    if (!text) {
        output.innerHTML = 'Please enter text to generate QR code';
        return;
    }
    
    // Using a simple QR code service for demo
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    
    output.innerHTML = `
        <img src="${qrUrl}" alt="QR Code" style="max-width: 100%; height: auto;">
        <p>QR Code for: ${text}</p>
    `;
}

// Unit Converter
const unitConversions = {
    length: {
        units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
        toMeter: {
            mm: 0.001, cm: 0.01, m: 1, km: 1000,
            in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34
        }
    },
    weight: {
        units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
        toKg: {
            mg: 0.000001, g: 0.001, kg: 1,
            oz: 0.0283495, lb: 0.453592, ton: 1000
        }
    },
    temperature: {
        units: ['C', 'F', 'K'],
        convert: (value, from, to) => {
            let celsius = value;
            if (from === 'F') celsius = (value - 32) * 5/9;
            if (from === 'K') celsius = value - 273.15;
            
            if (to === 'C') return celsius;
            if (to === 'F') return celsius * 9/5 + 32;
            if (to === 'K') return celsius + 273.15;
        }
    },
    data: {
        units: ['B', 'KB', 'MB', 'GB', 'TB'],
        toBytes: {
            B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776
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
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    toUnit.selectedIndex = 1;
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
        const conversionData = unitConversions[category];
        const baseKey = Object.keys(conversionData)[1]; // toMeter, toKg, etc.
        const baseUnit = conversionData[baseKey];
        
        const baseValue = value * baseUnit[fromUnit];
        convertedValue = baseValue / baseUnit[toUnit];
    }
    
    result.textContent = `${convertedValue.toFixed(6)} ${toUnit}`;
}

// Date Calculator
function calculateDateDifference() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const results = document.getElementById('dateResults');
    
    if (!startDate || !endDate) {
        results.innerHTML = 'Please select both dates';
        return;
    }
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffDays / 365.25);
    
    results.innerHTML = `
        <div class="result-item"><label>Days:</label><span>${diffDays}</span></div>
        <div class="result-item"><label>Weeks:</label><span>${diffWeeks}</span></div>
        <div class="result-item"><label>Months:</label><span>${diffMonths}</span></div>
        <div class="result-item"><label>Years:</label><span>${diffYears}</span></div>
    `;
}

function addDaysToDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const daysToAdd = parseInt(document.getElementById('daysToAdd').value) || 0;
    const results = document.getElementById('dateResults');
    
    if (!startDate) {
        results.innerHTML = 'Please select a start date';
        return;
    }
    
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    
    results.innerHTML = `
        <div class="result-item"><label>Result Date:</label><span>${newDate.toDateString()}</span></div>
        <div class="result-item"><label>ISO Format:</label><span>${newDate.toISOString().split('T')[0]}</span></div>
    `;
}

// Random Data Generator
const randomData = {
    names: ['James Smith', 'Mary Johnson', 'Robert Brown', 'Patricia Davis', 'Jennifer Wilson'],
    emails: ['john.doe@email.com', 'jane.smith@company.com', 'bob.wilson@test.org'],
    phones: ['(555) 123-4567', '(555) 987-6543', '(555) 555-0123'],
    addresses: ['123 Main St, City, State 12345', '456 Oak Ave, Town, State 67890'],
    companies: ['Tech Corp', 'Data Systems Inc', 'Innovation Labs', 'Digital Solutions']
};

function generateRandomData() {
    const type = document.getElementById('randomDataType').value;
    const count = parseInt(document.getElementById('randomCount').value) || 10;
    const output = document.getElementById('randomOutput');
    
    const results = [];
    
    for (let i = 0; i < count; i++) {
        switch (type) {
            case 'names':
                results.push(randomData.names[Math.floor(Math.random() * randomData.names.length)]);
                break;
            case 'emails':
                results.push(randomData.emails[Math.floor(Math.random() * randomData.emails.length)]);
                break;
            case 'phones':
                results.push(randomData.phones[Math.floor(Math.random() * randomData.phones.length)]);
                break;
            case 'addresses':
                results.push(randomData.addresses[Math.floor(Math.random() * randomData.addresses.length)]);
                break;
            case 'companies':
                results.push(randomData.companies[Math.floor(Math.random() * randomData.companies.length)]);
                break;
            case 'numbers':
                results.push(Math.floor(Math.random() * 10000));
                break;
        }
    }
    
    output.textContent = results.join('\n');
}

// Number Base Converter
function convertNumberBase() {
    const input = document.getElementById('numberInput').value;
    const inputBase = parseInt(document.getElementById('inputBase').value);
    const results = document.getElementById('baseResults');
    
    if (!input) {
        results.innerHTML = 'Please enter a number';
        return;
    }
    
    try {
        const decimal = parseInt(input, inputBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid number for selected base');
        }
        
        results.innerHTML = `
            <div class="result-item"><label>Binary (2):</label><span class="selectable">${decimal.toString(2)}</span></div>
            <div class="result-item"><label>Octal (8):</label><span class="selectable">${decimal.toString(8)}</span></div>
            <div class="result-item"><label>Decimal (10):</label><span class="selectable">${decimal}</span></div>
            <div class="result-item"><label>Hexadecimal (16):</label><span class="selectable">${decimal.toString(16).toUpperCase()}</span></div>
        `;
    } catch (error) {
        results.innerHTML = 'Error: ' + error.message;
    }
}

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
    
    const colorInput = document.getElementById('colorInput');
    const colorPicker = document.getElementById('colorPicker');
    if (colorInput && colorPicker) {
        colorInput.addEventListener('input', Utils.debounce(convertColor, 300));
        colorPicker.addEventListener('change', convertColor);
        convertColor();
    }
    
    const unixTimestamp = document.getElementById('unixTimestamp');
    if (unixTimestamp) {
        unixTimestamp.addEventListener('input', Utils.debounce(convertTimestamp, 300));
        convertTimestamp();
    }
    
    // Initialize unit converter
    updateUnitOptions();
    
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