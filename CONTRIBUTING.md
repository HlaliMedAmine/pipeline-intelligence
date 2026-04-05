# Contributing to Pipeline Intelligence

First off — **thank you for taking the time to contribute!** 🙏

Pipeline Intelligence is an open-source project built for the DevOps community. Every contribution, big or small, makes it better for everyone. This guide will help you get started quickly.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

This project follows a simple rule: **be kind and respectful**. We welcome contributors from all backgrounds, skill levels, and countries. Harassment, discrimination, or toxic behavior will not be tolerated.

---

## 💡 How Can I Contribute?

### 🐛 Report Bugs
Found something broken? [Open an issue](https://github.com/HlaliMedAmine/pipeline-intelligence/issues/new?template=bug_report.md) with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your OS / Node.js version

### ✨ Suggest Features
Have an idea? [Open a feature request](https://github.com/HlaliMedAmine/pipeline-intelligence/issues/new?template=feature_request.md). Describe the problem it solves, not just the solution.

### 💻 Submit Code
Fix a bug, build a feature, or improve the docs — all PRs are welcome.

### 📖 Improve Documentation
Found a typo? Unclear step? Fix it! Docs PRs are merged fast.

### 🌍 Add Translations
The app is currently English-only. Adding `fr`, `ar`, `es`, or other languages is very welcome.

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Fork & Clone

```bash
# 1. Fork on GitHub (click the Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/pipeline-intelligence.git
cd pipeline-intelligence

# 3. Add upstream remote
git remote add upstream https://github.com/HlaliMedAmine/pipeline-intelligence.git
```

### Install & Run

```bash
# Backend
cd backend
cp .env.example .env
# Fill in your GEMINI_API_KEY in .env
npm install
node src/index.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` — click **"Try with demo data"** to develop without Azure credentials.

---

## 🌿 Git Workflow

We use a simple **feature branch workflow**:

```bash
# Always start from an up-to-date main
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description

# Make your changes...

# Stage and commit
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

---

## ✍️ Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

Examples:
feat: add Slack notification webhook
fix: resolve CORS error on /api/auth/connect
docs: update Docker setup instructions
style: fix spacing in PipelinesPage
refactor: extract AzureDevOpsService into separate module
test: add unit tests for JWT middleware
chore: update dependencies
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting (no logic change) |
| `refactor` | Code restructure (no feature/fix) |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates |

---

## 🔍 Pull Request Process

1. **Branch** from `main` (not from an old feature branch)
2. **Keep PRs focused** — one feature or fix per PR
3. **Update docs** if your change affects usage or setup
4. **Test your changes** — make sure the app runs with demo mode
5. **Fill out the PR template** — describe what changed and why
6. **Request a review** — tag `@HlaliMedAmine`

### PR Checklist

```
[ ] My code follows the existing style (Tailwind, ES modules)
[ ] I tested with demo mode (no Azure credentials needed)
[ ] I updated README.md if needed
[ ] My commit messages follow Conventional Commits
[ ] No console.log() left in production code
[ ] No hardcoded secrets or API keys
```

---

## 📁 Project Structure

```
pipeline-intelligence/
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components (Layout, etc.)
│   │   ├── pages/           # One file per route/page
│   │   │   ├── ConnectPage.jsx
│   │   │   ├── OverviewPage.jsx
│   │   │   ├── PipelinesPage.jsx
│   │   │   ├── AIInsightsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── hooks/           # React hooks (useAuth, etc.)
│   │   ├── lib/             # API client, mock data, utils
│   │   └── index.css        # Global styles + Tailwind layers
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   └── src/
│       ├── routes/          # Express route handlers
│       │   ├── auth.js      # POST /api/auth/connect
│       │   ├── pipelines.js # GET /api/pipelines/...
│       │   └── ai.js        # POST /api/ai/recommendations
│       ├── services/
│       │   └── azureDevOps.js  # Azure DevOps API wrapper
│       ├── middleware/
│       │   └── auth.js      # JWT verification middleware
│       └── index.js         # Express app entry point
│
├── docker-compose.yml
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

## 🐛 Reporting Bugs

Use the [Bug Report template](https://github.com/HlaliMedAmine/pipeline-intelligence/issues/new) and include:

```markdown
**Environment**
- OS: [e.g. Windows 11, Ubuntu 22.04]
- Node.js version: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]

**Steps to reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened. Include error messages or screenshots.
```

---

## 💡 Suggesting Features

Use the [Feature Request template](https://github.com/HlaliMedAmine/pipeline-intelligence/issues/new) and tell us:

- **What problem does this solve?** (most important!)
- **Who would benefit?** (solo devs, teams, enterprises?)
- **Rough idea of implementation?** (optional but helpful)

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/HlaliMedAmine/pipeline-intelligence/discussions)
- Reach out on [LinkedIn](https://linkedin.com/in/mohamedaminehlali)

---

Thank you for making Pipeline Intelligence better. Every star ⭐, issue 🐛, and PR 🔧 counts.

**Happy coding!** 🚀
