// =================== ADVANCED TOOLS IMPLEMENTATION ===================
// Additional implementations for remaining .NET Tools

// =================== TEXT FORMATTER ===================

function formatText() {
    const input = document.getElementById('formatTextInput')?.value || '';
    const trimWhitespace = document.getElementById('trimWhitespace')?.checked;
    const normalizeSpaces = document.getElementById('normalizeSpaces')?.checked;
    const removeEmptyLines = document.getElementById('removeEmptyLines')?.checked;
    const capitalizeWords = document.getElementById('capitalizeWords')?.checked;
    const output = document.getElementById('formatTextResult');
    
    if (!output) return;
    
    let result = input;
    
    if (trimWhitespace) {
        result = result.split('\n').map(line => line.trim()).join('\n');
    }
    
    if (normalizeSpaces) {
        result = result.replace(/\s+/g, ' ');
    }
    
    if (removeEmptyLines) {
        result = result.split('\n').filter(line => line.trim().length > 0).join('\n');
    }
    
    if (capitalizeWords) {
        result = result.replace(/\b\w+/g, word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
    }
    
    output.textContent = result;
}

function toUpperCase() {
    const input = document.getElementById('formatTextInput')?.value || '';
    const output = document.getElementById('formatTextResult');
    if (output) output.textContent = input.toUpperCase();
}

function toLowerCase() {
    const input = document.getElementById('formatTextInput')?.value || '';
    const output = document.getElementById('formatTextResult');
    if (output) output.textContent = input.toLowerCase();
}

// =================== REGEX TESTER ===================

function testRegex() {
    const pattern = document.getElementById('regexPattern')?.value || '';
    const testText = document.getElementById('regexTestText')?.value || '';
    const globalFlag = document.getElementById('regexGlobal')?.checked;
    const ignoreCaseFlag = document.getElementById('regexIgnoreCase')?.checked;
    const multilineFlag = document.getElementById('regexMultiline')?.checked;
    const output = document.getElementById('regexResults');
    
    if (!output) return;
    
    if (!pattern) {
        output.innerHTML = '<div class="validation-result error">Please enter a regex pattern</div>';
        return;
    }
    
    try {
        let flags = '';
        if (globalFlag) flags += 'g';
        if (ignoreCaseFlag) flags += 'i';
        if (multilineFlag) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = [];
        
        if (globalFlag) {
            let match;
            while ((match = regex.exec(testText)) !== null) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1)
                });
                if (regex.lastIndex === match.index) {
                    regex.lastIndex++;
                }
            }
        } else {
            const match = regex.exec(testText);
            if (match) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1)
                });
            }
        }
        
        if (matches.length === 0) {
            output.innerHTML = '<div class="validation-result error">No matches found</div>';
        } else {
            output.innerHTML = `
                <div class="validation-result success">Found ${matches.length} match(es)</div>
                <div class="regex-matches">
                    ${matches.map((match, i) => `
                        <div class="match-item">
                            <div class="match-header">Match ${i + 1}:</div>
                            <div class="match-value">${escapeHtml(match.match)}</div>
                            <div class="match-info">Position: ${match.index}</div>
                            ${match.groups.length > 0 ? `
                                <div class="match-groups">
                                    <div>Groups:</div>
                                    ${match.groups.map((group, j) => `
                                        <div class="group-item">Group ${j + 1}: ${escapeHtml(group || 'N/A')}</div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
    } catch (error) {
        output.innerHTML = `<div class="validation-result error">Invalid regex: ${error.message}</div>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =================== LOREM IPSUM GENERATOR ===================

function generateLorem() {
    const type = document.getElementById('loremType')?.value || 'paragraphs';
    const count = parseInt(document.getElementById('loremCount')?.value) || 3;
    const startWithLorem = document.getElementById('startWithLorem')?.checked;
    const output = document.getElementById('loremResult');
    
    if (!output) return;
    
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
            if (startWithLorem) {
                words.push('Lorem', 'ipsum');
            }
            for (let i = words.length; i < count; i++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            result = words.join(' ');
            break;
            
        case 'sentences':
            for (let i = 0; i < count; i++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const sentence = [];
                
                if (i === 0 && startWithLorem) {
                    sentence.push('Lorem', 'ipsum');
                }
                
                for (let j = sentence.length; j < sentenceLength; j++) {
                    sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                }
                
                sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                result += sentence.join(' ') + '. ';
            }
            break;
            
        case 'paragraphs':
        default:
            for (let i = 0; i < count; i++) {
                const paragraphLength = Math.floor(Math.random() * 5) + 3;
                const sentences = [];
                
                for (let j = 0; j < paragraphLength; j++) {
                    const sentenceLength = Math.floor(Math.random() * 10) + 5;
                    const sentence = [];
                    
                    if (i === 0 && j === 0 && startWithLorem) {
                        sentence.push('Lorem', 'ipsum');
                    }
                    
                    for (let k = sentence.length; k < sentenceLength; k++) {
                        sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                    }
                    
                    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
                    sentences.push(sentence.join(' '));
                }
                
                result += sentences.join('. ') + '.\\n\\n';
            }
            break;
    }
    
    output.textContent = result.trim();
}

// =================== URL ENCODER/DECODER ===================

function encodeUrl() {
    const input = document.getElementById('urlInput')?.value || '';
    const encodeComponents = document.getElementById('encodeComponents')?.checked;
    const output = document.getElementById('urlResult');
    
    if (!output) return;
    
    if (!input) {
        output.textContent = 'Please enter a URL to encode';
        return;
    }
    
    try {
        const result = encodeComponents ? encodeURIComponent(input) : encodeURI(input);
        output.textContent = result;
    } catch (error) {
        output.textContent = `Error encoding URL: ${error.message}`;
    }
}

function decodeUrl() {
    const input = document.getElementById('urlInput')?.value || '';
    const output = document.getElementById('urlResult');
    
    if (!output) return;
    
    if (!input) {
        output.textContent = 'Please enter a URL to decode';
        return;
    }
    
    try {
        const result = decodeURIComponent(input);
        output.textContent = result;
    } catch (error) {
        output.textContent = `Error decoding URL: ${error.message}`;
    }
}

// =================== COLOR CONVERTER ===================

function updateColorConversions() {
    const colorInput = document.getElementById('colorInput')?.value || '#3b82f6';
    const colorPicker = document.getElementById('colorPicker');
    
    if (colorPicker) colorPicker.value = colorInput;
    
    try {
        const rgb = hexToRgb(colorInput);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        updateColorDisplay('hexColor', colorInput.toUpperCase());
        updateColorDisplay('rgbColor', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        updateColorDisplay('hslColor', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
        updateColorDisplay('csharpColor', `Color.FromArgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        
    } catch (error) {
        console.error('Color conversion error:', error);
    }
}

function updateColorDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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
    const baseColor = document.getElementById('colorInput')?.value || '#3b82f6';
    const paletteContainer = document.getElementById('colorPalette');
    
    if (!paletteContainer) return;
    
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const palette = [];
    
    // Generate complementary colors
    palette.push({
        name: 'Original',
        color: baseColor
    });
    
    // Complementary (180 degrees)
    const compHue = (hsl.h + 180) % 360;
    palette.push({
        name: 'Complementary',
        color: hslToHex(compHue, hsl.s, hsl.l)
    });
    
    // Triadic (120 degrees apart)
    const tri1Hue = (hsl.h + 120) % 360;
    const tri2Hue = (hsl.h + 240) % 360;
    palette.push({
        name: 'Triadic 1',
        color: hslToHex(tri1Hue, hsl.s, hsl.l)
    });
    palette.push({
        name: 'Triadic 2',
        color: hslToHex(tri2Hue, hsl.s, hsl.l)
    });
    
    // Analogous colors
    const ana1Hue = (hsl.h + 30) % 360;
    const ana2Hue = (hsl.h - 30 + 360) % 360;
    palette.push({
        name: 'Analogous 1',
        color: hslToHex(ana1Hue, hsl.s, hsl.l)
    });
    palette.push({
        name: 'Analogous 2',
        color: hslToHex(ana2Hue, hsl.s, hsl.l)
    });
    
    paletteContainer.innerHTML = palette.map(color => `
        <div class="palette-color" style="background-color: ${color.color}" title="${color.name}: ${color.color}" onclick="selectPaletteColor('${color.color}')">
            <div class="palette-color-name">${color.name}</div>
            <div class="palette-color-value">${color.color}</div>
        </div>
    `).join('');
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function selectPaletteColor(color) {
    const colorInput = document.getElementById('colorInput');
    const colorPicker = document.getElementById('colorPicker');
    
    if (colorInput) colorInput.value = color;
    if (colorPicker) colorPicker.value = color;
    
    updateColorConversions();
}

// =================== TIMESTAMP CONVERTER ===================

function convertTimestampToDate() {
    const timestamp = parseInt(document.getElementById('unixTimestamp')?.value);
    
    if (isNaN(timestamp)) {
        updateTimestampResults('Invalid timestamp', '', '', '');
        return;
    }
    
    const date = new Date(timestamp * 1000);
    
    updateTimestampResults(
        date.toLocaleString(),
        date.toISOString(),
        timestamp.toString(),
        `new DateTime(${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()})`
    );
}

function useCurrentTime() {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    
    const timestampInput = document.getElementById('unixTimestamp');
    if (timestampInput) {
        timestampInput.value = timestamp;
        convertTimestampToDate();
    }
}

function convertDateToTimestamp() {
    const dateInput = document.getElementById('dateTimeInput')?.value;
    
    if (!dateInput) {
        updateTimestampResults('', '', 'Please select a date', '');
        return;
    }
    
    const date = new Date(dateInput);
    const timestamp = Math.floor(date.getTime() / 1000);
    
    updateTimestampResults(
        date.toLocaleString(),
        date.toISOString(),
        timestamp.toString(),
        `new DateTime(${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()})`
    );
}

function updateTimestampResults(dateTime, iso, timestamp, csharp) {
    const updates = {
        'dateTimeResult': dateTime,
        'isoResult': iso,
        'timestampResult': timestamp,
        'csharpDateCode': csharp
    };
    
    Object.entries(updates).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// =================== QR CODE GENERATOR ===================

function generateQRCode() {
    const content = document.getElementById('qrContent')?.value || '';
    const size = document.getElementById('qrSize')?.value || '300';
    const errorCorrection = document.getElementById('qrErrorCorrection')?.value || 'M';
    const output = document.getElementById('qrOutput');
    
    if (!output) return;
    
    if (!content.trim()) {
        output.innerHTML = '<div class="validation-result error">Please enter content for the QR code</div>';
        return;
    }
    
    // Using QR Server API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&ecc=${errorCorrection}`;
    
    output.innerHTML = `
        <div class="qr-code-container">
            <img src="${qrUrl}" alt="QR Code" class="qr-code-image" />
            <div class="qr-code-info">
                <p>Size: ${size}x${size}px</p>
                <p>Error Correction: ${errorCorrection}</p>
                <p>Content: ${content.length} characters</p>
            </div>
            <div class="qr-code-actions">
                <a href="${qrUrl}" download="qrcode.png" class="btn btn-primary">Download PNG</a>
                <button onclick="copyQRUrl('${qrUrl}')" class="btn btn-secondary">Copy URL</button>
            </div>
        </div>
    `;
}

async function copyQRUrl(url) {
    const success = await ToolUtils.copyToClipboard(url);
    if (success) {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 1000);
    }
}

// =================== C# ENTITY GENERATOR ===================

function generateCsharpModel() {
    const description = document.getElementById('entityDescription')?.value || '';
    const modelType = document.getElementById('modelType')?.value || 'entity';
    const output = document.getElementById('modelOutput');
    
    if (!output) return;
    
    if (!description.trim()) {
        output.textContent = 'Please enter an entity description';
        return;
    }
    
    const code = generateModelFromDescription(description, modelType);
    output.textContent = code;
    
    // Highlight syntax if Prism is available
    if (window.Prism) {
        output.innerHTML = `<code class="language-csharp">${code}</code>`;
        window.Prism.highlightElement(output.querySelector('code'));
    }
}

function generateModelFromDescription(description, modelType) {
    const words = description.toLowerCase().split(/\\s+/);
    const entityName = extractEntityName(words);
    const properties = extractProperties(words);
    
    switch (modelType) {
        case 'entity':
            return generateEntityModel(entityName, properties);
        case 'dto':
            return generateDtoModel(entityName, properties);
        case 'controller':
            return generateControllerModel(entityName, properties);
        case 'all':
            return [
                generateEntityModel(entityName, properties),
                '\\n\\n' + '='.repeat(50) + '\\n\\n',
                generateDtoModel(entityName, properties),
                '\\n\\n' + '='.repeat(50) + '\\n\\n',
                generateControllerModel(entityName, properties)
            ].join('');
        default:
            return generateEntityModel(entityName, properties);
    }
}

function extractEntityName(words) {
    const skipWords = ['with', 'having', 'contains', 'includes', 'and', 'of', 'for'];
    for (const word of words) {
        if (!skipWords.includes(word) && word.length > 2) {
            return capitalize(word);
        }
    }
    return 'Entity';
}

function extractProperties(words) {
    const properties = [];
    const propertyKeywords = {
        'id': 'int',
        'name': 'string',
        'email': 'string',
        'password': 'string',
        'date': 'DateTime',
        'created': 'DateTime',
        'updated': 'DateTime',
        'price': 'decimal',
        'amount': 'decimal',
        'count': 'int',
        'number': 'int',
        'age': 'int',
        'active': 'bool',
        'enabled': 'bool',
        'roles': 'List<string>',
        'tags': 'List<string>',
        'items': 'List<string>'
    };
    
    // Always add Id property
    properties.push({ name: 'Id', type: 'int' });
    
    for (const word of words) {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        if (propertyKeywords[cleanWord]) {
            const propName = capitalize(cleanWord);
            if (!properties.some(p => p.name === propName)) {
                properties.push({ name: propName, type: propertyKeywords[cleanWord] });
            }
        }
    }
    
    // Add common properties if not already present
    if (!properties.some(p => p.name === 'CreatedAt')) {
        properties.push({ name: 'CreatedAt', type: 'DateTime' });
    }
    if (!properties.some(p => p.name === 'UpdatedAt')) {
        properties.push({ name: 'UpdatedAt', type: 'DateTime' });
    }
    
    return properties;
}

function generateEntityModel(entityName, properties) {
    return `using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class ${entityName}
    {
${properties.map(prop => `        ${generateProperty(prop)}`).join('\\n')}
    }
}`;
}

function generateDtoModel(entityName, properties) {
    const createDto = `using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace YourNamespace.DTOs
{
    public class Create${entityName}Dto
    {
${properties.filter(p => p.name !== 'Id' && p.name !== 'CreatedAt' && p.name !== 'UpdatedAt').map(prop => `        ${generateProperty(prop)}`).join('\\n')}
    }
}`;

    const updateDto = `
    public class Update${entityName}Dto
    {
${properties.filter(p => p.name !== 'CreatedAt' && p.name !== 'UpdatedAt').map(prop => `        ${generateProperty(prop)}`).join('\\n')}
    }`;

    const responseDto = `
    public class ${entityName}ResponseDto
    {
${properties.map(prop => `        ${generateProperty(prop)}`).join('\\n')}
    }
}`;

    return createDto + updateDto + responseDto;
}

function generateControllerModel(entityName, properties) {
    return `using Microsoft.AspNetCore.Mvc;
using YourNamespace.Models;
using YourNamespace.DTOs;
using YourNamespace.Services;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ${entityName}Controller : ControllerBase
    {
        private readonly I${entityName}Service _${entityName.toLowerCase()}Service;

        public ${entityName}Controller(I${entityName}Service ${entityName.toLowerCase()}Service)
        {
            _${entityName.toLowerCase()}Service = ${entityName.toLowerCase()}Service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<${entityName}ResponseDto>>> GetAll()
        {
            var ${entityName.toLowerCase()}s = await _${entityName.toLowerCase()}Service.GetAllAsync();
            return Ok(${entityName.toLowerCase()}s);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<${entityName}ResponseDto>> GetById(int id)
        {
            var ${entityName.toLowerCase()} = await _${entityName.toLowerCase()}Service.GetByIdAsync(id);
            if (${entityName.toLowerCase()} == null)
                return NotFound();

            return Ok(${entityName.toLowerCase()});
        }

        [HttpPost]
        public async Task<ActionResult<${entityName}ResponseDto>> Create(Create${entityName}Dto create${entityName}Dto)
        {
            var ${entityName.toLowerCase()} = await _${entityName.toLowerCase()}Service.CreateAsync(create${entityName}Dto);
            return CreatedAtAction(nameof(GetById), new { id = ${entityName.toLowerCase()}.Id }, ${entityName.toLowerCase()});
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<${entityName}ResponseDto>> Update(int id, Update${entityName}Dto update${entityName}Dto)
        {
            var ${entityName.toLowerCase()} = await _${entityName.toLowerCase()}Service.UpdateAsync(id, update${entityName}Dto);
            if (${entityName.toLowerCase()} == null)
                return NotFound();

            return Ok(${entityName.toLowerCase()});
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var success = await _${entityName.toLowerCase()}Service.DeleteAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}`;
}

function generateProperty(prop) {
    let property = '';
    
    // Add validation attributes
    if (prop.name === 'Id') {
        property += '[Key]\\n        ';
    } else if (prop.type === 'string') {
        property += '[Required]\\n        ';
    }
    
    // Add property declaration
    property += `public ${prop.type} ${prop.name} { get; set; }`;
    
    return property;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =================== INITIALIZATION ===================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize color converter
    const colorInput = document.getElementById('colorInput');
    const colorPicker = document.getElementById('colorPicker');
    
    if (colorInput) {
        colorInput.addEventListener('input', updateColorConversions);
        updateColorConversions();
    }
    
    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            const colorInput = document.getElementById('colorInput');
            if (colorInput) {
                colorInput.value = e.target.value;
                updateColorConversions();
            }
        });
    }
    
    // Initialize timestamp converter with current time
    useCurrentTime();
});
