# 🤝 Contributing to Pasalku.AI

Thank you for your interest in contributing to Pasalku.AI! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Be open to different viewpoints

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Spam or self-promotion

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm/pnpm
- Python 3.11+
- Git
- MongoDB & PostgreSQL (local or cloud)

### Setup Development Environment

```bash
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/pasalku-ai.git
cd pasalku-ai

# 2. Add upstream remote
git remote add upstream https://github.com/yhyaa294/pasalku-ai.git

# 3. Install dependencies
npm install
cd backend && pip install -r requirements.txt requirements-dev.txt

# 4. Setup environment
cp .env.example .env
# Edit .env with your config

# 5. Run development servers
npm run dev  # Frontend on :5000
python backend/run_server.py  # Backend on :8000
```

---

## 🔄 Development Workflow

### 1. Create Feature Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add tests for new features
- Update documentation

### 3. Commit Changes

```bash
git add .
git commit -m "feat: Add amazing new feature"
```

#### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```bash
feat(chat): Add multi-language support
fix(api): Resolve timeout issue in legal analysis
docs(readme): Update installation instructions
refactor(components): Simplify ChatInterface logic
```

### 4. Push to Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select base: `main` ← compare: `feature/your-feature-name`
4. Fill out PR template
5. Submit!

---

## 🔍 Pull Request Process

### PR Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass (`npm test` and `pytest`)
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No merge conflicts with main
- [ ] PR description is clear and detailed

### PR Template

```markdown
## 🎯 Description

Brief description of changes

## 🔧 Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing

How was this tested?

## 📸 Screenshots (if applicable)

Visual changes

## ✅ Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Linting passes
   - Tests pass
   - Security scans pass

2. **Code Review**
   - At least 1 approval required
   - Address review comments
   - Resolve conversations

3. **Merge**
   - Squash and merge to main
   - Delete feature branch

---

## 💻 Coding Standards

### TypeScript/JavaScript (Frontend)

```typescript
// ✅ Good
const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// ❌ Bad
async function fetchUserData(userId) {
  const response = await fetch('/api/users/' + userId)
  return response.json()
}
```

**Standards:**
- Use TypeScript for type safety
- Prefer `const` over `let`, avoid `var`
- Use async/await over promises
- Meaningful variable names
- Add JSDoc for complex functions

### Python (Backend)

```python
# ✅ Good
async def analyze_contract(
    contract_text: str,
    user_id: str
) -> ContractAnalysis:
    """
    Analyze legal contract using AI.
    
    Args:
        contract_text: Full text of the contract
        user_id: ID of requesting user
        
    Returns:
        ContractAnalysis with findings and recommendations
    """
    try:
        analysis = await ai_service.analyze(contract_text)
        return ContractAnalysis(**analysis)
    except Exception as e:
        logger.error(f"Contract analysis failed: {e}")
        raise

# ❌ Bad
def analyzeContract(text, uid):
    result = ai_service.analyze(text)
    return result
```

**Standards:**
- Follow PEP 8
- Type hints for all functions
- Docstrings for public functions
- Use async/await for I/O operations
- Proper error handling

### Code Formatting

```bash
# Frontend
npm run lint
npm run lint:fix

# Backend
cd backend
black .
flake8 .
mypy .
```

---

## 🧪 Testing Requirements

### Frontend Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

**Requirements:**
- New features must have tests
- Maintain >80% coverage
- Test edge cases

**Example:**
```typescript
describe('ChatInterface', () => {
  it('should send message on submit', async () => {
    const { getByRole, getByText } = render(<ChatInterface />)
    const input = getByRole('textbox')
    const button = getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(getByText('Test message')).toBeInTheDocument()
    })
  })
})
```

### Backend Tests

```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

**Requirements:**
- Test API endpoints
- Test business logic
- Mock external services
- >80% coverage

**Example:**
```python
@pytest.mark.asyncio
async def test_legal_analysis(client):
    """Test legal analysis endpoint."""
    response = await client.post(
        "/api/legal-ai/analyze",
        json={"text": "Sample legal text"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "citations" in data
```

---

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Generate strategic legal report from conversation session.
 * 
 * @param sessionId - MongoDB session ID
 * @param userId - User requesting the report
 * @returns PDF blob of the generated report
 * @throws {NotFoundError} If session doesn't exist
 * @throws {UnauthorizedError} If user doesn't own session
 * 
 * @example
 * const report = await generateReport('session123', 'user456')
 */
async function generateReport(
  sessionId: string,
  userId: string
): Promise<Blob> {
  // Implementation
}
```

### Update Documentation

When adding features, update:

- [ ] README.md (if user-facing)
- [ ] API documentation (if new endpoints)
- [ ] Code comments
- [ ] Type definitions
- [ ] Architecture docs (if structural changes)

---

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try latest version
3. Reproduce the bug
4. Gather information

### Bug Report Template

```markdown
## 🐛 Bug Description

Clear description of the bug

## 🔄 Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## ✅ Expected Behavior

What should happen

## ❌ Actual Behavior

What actually happens

## 📸 Screenshots

If applicable

## 🖥️ Environment

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

## 📋 Additional Context

Any other relevant information
```

---

## 💡 Feature Requests

### Template

```markdown
## 🎯 Feature Description

Clear description of the feature

## 🤔 Problem/Motivation

What problem does this solve?

## 💡 Proposed Solution

How should it work?

## 🎨 Mockups/Examples

Visual examples if applicable

## 📊 Alternatives Considered

Other solutions you've thought about
```

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in project documentation

---

## 📞 Get Help

- 💬 [Discord Community](https://discord.gg/pasalku-ai)
- 📧 Email: dev@pasalku.ai
- 🐦 Twitter: [@PasalkuAI](https://twitter.com/PasalkuAI)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to Pasalku.AI!** 🙏

</div>
