# Contributing to Pegasus Dashboard

First off, thank you for considering contributing to Pegasus Dashboard! 🎉 Every contribution helps make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [security@cptcr.uk](mailto:security@cptcr.uk).

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/pegasus-dashboard.git
   cd pegasus-dashboard
   ```
3. **Add the upstream** remote:
   ```bash
   git remote add upstream https://github.com/semi-constructor/pegasus-dashboard.git
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Setup

### Prerequisites

- **Node.js 20+**
- **npm** (comes with Node.js)
- A **PostgreSQL** database (we recommend [Neon](https://neon.tech/))
- A **Discord Application** with OAuth2 configured

### Installation

```bash
npm install
```

### Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

See the [README](README.md#2-environment-configuration) for a detailed breakdown of each variable.

### Running Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## How to Contribute

### Types of Contributions

- 🐛 **Bug fixes** — Found a bug? Fix it and submit a PR!
- ✨ **Features** — Have an idea? Open an issue first to discuss, then implement it.
- 📖 **Documentation** — Typos, missing docs, better examples — all welcome.
- 🎨 **UI/UX improvements** — Visual polish, accessibility, responsive design fixes.
- ⚡ **Performance** — Optimizations, bundle size reductions, caching improvements.

### What We're NOT Looking For

- Changes that break backward compatibility without prior discussion
- Large refactors without an associated issue or prior agreement
- Vendoring or bundling third-party libraries that can be installed via npm

## Pull Request Process

1. **Sync** your fork with upstream before starting work:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes** in a dedicated branch — keep commits focused and atomic.

3. **Test your changes** thoroughly:
   ```bash
   npm run lint
   npm run build
   ```

4. **Push** your branch and open a Pull Request against `main`:
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Fill out the PR template** completely — describe what changed, why, and how to test.

6. **Address review feedback** promptly. PRs with unresolved comments will not be merged.

### PR Requirements

- [ ] Code passes `npm run lint` with no errors
- [ ] Code builds successfully with `npm run build`
- [ ] Commit messages are clear and descriptive
- [ ] No unrelated changes are included
- [ ] Documentation is updated if applicable

## Style Guide

### Code

- **TypeScript** is required for all source files
- **ESLint** configuration is enforced — run `npm run lint` before committing
- Use **functional components** with React hooks
- Prefer **Server Components** where possible (Next.js App Router)
- Use **Drizzle ORM** for all database queries — no raw SQL

### Commits

We follow a conventional-ish commit style:

```
feat: add guild analytics chart component
fix: resolve OAuth callback redirect loop
docs: update API_DOC with new economy endpoints
chore: bump drizzle-orm to 0.45.2
```

### Branch Naming

```
feat/short-description
fix/issue-number-description
docs/what-changed
chore/maintenance-task
```

## Reporting Bugs

Open a [GitHub Issue](https://github.com/semi-constructor/pegasus-dashboard/issues/new) and include:

1. **Summary** — A concise description of the problem
2. **Steps to reproduce** — Detailed steps to trigger the bug
3. **Expected behavior** — What you expected to happen
4. **Actual behavior** — What actually happened
5. **Environment** — OS, Node.js version, browser, and any relevant config
6. **Screenshots/logs** — If applicable

## Requesting Features

Open a [GitHub Issue](https://github.com/semi-constructor/pegasus-dashboard/issues/new) with the label `enhancement` and describe:

1. **The problem** you're trying to solve
2. **Your proposed solution** 
3. **Alternatives** you've considered
4. **Additional context** — mockups, references, etc.

---

Thank you for helping make Pegasus Dashboard better! 🚀
