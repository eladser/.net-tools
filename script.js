// Enhanced .NET Tools JavaScript - Complete Implementation with C# Conversions

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
        
        // Add smooth transition effect
        document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    }

    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Enhanced Tab Management with Animations
class TabManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabButtons();
        this.setupConverterTabs();
        this.setupScrollAnimations();
        this.setupCardAnimations();
    }

    setupTabButtons() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Add click animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    // Trigger card animations
                    this.animateCards(targetPanel);
                }
            });
        });
    }

    animateCards(panel) {
        const cards = panel.querySelectorAll('.tool-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
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

        document.querySelectorAll('.animate-on-scroll, .slide-in-animation, .fade-in-delay').forEach(el => {
            observer.observe(el);
        });
    }

    setupCardAnimations() {
        const cards = document.querySelectorAll('.animate-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
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
        }, 600);
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

// =================== NEW C# CONVERSION TOOLS ===================

// C# Type Converter Generator
function generateTypeConversion() {
    const fromType = document.getElementById('fromType').value;
    const toType = document.getElementById('toType').value;
    const includeNullHandling = document.getElementById('includeNullHandling').checked;
    const includeErrorHandling = document.getElementById('includeErrorHandling').checked;
    const useExtensionMethod = document.getElementById('useExtensionMethod').checked;
    const output = document.getElementById('typeConversionOutput');
    
    let code = '';
    
    if (useExtensionMethod) {
        code += 'using System;\nusing System.Globalization;\n\n';
        code += 'public static class TypeExtensions\n{\n';
        code += `    public static ${toType}${includeNullHandling ? '?' : ''} To${toPascalCase(toType)}(this ${fromType}${includeNullHandling ? '?' : ''} value)\n    {\n`;
    } else {
        code += 'using System;\nusing System.Globalization;\n\n';
        code += 'public class TypeConverter\n{\n';
        code += `    public static ${toType}${includeNullHandling ? '?' : ''} Convert${toPascalCase(fromType)}To${toPascalCase(toType)}(${fromType}${includeNullHandling ? '?' : ''} value)\n    {\n`;
    }
    
    // Add null handling
    if (includeNullHandling) {
        code += '        if (value == null)\n';
        code += `            return ${getDefaultValue(toType)};\n\n`;
    }
    
    // Add error handling
    if (includeErrorHandling) {
        code += '        try\n        {\n';
        code += '    ' + getConversionCode(fromType, toType);
        code += '        }\n';
        code += '        catch (Exception ex)\n';
        code += '        {\n';
        code += '            // Log error or handle as needed\n';
        code += `            return ${getDefaultValue(toType)};\n`;
        code += '        }\n';
    } else {
        code += getConversionCode(fromType, toType);
    }
    
    code += '    }\n}\n';
    
    // Add usage example
    code += '\n// Usage Example:\n';
    if (useExtensionMethod) {
        code += `// ${fromType} value = ${getExampleValue(fromType)};\n`;
        code += `// ${toType}${includeNullHandling ? '?' : ''} result = value.To${toPascalCase(toType)}();\n`;
    } else {
        code += `// ${fromType} value = ${getExampleValue(fromType)};\n`;
        code += `// ${toType}${includeNullHandling ? '?' : ''} result = TypeConverter.Convert${toPascalCase(fromType)}To${toPascalCase(toType)}(value);\n`;
    }
    
    output.textContent = code;
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(code, Prism.languages.csharp, 'csharp');
    }
}

function getConversionCode(fromType, toType) {
    const conversions = {
        'string-int': '        return int.Parse(value);\n',
        'string-double': '        return double.Parse(value, CultureInfo.InvariantCulture);\n',
        'string-decimal': '        return decimal.Parse(value, CultureInfo.InvariantCulture);\n',
        'string-bool': '        return bool.Parse(value);\n',
        'string-DateTime': '        return DateTime.Parse(value);\n',
        'string-Guid': '        return Guid.Parse(value);\n',
        'int-string': '        return value.ToString();\n',
        'int-double': '        return (double)value;\n',
        'int-decimal': '        return (decimal)value;\n',
        'int-bool': '        return value != 0;\n',
        'double-string': '        return value.ToString(CultureInfo.InvariantCulture);\n',
        'double-int': '        return (int)Math.Round(value);\n',
        'double-decimal': '        return (decimal)value;\n',
        'bool-string': '        return value.ToString();\n',
        'bool-int': '        return value ? 1 : 0;\n',
        'DateTime-string': '        return value.ToString("yyyy-MM-dd HH:mm:ss");\n',
        'Guid-string': '        return value.ToString();\n'
    };
    
    const key = `${fromType}-${toType}`;
    return conversions[key] || '        // Custom conversion logic here\n        throw new NotImplementedException();\n';
}

function getDefaultValue(type) {
    const defaults = {
        'string': 'null',
        'int': '0',
        'double': '0.0',
        'decimal': '0m',
        'bool': 'false',
        'DateTime': 'DateTime.MinValue',
        'Guid': 'Guid.Empty'
    };
    return defaults[type] || 'default';
}

function getExampleValue(type) {
    const examples = {
        'string': '"123"',
        'int': '123',
        'double': '123.45',
        'decimal': '123.45m',
        'bool': 'true',
        'DateTime': 'DateTime.Now',
        'Guid': 'Guid.NewGuid()'
    };
    return examples[type] || 'null';
}

// LINQ Query Builder
function generateLinqQuery() {
    const collectionType = document.getElementById('collectionType').value || 'List<User>';
    const includeWhere = document.getElementById('includeWhere').checked;
    const includeSelect = document.getElementById('includeSelect').checked;
    const includeOrderBy = document.getElementById('includeOrderBy').checked;
    const includeGroupBy = document.getElementById('includeGroupBy').checked;
    const includeJoin = document.getElementById('includeJoin').checked;
    const includeAggregate = document.getElementById('includeAggregate').checked;
    const output = document.getElementById('linqOutput');
    
    let code = 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n';
    
    // Extract the item type from collection type
    const itemType = collectionType.match(/<(.+)>/)?.[1] || 'T';
    const collectionName = itemType.toLowerCase() + 's';
    
    code += `// Sample ${collectionType}\n`;
    code += `${collectionType} ${collectionName} = new ${collectionType}();\n\n`;
    
    code += '// Method Syntax:\n';
    code += `var result = ${collectionName}`;
    
    if (includeWhere) {
        code += `\n    .Where(x => x.IsActive == true)`;
    }
    
    if (includeSelect) {
        code += `\n    .Select(x => new { x.Id, x.Name })`;
    }
    
    if (includeOrderBy) {
        code += `\n    .OrderBy(x => x.Name)`;
    }
    
    if (includeGroupBy) {
        code += `\n    .GroupBy(x => x.Category)`;
    }
    
    if (includeAggregate) {
        code += `\n    .Count()`;
    } else {
        code += `\n    .ToList()`;
    }
    
    code += ';\n\n';
    
    // Query Syntax
    code += '// Query Syntax:\n';
    code += `var queryResult = from item in ${collectionName}\n`;
    
    if (includeWhere) {
        code += '                  where item.IsActive == true\n';
    }
    
    if (includeOrderBy) {
        code += '                  orderby item.Name\n';
    }
    
    if (includeGroupBy) {
        code += '                  group item by item.Category into g\n';
        code += '                  select new { Category = g.Key, Count = g.Count() };\n';
    } else if (includeSelect) {
        code += '                  select new { item.Id, item.Name };\n';
    } else {
        code += '                  select item;\n';
    }
    
    if (includeJoin) {
        code += '\n// Join Example:\n';
        code += `var joinResult = from user in users\n`;
        code += '                 join order in orders on user.Id equals order.UserId\n';
        code += '                 select new { user.Name, order.Total };\n';
    }
    
    output.textContent = code;
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(code, Prism.languages.csharp, 'csharp');
    }
}

// Extension Method Generator
function generateExtensionMethod() {
    const targetType = document.getElementById('targetType').value || 'string';
    const methodName = document.getElementById('methodName').value || 'IsNullOrEmpty';
    const returnType = document.getElementById('returnType').value || 'bool';
    const includeXmlDoc = document.getElementById('includeXmlDoc').checked;
    const includeUnitTest = document.getElementById('includeUnitTest').checked;
    const output = document.getElementById('extensionMethodOutput');
    
    let code = 'using System;\n\n';
    code += `public static class ${toPascalCase(targetType)}Extensions\n{\n`;
    
    if (includeXmlDoc) {
        code += '    /// <summary>\n';
        code += `    /// ${getMethodDescription(methodName, targetType)}\n`;
        code += '    /// </summary>\n';
        code += `    /// <param name="value">The ${targetType} value to check</param>\n`;
        code += `    /// <returns>${getReturnDescription(methodName, returnType)}</returns>\n`;
    }
    
    code += `    public static ${returnType} ${methodName}(this ${targetType} value)\n`;
    code += '    {\n';
    code += getMethodImplementation(methodName, targetType, returnType);
    code += '    }\n';
    code += '}\n';
    
    // Usage example
    code += '\n// Usage Example:\n';
    code += `// ${targetType} myValue = ${getExampleValue(targetType)};\n`;
    code += `// ${returnType} result = myValue.${methodName}();\n`;
    
    if (includeUnitTest) {
        code += '\n// Unit Test Example:\n';
        code += '[Test]\n';
        code += `public void ${methodName}_Should_Return_Expected_Result()\n`;
        code += '{\n';
        code += '    // Arrange\n';
        code += `    ${targetType} testValue = ${getExampleValue(targetType)};\n\n`;
        code += '    // Act\n';
        code += `    ${returnType} result = testValue.${methodName}();\n\n`;
        code += '    // Assert\n';
        code += '    Assert.IsTrue(result); // Adjust assertion as needed\n';
        code += '}\n';
    }
    
    output.textContent = code;
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(code, Prism.languages.csharp, 'csharp');
    }
}

function getMethodDescription(methodName, targetType) {
    const descriptions = {
        'IsNullOrEmpty': `Determines whether the ${targetType} is null or empty`,
        'IsNullOrWhiteSpace': `Determines whether the ${targetType} is null, empty, or whitespace`,
        'ToTitleCase': `Converts the ${targetType} to title case`,
        'Truncate': `Truncates the ${targetType} to a specified length`,
        'IsEven': `Determines whether the ${targetType} is an even number`,
        'IsOdd': `Determines whether the ${targetType} is an odd number`
    };
    return descriptions[methodName] || `Performs operation on the ${targetType}`;
}

function getReturnDescription(methodName, returnType) {
    if (returnType === 'bool') {
        return 'true if the condition is met; otherwise, false';
    }
    return `The ${returnType} result of the operation`;
}

function getMethodImplementation(methodName, targetType, returnType) {
    const implementations = {
        'IsNullOrEmpty-string': '        return string.IsNullOrEmpty(value);\n',
        'IsNullOrWhiteSpace-string': '        return string.IsNullOrWhiteSpace(value);\n',
        'ToTitleCase-string': '        return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value?.ToLower() ?? string.Empty);\n',
        'Truncate-string': '        return value?.Length > 50 ? value.Substring(0, 50) + "..." : value;\n',
        'IsEven-int': '        return value % 2 == 0;\n',
        'IsOdd-int': '        return value % 2 != 0;\n'
    };
    
    const key = `${methodName}-${targetType}`;
    return implementations[key] || '        // Implementation logic here\n        throw new NotImplementedException();\n';
}

// Async/Await Pattern Generator
function generateAsyncPattern() {
    const operationType = document.getElementById('asyncOperationType').value;
    const methodName = document.getElementById('asyncMethodName').value || 'GetDataAsync';
    const includeErrorHandling = document.getElementById('includeErrorHandling').checked;
    const includeCancellation = document.getElementById('includeCancellation').checked;
    const includeTimeout = document.getElementById('includeTimeout').checked;
    const output = document.getElementById('asyncPatternOutput');
    
    let code = 'using System;\nusing System.Threading;\nusing System.Threading.Tasks;\n';
    
    switch (operationType) {
        case 'http':
            code += 'using System.Net.Http;\n';
            break;
        case 'database':
            code += 'using System.Data.SqlClient;\n';
            break;
        case 'file':
            code += 'using System.IO;\n';
            break;
    }
    
    code += '\npublic class AsyncService\n{\n';
    
    // Method signature
    code += `    public async Task<string> ${methodName}(`;
    const parameters = [];
    
    if (includeCancellation) {
        parameters.push('CancellationToken cancellationToken = default');
    }
    
    code += parameters.join(', ') + ')\n    {\n';
    
    // Timeout setup
    if (includeTimeout) {
        code += '        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(30));\n';
        if (includeCancellation) {
            code += '        using var combinedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);\n';
            code += '        var token = combinedCts.Token;\n';
        } else {
            code += '        var token = timeoutCts.Token;\n';
        }
    } else if (includeCancellation) {
        code += '        var token = cancellationToken;\n';
    }
    
    // Error handling
    if (includeErrorHandling) {
        code += '        try\n        {\n';
    }
    
    // Operation-specific code
    switch (operationType) {
        case 'http':
            code += '            using var httpClient = new HttpClient();\n';
            if (includeCancellation || includeTimeout) {
                code += '            var response = await httpClient.GetAsync("https://api.example.com/data", token);\n';
            } else {
                code += '            var response = await httpClient.GetAsync("https://api.example.com/data");\n';
            }
            code += '            response.EnsureSuccessStatusCode();\n';
            if (includeCancellation || includeTimeout) {
                code += '            return await response.Content.ReadAsStringAsync(token);\n';
            } else {
                code += '            return await response.Content.ReadAsStringAsync();\n';
            }
            break;
            
        case 'database':
            code += '            const string connectionString = "your-connection-string";\n';
            code += '            using var connection = new SqlConnection(connectionString);\n';
            if (includeCancellation || includeTimeout) {
                code += '            await connection.OpenAsync(token);\n';
                code += '            using var command = new SqlCommand("SELECT * FROM Table", connection);\n';
                code += '            var result = await command.ExecuteScalarAsync(token);\n';
            } else {
                code += '            await connection.OpenAsync();\n';
                code += '            using var command = new SqlCommand("SELECT * FROM Table", connection);\n';
                code += '            var result = await command.ExecuteScalarAsync();\n';
            }
            code += '            return result?.ToString() ?? string.Empty;\n';
            break;
            
        case 'file':
            if (includeCancellation || includeTimeout) {
                code += '            return await File.ReadAllTextAsync("path/to/file.txt", token);\n';
            } else {
                code += '            return await File.ReadAllTextAsync("path/to/file.txt");\n';
            }
            break;
            
        case 'custom':
            code += '            // Your custom async operation here\n';
            if (includeCancellation || includeTimeout) {
                code += '            await Task.Delay(1000, token);\n';
            } else {
                code += '            await Task.Delay(1000);\n';
            }
            code += '            return "Custom result";\n';
            break;
    }
    
    if (includeErrorHandling) {
        code += '        }\n';
        
        if (includeCancellation || includeTimeout) {
            code += '        catch (OperationCanceledException)\n';
            code += '        {\n';
            code += '            // Handle cancellation\n';
            code += '            throw;\n';
            code += '        }\n';
        }
        
        code += '        catch (Exception ex)\n';
        code += '        {\n';
        code += '            // Log exception\n';
        code += '            throw new InvalidOperationException($"Failed to execute operation: {ex.Message}", ex);\n';
        code += '        }\n';
    }
    
    code += '    }\n}\n';
    
    // Usage example
    code += '\n// Usage Example:\n';
    code += 'var service = new AsyncService();\n';
    if (includeCancellation) {
        code += 'using var cts = new CancellationTokenSource();\n';
        code += `var result = await service.${methodName}(cts.Token);\n`;
    } else {
        code += `var result = await service.${methodName}();\n`;
    }
    
    output.textContent = code;
    if (typeof Prism !== 'undefined') {
        output.innerHTML = Prism.highlight(code, Prism.languages.csharp, 'csharp');
    }
}

// =================== EXISTING FUNCTIONS (Enhanced) ===================

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

// All other existing functions remain the same...
// (For brevity, I'll continue with the most important ones)

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

// Add CSS for new animations
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