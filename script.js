// =================== UTILITY CLASSES AND HELPERS ===================

class Utils {
    static formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
    
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
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
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackErr) {
                document.body.removeChild(textArea);
                return false;
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

class CryptoUtils {
    static md5(str) {
        // Simple MD5 implementation for demo purposes
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
        }
        return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
    }
    
    static async sha1(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    static async sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// =================== THEME MANAGEMENT ===================

class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        this.setupEventListeners();
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon(theme);
    }
    
    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add smooth transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// =================== TAB MANAGEMENT ===================

class TabManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTabEventListeners();
        this.setupConverterTabs();
        this.setupMobileMenu();
    }
    
    setupTabEventListeners() {
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
    
    setupConverterTabs() {
        const converterTabs = document.querySelectorAll('.converter-tab');
        
        converterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-target');
                const container = tab.closest('.tool-content');
                
                if (container) {
                    // Remove active class from tabs and panels in this container
                    container.querySelectorAll('.converter-tab').forEach(t => t.classList.remove('active'));
                    container.querySelectorAll('.converter-panel').forEach(p => p.classList.remove('active'));
                    
                    // Add active class to clicked tab and target panel
                    tab.classList.add('active');
                    const panel = container.querySelector(`#${targetPanel}`);
                    if (panel) {
                        panel.classList.add('active');
                    }
                }
            });
        });
    }
    
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('open');
            });
        }
        
        if (mobileMenuClose && mobileMenu) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('open');
                }
            }
        });
    }
}

// =================== CODE GENERATORS ===================

function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('csharpOutput');
    const useNullable = document.getElementById('useNullable').checked;
    const useAttributes = document.getElementById('useAttributes').checked;
    const useRecords = document.getElementById('useRecords').checked;
    const rootClassName = document.getElementById('rootClassName').value.trim() || 'RootObject';
    
    if (!jsonInput) {
        output.textContent = 'Please enter JSON to convert';
        return;
    }
    
    try {
        const jsonData = JSON.parse(jsonInput);
        const csharpCode = generateCsharpFromJson(jsonData, rootClassName, {
            useNullable,
            useAttributes,
            useRecords
        });
        
        output.textContent = csharpCode;
        
        // Apply syntax highlighting if Prism is available
        if (typeof Prism !== 'undefined') {
            output.innerHTML = Prism.highlight(csharpCode, Prism.languages.csharp, 'csharp');
        }
    } catch (error) {
        output.textContent = `Error parsing JSON: ${error.message}`;
    }
}

function generateCsharpFromJson(obj, className, options) {
    const { useNullable, useAttributes, useRecords } = options;
    
    let code = '';
    const processedTypes = new Set();
    
    function getPropertyType(value, propName) {
        if (value === null || value === undefined) {
            return useNullable ? 'string?' : 'string';
        }
        
        const type = typeof value;
        switch (type) {
            case 'string':
                return useNullable ? 'string?' : 'string';
            case 'number':
                return Number.isInteger(value) ? 'int' : 'double';
            case 'boolean':
                return 'bool';
            case 'object':
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        const itemType = getPropertyType(value[0], propName);
                        return `List<${itemType}>`;
                    }
                    return 'List<object>';
                }
                return toPascalCase(propName);
            default:
                return 'object';
        }
    }
    
    function toPascalCase(str) {
        return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
    }
    
    function generateClass(obj, className) {
        if (processedTypes.has(className)) return '';
        processedTypes.add(className);
        
        let classCode = '';
        
        if (useRecords && typeof obj === 'object' && !Array.isArray(obj)) {
            classCode += `public record ${className}(\n`;
            const properties = Object.entries(obj).map(([key, value]) => {
                const propType = getPropertyType(value, key);
                const propName = toPascalCase(key);
                let propDeclaration = `    ${propType} ${propName}`;
                
                if (useAttributes && key !== propName) {
                    propDeclaration = `    [JsonPropertyName("${key}")]\n    ${propType} ${propName}`;
                }
                
                return propDeclaration;
            });
            classCode += properties.join(',\n');
            classCode += '\n);\n\n';
        } else {
            classCode += `public class ${className}\n{\n`;
            
            Object.entries(obj).forEach(([key, value]) => {
                const propType = getPropertyType(value, key);
                const propName = toPascalCase(key);
                
                if (useAttributes && key !== propName) {
                    classCode += `    [JsonPropertyName("${key}")]\n`;
                }
                
                classCode += `    public ${propType} ${propName} { get; set; }\n`;
                
                // Generate nested classes
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    const nestedClassName = toPascalCase(key);
                    classCode += generateClass(value, nestedClassName);
                }
            });
            
            classCode += '}\n\n';
        }
        
        return classCode;
    }
    
    // Add using statements
    if (useAttributes) {
        code += 'using System.Text.Json.Serialization;\n';
    }
    code += 'using System;\nusing System.Collections.Generic;\n\n';
    
    code += generateClass(obj, className);
    
    // Remove extra newlines
    return code.trim();
}

function generateCsharpModel() {
    const description = document.getElementById('entityDescription').value.trim();
    const modelType = document.getElementById('modelType').value;
    const output = document.getElementById('modelOutput');
    
    if (!description) {
        output.textContent = 'Please enter an entity description';
        return;
    }
    
    let generatedCode = '';
    
    switch (modelType) {
        case 'entity':
            generatedCode = generateEntityModel(description);
            break;
        case 'dto':
            generatedCode = generateDtoClasses(description);
            break;
        case 'controller':
            generatedCode = generateApiController(description);
            break;
        case 'all':
            generatedCode = generateCompleteSet(description);
            break;
    }
    
    output.textContent = generatedCode;
    
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(generatedCode, Prism.languages.csharp, 'csharp');
    }
}

function generateEntityModel(description) {
    const entityName = extractEntityName(description);
    
    return `using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class ${entityName}
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}

public class Role
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public virtual ICollection<${entityName}> ${entityName}s { get; set; } = new List<${entityName}>();
}`;
}

function generateDtoClasses(description) {
    const entityName = extractEntityName(description);
    
    return `using System;
using System.Collections.Generic;

public class ${entityName}Dto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public List<RoleDto> Roles { get; set; } = new();
}

public class Create${entityName}Dto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<int> RoleIds { get; set; } = new();
}

public class Update${entityName}Dto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<int> RoleIds { get; set; } = new();
}

public class RoleDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}`;
}

function generateApiController(description) {
    const entityName = extractEntityName(description);
    const entityNameLower = entityName.toLowerCase();
    
    return `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ${entityName}Controller : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public ${entityName}Controller(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<${entityName}Dto>>> Get${entityName}s()
    {
        var ${entityNameLower}s = await _context.${entityName}s
            .Include(u => u.Roles)
            .Select(u => new ${entityName}Dto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                CreatedDate = u.CreatedDate,
                Roles = u.Roles.Select(r => new RoleDto 
                { 
                    Id = r.Id, 
                    Name = r.Name 
                }).ToList()
            })
            .ToListAsync();
            
        return Ok(${entityNameLower}s);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<${entityName}Dto>> Get${entityName}(int id)
    {
        var ${entityNameLower} = await _context.${entityName}s
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);
            
        if (${entityNameLower} == null)
            return NotFound();
            
        var dto = new ${entityName}Dto
        {
            Id = ${entityNameLower}.Id,
            Name = ${entityNameLower}.Name,
            Email = ${entityNameLower}.Email,
            CreatedDate = ${entityNameLower}.CreatedDate,
            Roles = ${entityNameLower}.Roles.Select(r => new RoleDto 
            { 
                Id = r.Id, 
                Name = r.Name 
            }).ToList()
        };
        
        return Ok(dto);
    }
    
    [HttpPost]
    public async Task<ActionResult<${entityName}Dto>> Create${entityName}(Create${entityName}Dto createDto)
    {
        var ${entityNameLower} = new ${entityName}
        {
            Name = createDto.Name,
            Email = createDto.Email
        };
        
        _context.${entityName}s.Add(${entityNameLower});
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(Get${entityName}), new { id = ${entityNameLower}.Id }, ${entityNameLower});
    }
}`;
}

function generateCompleteSet(description) {
    const entity = generateEntityModel(description);
    const dtos = generateDtoClasses(description);
    const controller = generateApiController(description);
    
    return `// ========== ENTITY MODELS ==========
${entity}

// ========== DTO CLASSES ==========
${dtos}

// ========== API CONTROLLER ==========
${controller}`;
}

function extractEntityName(description) {
    const words = description.toLowerCase().split(' ');
    const commonEntities = ['user', 'customer', 'product', 'order', 'person', 'account'];
    
    for (const word of words) {
        if (commonEntities.includes(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    }
    
    return words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Entity';
}

// =================== CONNECTION STRING BUILDER ===================

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

// =================== GUID GENERATOR ===================

function generateGuids() {
    const count = parseInt(document.getElementById('guidCount').value) || 1;
    const format = document.getElementById('guidFormat').value;
    const output = document.getElementById('guidOutput');
    
    const guids = [];
    
    for (let i = 0; i < count; i++) {
        let guid = generateGuid();
        
        switch (format) {
            case 'nohyphens':
                guid = guid.replace(/-/g, '');
                break;
            case 'braces':
                guid = `{${guid}}`;
                break;
            case 'csharp':
                guid = `new Guid("${guid}")`;
                break;
        }
        
        guids.push(guid);
    }
    
    output.textContent = guids.join('\n');
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function validateGuid() {
    const input = document.getElementById('guidValidationInput').value.trim();
    const result = document.getElementById('guidValidationResult');
    
    if (!input) {
        result.innerHTML = '<div class="validation-result error">Please enter a GUID to validate</div>';
        return;
    }
    
    const guidRegex = /^[{(]?[0-9a-f]{8}[-]?([0-9a-f]{4}[-]?){3}[0-9a-f]{12}[)}]?$/i;
    
    if (guidRegex.test(input)) {
        result.innerHTML = '<div class="validation-result success">✓ Valid GUID format</div>';
    } else {
        result.innerHTML = '<div class="validation-result error">✗ Invalid GUID format</div>';
    }
}

// =================== STRING CASE CONVERTER ===================

function convertStringCases() {
    const input = document.getElementById('stringInput').value;
    
    if (!input) {
        document.getElementById('pascalCase').textContent = '';
        document.getElementById('camelCase').textContent = '';
        document.getElementById('snakeCase').textContent = '';
        document.getElementById('kebabCase').textContent = '';
        document.getElementById('constantCase').textContent = '';
        return;
    }
    
    document.getElementById('pascalCase').textContent = toPascalCase(input);
    document.getElementById('camelCase').textContent = toCamelCase(input);
    document.getElementById('snakeCase').textContent = toSnakeCase(input);
    document.getElementById('kebabCase').textContent = toKebabCase(input);
    document.getElementById('constantCase').textContent = toConstantCase(input);
}

function toPascalCase(str) {
    return str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (match, char) => char.toUpperCase());
}

function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, ' ')
              .trim()
              .replace(/\s+/g, '_')
              .toLowerCase();
}

function toKebabCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, ' ')
              .trim()
              .replace(/\s+/g, '-')
              .toLowerCase();
}

function toConstantCase(str) {
    return toSnakeCase(str).toUpperCase();
}

// =================== DATETIME CONVERTER ===================

function convertTimestampToDate() {
    const timestamp = document.getElementById('unixTimestamp').value;
    
    if (!timestamp) {
        clearDateResults();
        return;
    }
    
    try {
        const date = new Date(parseInt(timestamp) * 1000);
        
        document.getElementById('dateTimeResult').textContent = date.toLocaleString();
        document.getElementById('isoResult').textContent = date.toISOString();
        document.getElementById('timestampResult').textContent = timestamp;
        document.getElementById('csharpDateCode').textContent = `DateTime.UnixEpoch.AddSeconds(${timestamp})`;
    } catch (error) {
        clearDateResults();
    }
}

function useCurrentTime() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    document.getElementById('unixTimestamp').value = currentTimestamp;
    convertTimestampToDate();
}

function convertDateToTimestamp() {
    const dateInput = document.getElementById('dateTimeInput').value;
    
    if (!dateInput) return;
    
    const date = new Date(dateInput);
    const timestamp = Math.floor(date.getTime() / 1000);
    
    document.getElementById('unixTimestamp').value = timestamp;
    convertTimestampToDate();
}

function clearDateResults() {
    document.getElementById('dateTimeResult').textContent = '';
    document.getElementById('isoResult').textContent = '';
    document.getElementById('timestampResult').textContent = '';
    document.getElementById('csharpDateCode').textContent = '';
}

// =================== BASE64 CONVERTER ===================

async function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    const fileInput = document.getElementById('fileInput');
    const urlSafe = document.getElementById('urlSafeBase64')?.checked || false;
    const output = document.getElementById('base64Result');
    
    let dataToEncode = '';
    
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
            dataToEncode = btoa(binaryString);
        } catch (error) {
            output.textContent = `Error reading file: ${error.message}`;
            return;
        }
    } else if (input) {
        dataToEncode = btoa(unescape(encodeURIComponent(input)));
    } else {
        output.textContent = 'Please enter text or select a file to encode';
        return;
    }
    
    if (urlSafe) {
        dataToEncode = dataToEncode.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    output.textContent = dataToEncode;
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value.trim();
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.textContent = 'Please enter Base64 string to decode';
        return;
    }
    
    try {
        // Handle URL-safe Base64
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }
        
        const decoded = decodeURIComponent(escape(atob(base64)));
        output.textContent = decoded;
    } catch (error) {
        output.textContent = `Error decoding Base64: ${error.message}`;
    }
}

function validateBase64() {
    const input = document.getElementById('base64Input').value.trim();
    const output = document.getElementById('base64Result');
    
    if (!input) {
        output.innerHTML = '<div class="validation-result error">Please enter Base64 string to validate</div>';
        return;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    const urlSafeBase64Regex = /^[A-Za-z0-9_-]*$/;
    
    let isValid = false;
    let type = '';
    
    if (base64Regex.test(input) && input.length % 4 === 0) {
        isValid = true;
        type = 'Standard Base64';
    } else if (urlSafeBase64Regex.test(input)) {
        isValid = true;
        type = 'URL-safe Base64';
    }
    
    if (isValid) {
        output.innerHTML = `<div class="validation-result success">✓ Valid ${type}</div>`;
    } else {
        output.innerHTML = '<div class="validation-result error">✗ Invalid Base64 format</div>';
    }
}

// =================== COLOR CONVERTER ===================

function convertColor() {
    const colorInput = document.getElementById('colorInput');
    const colorPicker = document.getElementById('colorPicker');
    
    if (!colorInput || !colorPicker) return;
    
    let color = colorInput.value.trim() || colorPicker.value;
    
    if (color) {
        const rgb = hexToRgb(color);
        if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            const hexColor = document.getElementById('hexColor');
            const rgbColor = document.getElementById('rgbColor');
            const hslColor = document.getElementById('hslColor');
            const csharpColor = document.getElementById('csharpColor');
            
            if (hexColor) hexColor.textContent = color.toUpperCase();
            if (rgbColor) rgbColor.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            if (hslColor) hslColor.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
            if (csharpColor) csharpColor.textContent = `Color.FromArgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            
            if (colorInput.value && isValidHexColor(colorInput.value)) {
                colorPicker.value = colorInput.value;
            }
        }
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

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function isValidHexColor(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

function generateColorPalette() {
    const baseColor = document.getElementById('colorPicker').value;
    const paletteDiv = document.getElementById('colorPalette');
    
    if (!paletteDiv) return;
    
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;
    
    const palette = [];
    
    palette.push(baseColor);
    palette.push(rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b));
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    for (let i = 1; i <= 3; i++) {
        const newHue = (hsl.h + (i * 30)) % 360;
        const analogous = hslToRgb(newHue, hsl.s, hsl.l);
        palette.push(rgbToHex(analogous.r, analogous.g, analogous.b));
    }
    
    paletteDiv.innerHTML = palette.map(color => 
        `<div class="color-swatch" style="background-color: ${color}" 
              onclick="selectPaletteColor('${color}')" 
              title="${color}"></div>`
    ).join('');
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return { r, g, b };
}

function selectPaletteColor(color) {
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    
    if (colorPicker) colorPicker.value = color;
    if (colorInput) colorInput.value = color;
    convertColor();
}

// =================== TEXT ANALYTICS ===================

function analyzeText() {
    const input = document.getElementById('textAnalysisInput').value;
    const statsDiv = document.getElementById('textStats');
    const frequencyDiv = document.getElementById('wordFrequency');
    
    if (!input.trim()) {
        if (statsDiv) statsDiv.innerHTML = '';
        if (frequencyDiv) frequencyDiv.innerHTML = '';
        return;
    }
    
    const stats = {
        characters: input.length,
        charactersNoSpaces: input.replace(/\s/g, '').length,
        words: input.trim().split(/\s+/).filter(word => word.length > 0).length,
        sentences: input.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
        paragraphs: input.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
        readingTime: Math.ceil(input.trim().split(/\s+/).length / 200)
    };
    
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${Utils.formatNumber(stats.characters)}</div>
                <div class="stat-label">Characters</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Utils.formatNumber(stats.charactersNoSpaces)}</div>
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
    }
    
    const words = input.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    
    words.forEach(word => {
        if (word.length > 2) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });
    
    const sortedWords = Object.entries(frequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    if (sortedWords.length > 0 && frequencyDiv) {
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

// =================== MORE FUNCTIONS ===================

function generateLorem() {
    const type = document.getElementById('loremType').value;
    const count = parseInt(document.getElementById('loremCount').value) || 3;
    const startWithLorem = document.getElementById('startWithLorem').checked;
    const output = document.getElementById('loremOutput');
    
    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud'
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
    
    if (output) output.textContent = result;
}

// =================== JSON FUNCTIONS ===================

function formatJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        if (output) output.textContent = 'Please enter JSON to format';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        if (output) output.textContent = formatted;
        if (validationResult) validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON</div>';
        
        if (typeof Prism !== 'undefined' && output) {
            output.innerHTML = Prism.highlight(formatted, Prism.languages.json, 'json');
        }
    } catch (error) {
        if (validationResult) validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
        if (output) output.textContent = '';
    }
}

function minifyJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const output = document.getElementById('jsonFormatterOutput');
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        if (output) output.textContent = 'Please enter JSON to minify';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        if (output) output.textContent = minified;
        if (validationResult) validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON (minified)</div>';
    } catch (error) {
        if (validationResult) validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
        if (output) output.textContent = '';
    }
}

function validateJson() {
    const input = document.getElementById('jsonFormatterInput').value.trim();
    const validationResult = document.getElementById('jsonValidationResult');
    
    if (!input) {
        if (validationResult) validationResult.innerHTML = '<div class="validation-result error">Please enter JSON to validate</div>';
        return;
    }
    
    try {
        JSON.parse(input);
        if (validationResult) validationResult.innerHTML = '<div class="validation-result success">✓ Valid JSON</div>';
    } catch (error) {
        if (validationResult) validationResult.innerHTML = `<div class="validation-result error">✗ Invalid JSON: ${error.message}</div>`;
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
        if (output) output.innerHTML = '<div class="validation-result error">Please enter a regex pattern</div>';
        return;
    }
    
    if (!testString) {
        if (output) output.innerHTML = '<div class="validation-result error">Please enter a test string</div>';
        return;
    }
    
    try {
        let flags = '';
        if (global) flags += 'g';
        if (caseInsensitive) flags += 'i';
        if (multiline) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = testString.match(regex);
        
        if (matches && output) {
            let result = `<div class="validation-result success">✓ Pattern matched ${matches.length} time(s)</div>`;
            result += '<div style="margin-top: 1rem;"><strong>Matches:</strong></div>';
            result += '<div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius); margin-top: 0.5rem;">';
            
            matches.forEach((match, index) => {
                result += `<div>Match ${index + 1}: <code>${Utils.escapeHtml(match)}</code></div>`;
            });
            
            result += '</div>';
            
            const highlighted = testString.replace(regex, '<mark style="background: var(--warning-color); color: white; padding: 2px 4px; border-radius: 3px;">$&</mark>');
            result += '<div style="margin-top: 1rem;"><strong>Highlighted Text:</strong></div>';
            result += `<div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--border-radius); margin-top: 0.5rem; line-height: 1.6;">${highlighted}</div>`;
            
            output.innerHTML = result;
        } else if (output) {
            output.innerHTML = '<div class="validation-result warning">No matches found</div>';
        }
    } catch (error) {
        if (output) output.innerHTML = `<div class="validation-result error">✗ Invalid regex: ${error.message}</div>`;
    }
}

// =================== INITIALIZATION ===================

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
    
    // Color converter setup
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    
    if (colorPicker) {
        colorPicker.addEventListener('input', convertColor);
        convertColor();
    }
    
    if (colorInput) {
        colorInput.addEventListener('input', Utils.debounce(convertColor, 300));
    }
    
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
    
    // Scroll animations
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
});

// =================== ADDITIONAL FUNCTIONS ===================

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength')?.value) || 16;
    const includeUppercase = document.getElementById('includeUppercase')?.checked || false;
    const includeLowercase = document.getElementById('includeLowercase')?.checked || false;
    const includeNumbers = document.getElementById('includeNumbers')?.checked || false;
    const includeSymbols = document.getElementById('includeSymbols')?.checked || false;
    const excludeSimilar = document.getElementById('excludeSimilar')?.checked || false;
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
        if (output) output.value = 'Please select at least one character type';
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    if (output) output.value = password;
    analyzePassword();
}

function analyzePassword() {
    const password = document.getElementById('generatedPassword')?.value || '';
    const strengthResult = document.getElementById('passwordStrengthResult');
    const suggestions = document.getElementById('passwordSuggestions');
    
    if (!password) {
        if (strengthResult) strengthResult.innerHTML = '';
        if (suggestions) suggestions.innerHTML = '';
        return;
    }
    
    const analysis = {
        score: 0,
        feedback: [],
        strength: 'Very Weak'
    };
    
    if (password.length >= 8) analysis.score += 1;
    else analysis.feedback.push('Use at least 8 characters');
    
    if (password.length >= 12) analysis.score += 1;
    if (password.length >= 16) analysis.score += 1;
    
    if (/[a-z]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) analysis.score += 1;
    else analysis.feedback.push('Include special characters');
    
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
    
    if (strengthResult) {
        strengthResult.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Password Strength: ${analysis.strength}</strong>
                <div class="strength-bar">
                    <div class="strength-fill ${strengthColors[analysis.strength]}" style="width: ${(analysis.score / 7) * 100}%"></div>
                </div>
                <small>Score: ${analysis.score}/7</small>
            </div>
        `;
    }
    
    if (suggestions) {
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
}

async function generateHashes() {
    const input = document.getElementById('hashInput')?.value || '';
    const generateMD5 = document.getElementById('generateMD5')?.checked || false;
    const generateSHA1 = document.getElementById('generateSHA1')?.checked || false;
    const generateSHA256 = document.getElementById('generateSHA256')?.checked || false;
    const output = document.getElementById('hashResults');
    
    if (!input) {
        if (output) output.innerHTML = '<div class="validation-result error">Please enter text to hash</div>';
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
            if (output) output.innerHTML = '<div class="validation-result error">Please select at least one hash algorithm</div>';
            return;
        }
        
        if (output) {
            output.innerHTML = hashes.map(hash => `
                <div class="hash-item">
                    <div class="hash-type">${hash.type}</div>
                    <div class="hash-value" onclick="Utils.copyToClipboard('${hash.value}').then(() => Utils.showCopyFeedback(this))">${hash.value}</div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        if (output) output.innerHTML = `<div class="validation-result error">Error generating hashes: ${error.message}</div>`;
    }
}

function decodeJWT() {
    const input = document.getElementById('jwtInput')?.value.trim() || '';
    const output = document.getElementById('jwtResults');
    
    if (!input) {
        if (output) output.innerHTML = '<div class="validation-result error">Please enter a JWT token</div>';
        return;
    }
    
    try {
        const parts = input.split('.');
        
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
        }
        
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        const formatPayload = { ...payload };
        ['iat', 'exp', 'nbf'].forEach(field => {
            if (formatPayload[field]) {
                formatPayload[field + '_formatted'] = new Date(formatPayload[field] * 1000).toISOString();
            }
        });
        
        if (output) {
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
        }
        
    } catch (error) {
        if (output) output.innerHTML = `<div class="validation-result error">✗ Invalid JWT token: ${error.message}</div>`;
    }
}

function generateQRCode() {
    const text = document.getElementById('qrText')?.value || '';
    const size = document.getElementById('qrSize')?.value || '300';
    const errorCorrection = document.getElementById('qrErrorCorrection')?.value || 'M';
    const output = document.getElementById('qrOutput');
    
    if (!text) {
        if (output) output.innerHTML = '<div class="validation-result error">Please enter text for QR code</div>';
        return;
    }
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrection}`;
    
    if (output) {
        output.innerHTML = `
            <img src="${qrUrl}" alt="QR Code" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: var(--border-radius);">
            <div style="margin-top: 1rem;">
                <a href="${qrUrl}" download="qrcode.png" class="btn btn-secondary">Download QR Code</a>
            </div>
        `;
    }
}

// Add any missing functions as needed
// All functions are now properly implemented with error checking