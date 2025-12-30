# Contributing to Tmail

First off, thank you for considering contributing to Tmail! It's people like you that make Tmail such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report**
- Check the debugging guide
- Check the FAQs on the wiki
- Perform a cursory search to see if the problem has already been reported

**How Do I Submit A (Good) Bug Report?**
Bugs are tracked as GitHub issues. Explain the problem and include additional details to help maintainers reproduce the problem:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots and animated GIFs if possible

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion**
- Check if there's already a package which provides that enhancement
- Determine which repository the enhancement should be suggested in

**How Do I Submit A (Good) Enhancement Suggestion?**
Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful to most Tmail users

### Your First Code Contribution

Unsure where to begin contributing to Tmail? You can start by looking through these `good-first-issue` and `help-wanted` issues:


### Development Setup

1. Fork the repository
2. Clone your fork locally
   ```bash
   git clone https://github.com/yourusername/tmail.git
   cd tmail
   ```
3. Set up the development environment
   ```bash
   uv venv
   source .venv/bin/activate
   uv pip install -r requirements.txt
   uv pip install -r requirements-dev.txt  # Development dependencies
   ```
4. Create a branch for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes and commit
6. Push to your fork and create a Pull Request

### Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build
2. Update the README.md with details of changes to the interface, if applicable
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
4. Your Pull Request will be merged once you have the sign-off of at least one other developer

### Coding Standards

#### Python/Django Code
- Follow PEP 8 guidelines
- Use Django's coding style
- Include type hints where applicable
- Write docstrings for all public methods and classes

#### JavaScript Code
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names

#### CSS/SCSS Code
- Use BEM naming convention
- Keep SCSS modular and organized
- Use variables for colors, fonts, and sizes

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Include both unit tests and integration tests where applicable
- Test across different browsers if frontend changes are made

### Documentation

- Update documentation for any changed functionality
- Add comments for complex logic
- Update the README if installation or usage instructions change
- Keep the CHANGELOG updated

## Suggested Areas for Contribution

### High Priority
1. **Forward Email Functionality** - Implement forward email feature
2. **Email Search** - Add search functionality across emails
3. **Email Attachments** - Support for file attachments
4. **Email Filters** - Create rules for automatic email organization

### Medium Priority
1. **Themes Support** - Dark/Light mode toggle
2. **Keyboard Shortcuts** - Productivity shortcuts
3. **Bulk Operations** - Select multiple emails for actions
4. **Email Signatures** - Customizable email signatures

### Low Priority
1. **Email Templates** - Pre-written email templates
2. **Calendar Integration** - Link emails to calendar events
3. **Email Analytics** - Statistics on email usage
4. **Mobile App** - React Native mobile application

## Recognition

Contributors who have their pull requests merged will be added to our contributors list and highlighted in our release notes.

## Questions?

Feel free to contact the maintainers or open an issue for discussion.

Thank you for contributing to Tmail! 🚀
