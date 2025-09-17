# Contributing to Telkom Alumni

We welcome contributions to the Telkom Alumni project! 🎉

## How to Contribute

### Getting Started

1. Fork this repository
2. Clone your fork locally
3. Create a new branch for your changes
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

### Contribution Guidelines

#### 🔥 Vibe Coding

- **Code with passion!** We encourage creative and enthusiastic coding with AI 
- Experiment, innovate, and have fun with your implementations
- Don't be afraid to suggest new features or improvements
- All coding styles and approaches are welcome

#### 🔒 Security First

While we encourage a vibe coding environment, please be mindful of security:

- **Avoid critical security vulnerabilities** such as:

  - SQL injection
  - Cross-site scripting (XSS)
  - Authentication bypasses
  - Sensitive data exposure
  - Insecure dependencies

- If you're unsure about security implications, ask in the PR discussion

#### 📝 Pull Request Requirements

Your PR message should clearly describe:

1. **What was changed**

   - List the specific files/components modified
   - Describe the functionality added/removed/modified

2. **Why the change was made**

   - Reference any issues being fixed
   - Explain the motivation behind the change

3. **How to test the changes**
   - Provide steps to verify the changes work correctly
   - Include any new dependencies or setup requirements

#### Example PR Message Format:

```
## Changes Made
- Added new alumni search functionality in `AlumniContent.tsx`
- Updated API route in `api/alumni/route.ts` to support filtering
- Added search input component in `components/SearchInput.tsx`

## Why
Fixes #123 - Users needed ability to search alumni by name and graduation year

## Testing
1. Navigate to /alumni page
2. Enter search term in the search box
3. Verify results are filtered correctly
4. Test with various search criteria
```

### What We're Looking For

- **Bug fixes** - Help us squash those pesky bugs
- **Feature enhancements** - Make the platform even better
- **Performance improvements** - Speed things up
- **Documentation updates** - Help others understand the code
- **UI/UX improvements** - Make it prettier and more user-friendly
- **Test coverage** - Help us maintain quality

### Development Setup

1. **Frontend**: Navigate to `frontend/` directory and run:

   ```bash
   pnpm install
   pnpm dev
   ```

2. **Sanity Studio**: Navigate to `studio-telkom/` directory and run:
   ```bash
   pnpm install
   pnpm dev
   ```

### Questions?

Feel free to open an issue for:

- Questions about the codebase
- Clarification on contribution guidelines
- Discussion about potential features
- Help with setting up the development environment

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Have fun coding! 🚀

---

Thank you for contributing to Telkom Alumni! Your efforts help make this platform better for everyone in the Telkom community.
