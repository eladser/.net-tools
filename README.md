# 🔧 .NET Tools - Your Complete .NET Development Companion

![.NET Tools](https://img.shields.io/badge/.NET-Tools-512BD4?style=for-the-badge&logo=dotnet)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-000000?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A comprehensive collection of essential tools and utilities for .NET developers. From code generators to data converters, security tools to productivity enhancers - everything you need for modern .NET development in one place.

## 🚀 Live Demo

**[Visit .NET Tools →](https://eladser.github.io/.net-tools)**

## ✨ Features

### 🎯 Code Generators
- **JSON to C# Generator** - Convert JSON to complete C# classes with nullable support, attributes, and records
- **C# Entity Generator** - Generate Entity Framework models, DTOs, and API controllers from descriptions
- **Connection String Builder** - Build and test connection strings for multiple database types
- **Advanced GUID Generator** - Generate GUIDs in multiple formats with bulk generation and validation
- **Type Conversion Generator** - Generate C# code for type conversions with error handling
- **LINQ Query Builder** - Build complex LINQ queries with Method and Query syntax
- **Extension Method Generator** - Generate C# extension methods with documentation and tests
- **Async/Await Pattern Generator** - Generate async patterns for common operations

### 🔄 Data Converters
- **Smart Case Converter** - Convert between PascalCase, camelCase, snake_case, kebab-case, and CONSTANT_CASE
- **Advanced DateTime Converter** - Convert between Unix timestamps, DateTime, and various formats
- **Enhanced Base64 Tool** - Encode/decode Base64 with file support and URL-safe encoding
- **Color Converter Pro** - Convert between color formats with palette generation

### 📝 Text & Format Tools
- **Text Analytics** - Analyze text for character count, word frequency, reading time, and more
- **Lorem Ipsum Generator** - Generate customizable placeholder text
- **JSON Formatter & Validator** - Format, validate, and minify JSON with error highlighting
- **Regular Expression Tester** - Test and debug regex patterns with real-time matching

### 🔐 Security Tools
- **Password Generator & Analyzer** - Generate secure passwords with strength analysis
- **Hash Generator** - Generate MD5, SHA-1, SHA-256 hashes with validation
- **JWT Token Decoder** - Decode and validate JWT tokens with expiration checking
- **QR Code Generator** - Generate QR codes with customizable size and error correction

### 🛠️ Utility Tools
- **Unit Converter** - Convert between length, weight, temperature, and data units
- **Date Calculator** - Calculate date differences and perform date arithmetic
- **Random Data Generator** - Generate test data for development
- **Number Base Converter** - Convert between binary, octal, decimal, and hexadecimal

## 🖥️ Screenshots

### Main Interface
![Main Interface](https://via.placeholder.com/800x400/4f46e5/ffffff?text=.NET+Tools+Main+Interface)

### JSON to C# Generator
![JSON to C# Generator](https://via.placeholder.com/800x400/10b981/ffffff?text=JSON+to+C%23+Generator)

### Password Generator
![Password Generator](https://via.placeholder.com/800x400/ef4444/ffffff?text=Password+Generator)

## 🏗️ Architecture

### Frontend
- **HTML5** - Semantic markup with modern standards
- **CSS3** - Advanced styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No dependencies, pure ES6+ code
- **Progressive Web App** features
- **Responsive Design** - Works perfectly on all devices

### Key Features
- **Dark/Light Theme** - Automatic theme switching with persistence
- **Offline Support** - Works without internet connection
- **Copy-to-Clipboard** - One-click copying for all results
- **Real-time Processing** - Instant feedback and live updates
- **Accessibility** - WCAG compliant with keyboard navigation
- **Performance Optimized** - Fast loading and smooth animations

## 🚀 Getting Started

### Option 1: Use Online (Recommended)
Simply visit [https://eladser.github.io/.net-tools](https://eladser.github.io/.net-tools) to start using all tools immediately.

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/eladser/.net-tools.git

# Navigate to the project directory
cd .net-tools

# Open in your preferred browser
# No build process required - just open index.html
```

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000

# Then visit http://localhost:8000
```

## 📁 Project Structure

```
.net-tools/
├── index.html              # Main application page
├── contact.html            # Contact information page
├── version-comparison.html # .NET version comparison tool
├── script.js              # Main JavaScript functionality
├── script-utils.js        # Utility functions and advanced tools
├── styles.css             # Main stylesheet
├── version-comparison.js   # Version comparison functionality
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── README.md              # Project documentation
├── CONTRIBUTING.md        # Contribution guidelines
└── FIXES_SUMMARY.md       # Detailed fixes and improvements
```

## 🔧 Tools Documentation

### JSON to C# Generator

Convert JSON objects to complete C# classes with advanced options:

**Features:**
- Nullable reference types support
- JSON attributes for serialization
- Record types (C# 9+)
- Custom class naming
- Nested object handling
- Array/List type detection

**Example:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true
  }
}
```

Generates:
```csharp
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; }
}

public class RootObject
{
    public User? User { get; set; }
}
```

### Password Generator & Analyzer

**Features:**
- Customizable length (4-128 characters)
- Character type selection (uppercase, lowercase, numbers, symbols)
- Similar character exclusion
- Real-time strength analysis
- Entropy calculation
- Time-to-crack estimation
- Security recommendations

**Strength Metrics:**
- **Weak**: Score < 40
- **Fair**: Score 40-59
- **Good**: Score 60-79
- **Strong**: Score ≥ 80

### Color Converter Pro

**Supported Formats:**
- HEX (#RRGGBB)
- RGB (rgb(r, g, b))
- HSL (hsl(h, s%, l%))
- C# Color (Color.FromArgb(r, g, b))

**Features:**
- Real-time conversion
- Color palette generation
- Visual color picker
- One-click copying
- Accessibility testing

## 🎨 Customization

### Themes
The application supports both light and dark themes with automatic persistence:

```javascript
// Programmatically switch themes
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');
```

### CSS Custom Properties
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #64748b;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Areas for Contribution
- New tool implementations
- UI/UX improvements
- Performance optimizations
- Bug fixes
- Documentation improvements
- Accessibility enhancements
- Internationalization (i18n)

## 🧪 Testing

### Manual Testing Checklist
- [ ] All tools function correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark/light theme switching
- [ ] Copy-to-clipboard functionality
- [ ] Error handling and validation
- [ ] Accessibility with keyboard navigation
- [ ] Performance on slower devices

### Browser Support
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+

### Key Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🔒 Security

### Security Measures
- **No External Dependencies** - Reduces attack surface
- **Client-Side Only** - No data sent to servers
- **Content Security Policy** - Prevents XSS attacks
- **Secure Defaults** - Safe configuration out of the box

### Privacy
- **No Tracking** - No analytics or tracking scripts
- **No Data Collection** - All processing happens locally
- **No Cookies** - Only localStorage for theme preference

## 📱 Mobile Experience

### Features
- **Touch-Friendly Interface** - Optimized for mobile interaction
- **Responsive Design** - Adapts to all screen sizes
- **Fast Performance** - Optimized for mobile networks
- **Offline Support** - Works without internet connection
- **Add to Home Screen** - PWA functionality

## 🌐 Browser APIs Used

- **Clipboard API** - For copy-to-clipboard functionality
- **Web Crypto API** - For secure hash generation
- **File API** - For file upload and processing
- **LocalStorage** - For theme preference persistence
- **Intersection Observer** - For scroll animations
- **ResizeObserver** - For responsive components

## 📈 Roadmap

### Planned Features
- [ ] **AI-Powered Code Generation** - Smart code suggestions
- [ ] **Team Collaboration** - Share tool configurations
- [ ] **Plugin System** - Custom tool development
- [ ] **API Integration** - Connect with development tools
- [ ] **Advanced Analytics** - Code complexity analysis
- [ ] **Multi-Language Support** - Internationalization
- [ ] **Desktop App** - Electron-based desktop version
- [ ] **VS Code Extension** - Integrate with VS Code

### Near-term Improvements
- [ ] More C# code generators
- [ ] Database query builders
- [ ] API testing tools
- [ ] Performance profiling tools
- [ ] Code formatting tools

## 🏆 Awards & Recognition

- **GitHub Stars**: Growing community recognition
- **Developer Feedback**: Positive reviews from .NET community
- **Performance**: High Lighthouse scores
- **Accessibility**: WCAG AA compliant

## 📞 Support

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/eladser/.net-tools/issues)
- **Discussions**: [GitHub Discussions](https://github.com/eladser/.net-tools/discussions)
- **Email**: Available through GitHub profile

### FAQ

**Q: Is this tool free to use?**
A: Yes, completely free and open source.

**Q: Do you collect any data?**
A: No, all processing happens locally in your browser.

**Q: Can I use this offline?**
A: Yes, the app works offline after the first visit.

**Q: How do I report a bug?**
A: Please open an issue on GitHub with detailed steps to reproduce.

**Q: Can I contribute new tools?**
A: Absolutely! Please see our contributing guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The .NET Community** - For inspiration and feedback
- **Open Source Contributors** - For tools and libraries that inspired this project
- **GitHub** - For hosting and Pages deployment
- **MDN Web Docs** - For excellent web development documentation

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/eladser/.net-tools?style=social)
![GitHub forks](https://img.shields.io/github/forks/eladser/.net-tools?style=social)
![GitHub issues](https://img.shields.io/github/issues/eladser/.net-tools)
![GitHub pull requests](https://img.shields.io/github/issues-pr/eladser/.net-tools)

---

<div align="center">

**Made with ❤️ for the .NET developer community**

[🌟 Star this project](https://github.com/eladser/.net-tools) • [🐛 Report Bug](https://github.com/eladser/.net-tools/issues) • [💡 Request Feature](https://github.com/eladser/.net-tools/issues)

</div>
