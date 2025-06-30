// Complete JavaScript implementation for .NET Tools
// All tools and functionality implemented

// Utility functions
class Utils {
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                console.error('Failed to copy: ', err);
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    static showCopyFeedback(element) {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        element.style.background = 'var(--success-color)';
        element.style.color = 'white';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.background = '';
            element.style.color = '';
        }, 1000);
    }

    static formatCode(code, language = 'csharp') {
        return `<pre><code class="language-${language}">${code}</code></pre>`;
    }

    static toPascalCase(str) {
        return str.replace(/(?:^|\s)\w/g, match => match.toUpperCase()).replace(/\s+/g, '');
    }

    static toCamelCase(str) {
        const pascal = Utils.toPascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }

    static toSnakeCase(str) {
        return str.replace(/(?<!^)(?=[A-Z])/g, '_').toLowerCase().replace(/\s+/g, '_');
    }

    static toKebabCase(str) {
        return str.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase().replace(/\s+/g, '-');
    }

    static toConstantCase(str) {
        return Utils.toSnakeCase(str).toUpperCase();
    }

    static generateRandomString(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeTheme();
    initializeNavigation();
    initializeTabs();
    initializeTools();
    initializeAnimations();
    initializeEventListeners();
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        }
    });
}

// Navigation Management
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    mobileMenuToggle?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('open');
    });
    
    mobileMenuClose?.addEventListener('click', () => {
        mobileMenu?.classList.remove('open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('open') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuToggle?.contains(e.target)) {
            mobileMenu.classList.remove('open');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu
                mobileMenu?.classList.remove('open');
            }
        });
    });
}

// Tab System
function initializeTabs() {
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
    
    // Initialize converter tabs
    const converterTabs = document.querySelectorAll('.converter-tab');
    converterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            const parent = tab.closest('.tool-content');
            
            if (parent) {
                parent.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
                parent.querySelectorAll('.converter-panel').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                const targetPanel = parent.querySelector(`#${target}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            }
        });
    });
}

// Animation Initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
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
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .slide-in-animation').forEach(el => {
        observer.observe(el);
    });
}

// Tool Initialization
function initializeTools() {
    // Initialize case converter
    const stringInput = document.getElementById('stringInput');
    if (stringInput) {
        stringInput.addEventListener('input', updateCaseConversions);
        updateCaseConversions(); // Initial update
    }
    
    // Initialize color converter
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            colorInput.value = e.target.value;
            updateColorConversions();
        });
    }
    
    if (colorInput) {
        colorInput.addEventListener('input', updateColorConversions);
        updateColorConversions(); // Initial update
    }
    
    // Initialize timestamp converter
    const unixTimestamp = document.getElementById('unixTimestamp');
    if (unixTimestamp) {
        unixTimestamp.addEventListener('input', convertTimestampToDate);
        convertTimestampToDate(); // Initial update
    }
    
    // Initialize unit converter
    const unitCategory = document.getElementById('unitCategory');
    if (unitCategory) {
        updateUnitOptions();
        unitCategory.addEventListener('change', updateUnitOptions);
    }
    
    // Initialize date inputs with current date
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const dateTimeInput = document.getElementById('dateTimeInput');
    
    if (startDate) startDate.value = new Date().toISOString().split('T')[0];
    if (endDate) endDate.value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (dateTimeInput) dateTimeInput.value = new Date().toISOString().slice(0, 16);
}

// Event Listeners
function initializeEventListeners() {
    // File input for Base64 converter
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Add copy functionality to output elements
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('selectable') || 
            e.target.classList.contains('hash-value') || 
            e.target.classList.contains('base-value')) {
            const success = await Utils.copyToClipboard(e.target.textContent);
            if (success) {
                Utils.showCopyFeedback(e.target);
            }
        }
    });
}

// =================== TOOL FUNCTIONS ===================

// JSON to C# Converter
function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const useNullable = document.getElementById('useNullable').checked;
    const useAttributes = document.getElementById('useAttributes').checked;
    const useRecords = document.getElementById('useRecords').checked;
    const rootClassName = document.getElementById('rootClassName').value || 'RootObject';
    const output = document.getElementById('csharpOutput');
    
    if (!jsonInput) {
        output.textContent = 'Please enter JSON data';
        return;
    }
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        const csharpCode = generateCsharpFromJson(jsonObj, rootClassName, useNullable, useAttributes, useRecords);
        output.textContent = csharpCode;
        
        // Highlight syntax if Prism is available
        if (window.Prism) {
            output.innerHTML = `<code class="language-csharp">${csharpCode}</code>`;
            window.Prism.highlightElement(output.querySelector('code'));
        }
    } catch (error) {
        output.textContent = `Error parsing JSON: ${error.message}`;
    }
}

function generateCsharpFromJson(obj, className, useNullable, useAttributes, useRecords) {
    const classes = [];
    const processedTypes = new Set();
    
    function getTypeDefinition(value, propertyName) {
        if (value === null) return useNullable ? 'string?' : 'string';
        
        switch (typeof value) {
            case 'string':
                if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                    return 'DateTime';
                }
                return useNullable ? 'string?' : 'string';
            case 'number':
                return Number.isInteger(value) ? 'int' : 'double';
            case 'boolean':
                return 'bool';
            case 'object':
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List<object>';
                    const itemType = getTypeDefinition(value[0], propertyName + 'Item');
                    return `List<${itemType}>`;
                } else {
                    const typeName = Utils.toPascalCase(propertyName);
                    if (!processedTypes.has(typeName)) {
                        processedTypes.add(typeName);
                        classes.unshift(generateClassDefinition(value, typeName, useNullable, useAttributes, useRecords));
                    }
                    return typeName;
                }
            default:
                return 'object';
        }
    }
    
    function generateClassDefinition(obj, className, useNullable, useAttributes, useRecords) {
        const properties = [];
        
        for (const [key, value] of Object.entries(obj)) {
            const propertyName = Utils.toPascalCase(key);
            const propertyType = getTypeDefinition(value, key);
            
            let propertyDef = '';
            if (useAttributes && key !== propertyName.toLowerCase()) {
                propertyDef += `    [JsonPropertyName("${key}")]\n`;
            }
            
            if (useRecords) {
                propertyDef += `    ${propertyType} ${propertyName}`;
            } else {
                propertyDef += `    public ${propertyType} ${propertyName} { get; set; }`;
            }
            
            properties.push(propertyDef);
        }
        
        let classDef = '';
        if (useAttributes) {
            classDef += 'using System.Text.Json.Serialization;\n\n';
        }
        
        if (useRecords) {
            classDef += `public record ${className}(\n${properties.join(',\n')}\n);`;
        } else {
            classDef += `public class ${className}\n{\n${properties.join('\n')}\n}`;
        }
        
        return classDef;
    }
    
    const rootClass = generateClassDefinition(obj, className, useNullable, useAttributes, useRecords);
    classes.push(rootClass);
    
    let result = '';
    if (useAttributes || classes.some(c => c.includes('List<'))) {
        result += 'using System.Collections.Generic;\n';
    }
    if (useAttributes) {
        result += 'using System.Text.Json.Serialization;\n';
    }
    result += '\n' + classes.join('\n\n');
    
    return result;
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
    
    const code = generateEntityCode(description, modelType);
    output.textContent = code;
    
    if (window.Prism) {
        output.innerHTML = `<code class="language-csharp">${code}</code>`;
        window.Prism.highlightElement(output.querySelector('code'));
    }
}

function generateEntityCode(description, type) {
    const entityName = extractEntityName(description);
    const properties = extractProperties(description);
    
    switch (type) {
        case 'entity':
            return generateEntityModel(entityName, properties);
        case 'dto':
            return generateDtoClasses(entityName, properties);
        case 'controller':
            return generateApiController(entityName, properties);
        case 'all':
            return [
                generateEntityModel(entityName, properties),
                generateDtoClasses(entityName, properties),
                generateApiController(entityName, properties)
            ].join('\n\n// =========================\n\n');
        default:
            return generateEntityModel(entityName, properties);
    }
}

function extractEntityName(description) {
    const words = description.toLowerCase().split(' ');
    const entityWords = words.filter(word => 
        !['with', 'and', 'of', 'for', 'in', 'on', 'at', 'by', 'from'].includes(word)
    );
    return Utils.toPascalCase(entityWords[0] || 'Entity');
}

function extractProperties(description) {
    const properties = [];
    
    // Simple property extraction
    if (description.includes('id')) properties.push({ name: 'Id', type: 'int' });
    if (description.includes('name')) properties.push({ name: 'Name', type: 'string' });
    if (description.includes('email')) properties.push({ name: 'Email', type: 'string' });
    if (description.includes('date') || description.includes('created')) 
        properties.push({ name: 'CreatedAt', type: 'DateTime' });
    if (description.includes('roles') || description.includes('list')) 
        properties.push({ name: 'Roles', type: 'List<string>' });
    
    return properties.length > 0 ? properties : [
        { name: 'Id', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'CreatedAt', type: 'DateTime' }
    ];
}

function generateEntityModel(entityName, properties) {
    const props = properties.map(p => `    public ${p.type} ${p.name} { get; set; }`).join('\n');
    
    return `using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class ${entityName}
{
${props}
}`;
}

function generateDtoClasses(entityName, properties) {
    const props = properties.map(p => `    public ${p.type} ${p.name} { get; set; }`).join('\n');
    
    return `using System;
using System.Collections.Generic;

public class ${entityName}Dto
{
${props}
}

public class Create${entityName}Dto
{
${properties.filter(p => p.name !== 'Id').map(p => `    public ${p.type} ${p.name} { get; set; }`).join('\n')}
}

public class Update${entityName}Dto
{
${properties.filter(p => p.name !== 'Id').map(p => `    public ${p.type} ${p.name} { get; set; }`).join('\n')}
}`;
}

function generateApiController(entityName, properties) {
    return `using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ${entityName}Controller : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<${entityName}Dto>>> GetAll()
    {
        // Implementation here
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<${entityName}Dto>> GetById(int id)
    {
        // Implementation here
        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<${entityName}Dto>> Create(Create${entityName}Dto dto)
    {
        // Implementation here
        return CreatedAtAction(nameof(GetById), new { id = 1 }, dto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Update${entityName}Dto dto)
    {
        // Implementation here
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Implementation here
        return NoContent();
    }
}`;
}

// Connection String Builder
function buildConnectionString() {
    const dbType = document.getElementById('dbType').value;
    const server = document.getElementById('server').value || 'localhost';
    const database = document.getElementById('database').value || 'MyDatabase';
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
    
    if (!input) {
        result.innerHTML = '<div class="validation-result error">Please enter a GUID to validate</div>';
        return;
    }
    
    const guidRegex = /^[{(]?[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}[)}]?$/;
    const isValid = guidRegex.test(input);
    
    result.innerHTML = isValid 
        ? '<div class="validation-result success">✓ Valid GUID format</div>'
        : '<div class="validation-result error">✗ Invalid GUID format</div>';
}

// Case Converter
function updateCaseConversions() {
    const input = document.getElementById('stringInput')?.value || '';
    
    if (input) {
        document.getElementById('pascalCase').textContent = Utils.toPascalCase(input);
        document.getElementById('camelCase').textContent = Utils.toCamelCase(input);
        document.getElementById('snakeCase').textContent = Utils.toSnakeCase(input);
        document.getElementById('kebabCase').textContent = Utils.toKebabCase(input);
        document.getElementById('constantCase').textContent = Utils.toConstantCase(input);
    }
}

// DateTime Converter
function convertTimestampToDate() {
    const timestamp = document.getElementById('unixTimestamp')?.value;
    if (!timestamp) return;
    
    const date = new Date(parseInt(timestamp) * 1000);
    
    document.getElementById('dateTimeResult').textContent = date.toLocaleString();
    document.getElementById('isoResult').textContent = date.toISOString();
    document.getElementById('timestampResult').textContent = timestamp;
    document.getElementById('csharpDateCode').textContent = `new DateTime(${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()})`;
}

function useCurrentTime() {
    const now = Math.floor(Date.now() / 1000);
    document.getElementById('unixTimestamp').value = now;
    convertTimestampToDate();
}

function convertDateToTimestamp() {
    const dateInput = document.getElementById('dateTimeInput').value;
    if (!dateInput) return;
    
    const timestamp = Math.floor(new Date(dateInput).getTime() / 1000);
    document.getElementById('timestampResult').textContent = timestamp;
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
        output.textContent = `Error: ${error.message}`;
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    const urlSafe = document.getElementById('urlSafeBase64').checked;
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.textContent = 'Please enter Base64 to decode';
        return;
    }
    
    try {
        let toDecode = input;
        if (urlSafe) {
            toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
            while (toDecode.length % 4) {
                toDecode += '=';
            }
        }
        const decoded = decodeURIComponent(escape(atob(toDecode)));
        output.textContent = decoded;
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
}

function validateBase64() {
    const input = document.getElementById('base64Input').value;
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.textContent = 'Please enter Base64 to validate';
        return;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    const isValid = base64Regex.test(input) && input.length % 4 === 0;
    
    output.textContent = isValid ? '✓ Valid Base64' : '✗ Invalid Base64';
}

// Color Converter
function updateColorConversions() {
    const colorInput = document.getElementById('colorInput')?.value || '#3b82f6';
    let color;
    
    try {
        // Handle different color formats
        if (colorInput.startsWith('#')) {
            color = hexToRgb(colorInput);
        } else if (colorInput.startsWith('rgb')) {
            const matches = colorInput.match(/\d+/g);
            if (matches && matches.length >= 3) {
                color = { r: parseInt(matches[0]), g: parseInt(matches[1]), b: parseInt(matches[2]) };
            }
        } else {
            throw new Error('Invalid color format');
        }
        
        if (!color) throw new Error('Invalid color');
        
        const hex = rgbToHex(color.r, color.g, color.b);
        const hsl = rgbToHsl(color.r, color.g, color.b);
        
        document.getElementById('hexColor').textContent = hex;
        document.getElementById('rgbColor').textContent = `rgb(${color.r}, ${color.g}, ${color.b})`;
        document.getElementById('hslColor').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        document.getElementById('csharpColor').textContent = `Color.FromArgb(${color.r}, ${color.g}, ${color.b})`;
        
        // Update color picker
        document.getElementById('colorPicker').value = hex;
        
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
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
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

function generateColorPalette() {
    const baseColor = document.getElementById('colorInput').value || '#3b82f6';
    const palette = document.getElementById('colorPalette');
    
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;
    
    const colors = [
        lightenColor(baseColor, 40),
        lightenColor(baseColor, 20),
        baseColor,
        darkenColor(baseColor, 20),
        darkenColor(baseColor, 40)
    ];
    
    palette.innerHTML = colors.map(color => 
        `<div class="color-swatch" style="background-color: ${color}" title="${color}" onclick="copyColorToClipboard('${color}')"></div>`
    ).join('');
}

function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = (100 + percent) / 100;
    return rgbToHex(
        Math.min(255, Math.round(rgb.r * factor)),
        Math.min(255, Math.round(rgb.g * factor)),
        Math.min(255, Math.round(rgb.b * factor))
    );
}

function darkenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const factor = (100 - percent) / 100;
    return rgbToHex(
        Math.round(rgb.r * factor),
        Math.round(rgb.g * factor),
        Math.round(rgb.b * factor)
    );
}

async function copyColorToClipboard(color) {
    const success = await Utils.copyToClipboard(color);
    if (success) {
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Copied!';
        feedback.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: var(--success-color); color: white; padding: 10px 20px;
            border-radius: 5px; z-index: 9999;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => document.body.removeChild(feedback), 1000);
    }
}

// Additional utility functions and tool implementations can be found in script-utils.js
// This includes unit converter, date calculator, password generator, and other advanced tools
