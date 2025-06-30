// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize string case converter
    const stringInput = document.getElementById('stringInput');
    if (stringInput) {
        stringInput.addEventListener('input', convertStringCases);
        convertStringCases(); // Initialize with default value
    }
    
    // Initialize other tools
    generateGuid();
    convertTimestamp();
});

// JSON to C# Converter
function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput').value;
    const output = document.getElementById('csharpOutput');
    
    try {
        const jsonObj = JSON.parse(jsonInput);
        const csharpClass = generateCsharpClass(jsonObj, 'RootObject');
        output.textContent = csharpClass;
    } catch (error) {
        output.textContent = 'Error: Invalid JSON format\n' + error.message;
    }
}

function generateCsharpClass(obj, className) {
    let result = `public class ${className}\n{\n`;
    
    for (const [key, value] of Object.entries(obj)) {
        const propertyName = toPascalCase(key);
        const propertyType = getCsharpType(value);
        
        result += `    public ${propertyType} ${propertyName} { get; set; }\n`;
    }
    
    result += '}\n';
    
    // Generate nested classes
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result += '\n' + generateCsharpClass(value, toPascalCase(key));
        }
    }
    
    return result;
}

function getCsharpType(value) {
    if (value === null) return 'object';
    if (typeof value === 'string') return 'string';
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
        return toPascalCase(Object.keys(value)[0]) || 'object';
    }
    return 'object';
}

// String Case Converter
function convertStringCases() {
    const input = document.getElementById('stringInput').value;
    
    document.getElementById('pascalCase').textContent = toPascalCase(input);
    document.getElementById('camelCase').textContent = toCamelCase(input);
    document.getElementById('snakeCase').textContent = toSnakeCase(input);
    document.getElementById('kebabCase').textContent = toKebabCase(input);
}

function toPascalCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function toSnakeCase(str) {
    return str.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
}

function toKebabCase(str) {
    return str.replace(/\W+/g, ' ')
        .split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('-');
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

// Regex Tester
function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const testString = document.getElementById('regexTestString').value;
    const resultsDiv = document.getElementById('regexResults');
    
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

// Utility functions for copying text
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('selectable')) {
        const text = e.target.textContent;
        if (text && text.trim() !== '') {
            navigator.clipboard.writeText(text).then(() => {
                // Visual feedback
                const original = e.target.style.background;
                e.target.style.background = '#4f46e5';
                e.target.style.color = 'white';
                setTimeout(() => {
                    e.target.style.background = original;
                    e.target.style.color = '';
                }, 200);
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