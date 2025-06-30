// Clean Navigation System for .NET Tools
// Simplified, reliable navigation with no animation conflicts

class NavigationManager {
    constructor() {
        this.mobileMenu = null;
        this.mobileOverlay = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.bindEvents();
            this.initializeTheme();
            this.setActiveNavigation();
            this.isInitialized = true;
        });
    }

    setupElements() {
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        
        // Create mobile overlay if it doesn't exist
        if (!this.mobileOverlay && this.mobileMenu) {
            this.mobileOverlay = document.createElement('div');
            this.mobileOverlay.id = 'mobileOverlay';
            this.mobileOverlay.className = 'mobile-overlay';
            document.body.appendChild(this.mobileOverlay);
        }
    }

    bindEvents() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuClose = document.getElementById('mobileMenuClose');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openMobileMenu();
            });
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMobileMenu();
            });
        }

        // Close mobile menu when clicking overlay
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu?.classList.contains('open')) {
                this.closeMobileMenu();
            }
        });

        // Handle navigation links
        document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.add('open');
            if (this.mobileOverlay) {
                this.mobileOverlay.classList.add('open');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.remove('open');
            if (this.mobileOverlay) {
                this.mobileOverlay.classList.remove('open');
            }
            document.body.style.overflow = '';
        }
    }

    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Close mobile menu first
        this.closeMobileMenu();
        
        // Handle internal anchor links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                this.scrollToElement(target);
            }
        }
        // For external links or page navigation, let default behavior happen
        // but ensure no event propagation issues
        e.stopPropagation();
    }

    scrollToElement(element) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const elementPosition = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Set active class based on current page
        if (currentPage === '' || currentPage === 'index.html') {
            const homeLink = document.querySelector('.nav-link[href="./index.html"], .nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        } else if (currentPage === 'contact.html') {
            const contactLink = document.querySelector('.nav-link[href="./contact.html"]');
            if (contactLink) contactLink.classList.add('active');
        } else if (currentPage === 'version-comparison.html') {
            const versionLink = document.querySelector('.nav-link[href="./version-comparison.html"]');
            if (versionLink) versionLink.classList.add('active');
        }
    }

    initializeTheme() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }
}

// Simple animation utilities
class AnimationUtils {
    static observeElements() {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    static addFadeInEffect() {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Tab system for tools
class TabManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindTabEvents();
        });
    }

    bindTabEvents() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(button);
            });
        });
    }

    switchTab(clickedButton) {
        const targetTab = clickedButton.getAttribute('data-tab');
        const tabContainer = clickedButton.closest('.tools-tabs');
        
        if (!tabContainer || !targetTab) return;

        // Remove active class from all buttons and panels in this container
        tabContainer.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        tabContainer.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Add active class to clicked button and corresponding panel
        clickedButton.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }
}

// Utility functions for tools
class ToolUtils {
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    static showCopyFeedback(element) {
        const originalText = element.textContent;
        const originalBg = element.style.backgroundColor;
        const originalColor = element.style.color;
        
        element.textContent = 'Copied!';
        element.style.backgroundColor = 'var(--success-color)';
        element.style.color = 'white';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.backgroundColor = originalBg;
            element.style.color = originalColor;
        }, 1000);
    }

    static toPascalCase(str) {
        return str.replace(/(?:^|\\s)\\w/g, match => match.toUpperCase()).replace(/\\s+/g, '');
    }

    static toCamelCase(str) {
        const pascal = ToolUtils.toPascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }

    static toSnakeCase(str) {
        return str.replace(/(?<!^)(?=[A-Z])/g, '_').toLowerCase().replace(/\\s+/g, '_');
    }

    static toKebabCase(str) {
        return str.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase().replace(/\\s+/g, '-');
    }

    static toConstantCase(str) {
        return ToolUtils.toSnakeCase(str).toUpperCase();
    }
}

// Initialize everything
const navigation = new NavigationManager();
const tabManager = new TabManager();

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AnimationUtils.observeElements();
    AnimationUtils.addFadeInEffect();
    
    // Add click handlers for copyable elements
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('selectable') || 
            e.target.classList.contains('hash-value') || 
            e.target.classList.contains('base-value')) {
            const success = await ToolUtils.copyToClipboard(e.target.textContent);
            if (success) {
                ToolUtils.showCopyFeedback(e.target);
            }
        }
    });
});

// Tool functions - keeping the essential ones from the original script
function convertJsonToCsharp() {
    const jsonInput = document.getElementById('jsonInput')?.value.trim();
    const useNullable = document.getElementById('useNullable')?.checked;
    const useAttributes = document.getElementById('useAttributes')?.checked;
    const useRecords = document.getElementById('useRecords')?.checked;
    const rootClassName = document.getElementById('rootClassName')?.value || 'RootObject';
    const output = document.getElementById('csharpOutput');
    
    if (!jsonInput || !output) return;
    
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
    // Simplified C# generation logic
    const properties = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const propertyName = ToolUtils.toPascalCase(key);
        let propertyType = getJsonType(value, useNullable);
        
        let propertyDef = '';
        if (useAttributes && key !== propertyName.toLowerCase()) {
            propertyDef += `    [JsonPropertyName("${key}")]\\n`;
        }
        
        if (useRecords) {
            propertyDef += `    ${propertyType} ${propertyName}`;
        } else {
            propertyDef += `    public ${propertyType} ${propertyName} { get; set; }`;
        }
        
        properties.push(propertyDef);
    }
    
    let result = '';
    if (useAttributes) {
        result += 'using System.Text.Json.Serialization;\\n';
    }
    result += 'using System.Collections.Generic;\\n\\n';
    
    if (useRecords) {
        result += `public record ${className}(\\n${properties.join(',\\n')}\\n);`;
    } else {
        result += `public class ${className}\\n{\\n${properties.join('\\n')}\\n}`;
    }
    
    return result;
}

function getJsonType(value, useNullable) {
    if (value === null) return useNullable ? 'string?' : 'string';
    
    switch (typeof value) {
        case 'string':
            return useNullable ? 'string?' : 'string';
        case 'number':
            return Number.isInteger(value) ? 'int' : 'double';
        case 'boolean':
            return 'bool';
        case 'object':
            if (Array.isArray(value)) {
                if (value.length === 0) return 'List<object>';
                const itemType = getJsonType(value[0], useNullable);
                return `List<${itemType}>`;
            }
            return 'object';
        default:
            return 'object';
    }
}

// Case converter function
function updateCaseConversions() {
    const input = document.getElementById('stringInput')?.value || '';
    
    if (input) {
        const pascalCase = document.getElementById('pascalCase');
        const camelCase = document.getElementById('camelCase');
        const snakeCase = document.getElementById('snakeCase');
        const kebabCase = document.getElementById('kebabCase');
        const constantCase = document.getElementById('constantCase');
        
        if (pascalCase) pascalCase.textContent = ToolUtils.toPascalCase(input);
        if (camelCase) camelCase.textContent = ToolUtils.toCamelCase(input);
        if (snakeCase) snakeCase.textContent = ToolUtils.toSnakeCase(input);
        if (kebabCase) kebabCase.textContent = ToolUtils.toKebabCase(input);
        if (constantCase) constantCase.textContent = ToolUtils.toConstantCase(input);
    }
}

// GUID Generator
function generateGuids() {
    const count = parseInt(document.getElementById('guidCount')?.value) || 1;
    const format = document.getElementById('guidFormat')?.value || 'standard';
    const output = document.getElementById('guidOutput');
    
    if (!output) return;
    
    const guids = [];
    for (let i = 0; i < count; i++) {
        const guid = generateGuid();
        guids.push(formatGuid(guid, format));
    }
    
    output.textContent = guids.join('\\n');
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
    const input = document.getElementById('guidValidationInput')?.value.trim();
    const result = document.getElementById('guidValidationResult');
    
    if (!input || !result) return;
    
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

// Initialize case converter if element exists
document.addEventListener('DOMContentLoaded', () => {
    const stringInput = document.getElementById('stringInput');
    if (stringInput) {
        stringInput.addEventListener('input', updateCaseConversions);
        updateCaseConversions(); // Initial update
    }
});
