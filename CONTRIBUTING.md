# Contributing to .NET Tools

Thank you for your interest in contributing to .NET Tools! We welcome contributions from everyone.

## How to Contribute

### 🐛 Reporting Bugs

If you find a bug, please create an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### 💡 Suggesting Features

We love new ideas! When suggesting a feature:
- Check if it already exists or has been requested
- Provide a clear use case
- Describe the expected functionality
- Consider if it fits the project's scope

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes**: Ensure your code follows our style guidelines
4. **Test thoroughly**: Make sure all tools work as expected
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: `git push origin feature-name`
7. **Create a Pull Request**: Provide a clear description of your changes

### 📝 Documentation

Help improve our documentation by:
- Fixing typos or unclear explanations
- Adding code examples
- Improving README or other docs
- Creating tutorials or guides

## Development Guidelines

### Code Style
- Use semantic HTML5 elements
- Follow modern JavaScript ES6+ practices
- Keep CSS organized and well-commented
- Ensure responsive design works on all devices

### New Tools
When adding a new tool:
- Create a new card in the tools grid
- Add appropriate functionality in `script.js`
- Include proper error handling
- Add clear descriptions and examples
- Ensure it works offline (no external API calls)

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Verify all tools work without internet connection
- Check for accessibility compliance

## Project Structure

```
.net-tools/
├── index.html              # Main page with tools
├── version-comparison.html  # Version comparison page
├── contact.html            # Contact and support page
├── styles.css              # All styles
├── script.js               # Main tools functionality
├── version-comparison.js   # Version comparison logic
├── README.md               # Project documentation
└── .github/
    └── workflows/
        └── pages.yml       # GitHub Pages deployment
```

## Tool Ideas

Looking for contribution ideas? Consider adding:
- Base64 encoder/decoder
- URL encoder/decoder
- Hash generator (MD5, SHA1, SHA256)
- Color converter (HEX, RGB, HSL)
- Lorem ipsum generator
- Markdown to HTML converter
- XML formatter/validator
- SQL formatter
- Connection string builder

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub
- Reach out via the contact page

## Code of Conduct

Please be respectful and constructive in all interactions. We're here to learn and build together!

---

Thank you for contributing to .NET Tools! 🎉