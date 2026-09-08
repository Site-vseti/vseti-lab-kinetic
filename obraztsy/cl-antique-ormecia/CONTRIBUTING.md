# Contributing to Ormecia

Thank you for your interest in contributing to Ormecia. This is an open-source luxury antique e-commerce frontend — contributions are welcomed at all experience levels as long as they meet the quality bar set by this document.

Read this guide fully before opening issues or pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started Locally](#getting-started-locally)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

This project follows the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Maintainers reserve the right to remove any contribution or block any contributor who violates it.

---

## Getting Started Locally

### 1. Fork the Repository

Click **Fork** on the top-right of the GitHub repository page. This creates a copy under your account.

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/ormecia.git
cd ormecia
```

### 3. Add the Upstream Remote

```bash
git remote add upstream https://github.com/ormecia/ormecia.git
```

Verify remotes:

```bash
git remote -v
# origin    https://github.com/<your-username>/ormecia.git (fetch)
# upstream  https://github.com/ormecia/ormecia.git (fetch)
```

### 4. Serve Locally

This is a static HTML/CSS/JS project. Serve it with any static file server:

**Python (built-in):**
```bash
python -m http.server 3000
# → http://localhost:3000
```

**Node.js (via `serve`):**
```bash
npx serve .
```

**VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, then right-click `index.html` → *Open with Live Server*.

### 5. Keep Your Fork in Sync

Before starting any new work, sync your fork with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Branch Naming Conventions

All work must be done on a dedicated branch — never commit directly to `main`.

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<short-description>` | `feat/collection-filter-ui` |
| Bug fix | `fix/<short-description>` | `fix/mobile-nav-overlap` |
| Documentation | `docs/<short-description>` | `docs/update-readme` |
| Refactor | `refactor/<short-description>` | `refactor/hero-animation` |
| Style | `style/<short-description>` | `style/gold-token-update` |
| Chore | `chore/<short-description>` | `chore/update-gitignore` |

Create a new branch:

```bash
git checkout -b feat/your-feature-name
```

---

## Commit Message Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Format:**
```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:**

| Type | Use when |
|------|----------|
| `feat` | Introducing new functionality |
| `fix` | Correcting a bug |
| `docs` | Documentation-only changes |
| `style` | CSS/design token changes with no logic impact |
| `refactor` | Code restructuring with no functional change |
| `perf` | Performance improvements |
| `chore` | Maintenance tasks (deps, configs, tooling) |
| `test` | Adding or modifying tests |

**Examples:**

```bash
# Good
git commit -m "feat(hero): add parallax depth layer for background texture"
git commit -m "fix(nav): prevent mobile menu from rendering below product cards"
git commit -m "style(tokens): adjust gold accent from #b8954a to #c9a85e for WCAG contrast"

# Bad — too vague, no scope, no type
git commit -m "fixed stuff"
git commit -m "updated CSS"
```

---

## Pull Request Process

1. **Ensure your branch is up to date** with upstream `main` before opening a PR.
2. **Run through the [Code Quality Checklist](docs/CODE_QUALITY_CHECKLIST.md)** before submitting.
3. **Open a PR against `main`** on the upstream repository.
4. **Fill out the PR template completely.** Incomplete PRs will be closed without review.
5. **Link the relevant issue** using `Closes #<issue-number>` in the PR description.
6. **Request review** from at least one maintainer.
7. **Address all review comments** — do not merge until all conversations are resolved.
8. A maintainer will merge using **squash merge** to keep history clean.

### PR Title Format

PR titles must follow the same Conventional Commits format:

```
feat(collection-page): add era filter with scroll-lock behaviour
```

---

## Coding Standards

### HTML

- Use semantic elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Every interactive element must have an `id` attribute that is unique and descriptive.
- All images must include `alt` text. Decorative images use `alt=""` and `aria-hidden="true"`.
- Follow WCAG 2.1 AA accessibility standards.

### CSS

- Use CSS custom properties (design tokens) defined in `src/styles/tokens.css`. **Never hardcode** colour values or spacing values inline.
- Follow the existing naming convention: `block__element--modifier` (BEM-inspired).
- Component-level styles belong in `src/styles/components/`. Page-level overrides belong in `src/styles/pages/`.
- Do not use `!important` unless overriding a third-party library.
- Avoid `px` for font sizes — use `rem` or `clamp()`.
- Mobile-first media queries.

### JavaScript

- Vanilla JS only. No framework dependencies.
- All JS must be wrapped in an IIFE or ES module to avoid polluting the global scope.
- No `var` — use `const` and `let` appropriately.
- Add comments for non-obvious logic. Self-documenting code is preferred over noisy comments.
- Prefer `addEventListener` over inline `onclick`.

### Images & Assets

- Images must be web-optimised before committing (max 200KB per image, use WebP where possible).
- All assets go in `src/assets/`.
- Do not commit binary files (`.psd`, `.ai`, `.sketch`, etc.).

---

## Issue Reporting

Before opening an issue, search existing issues to avoid duplicates.

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the unexpected behaviour.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behaviour**
What you expected to happen.

**Screenshots**
If applicable, attach screenshots.

**Environment**
- OS: [e.g. macOS 14.2]
- Browser: [e.g. Chrome 122]
- Viewport: [e.g. 1440×900]
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. E.g. "I can't filter artifacts by era without..."

**Proposed Solution**
How you would solve it.

**Alternatives Considered**
Any alternative approaches you considered.

**Additional Context**
Any mockups, references, or prior art.
```

---

## Questions

For questions that are not bugs or feature requests, open a [Discussion](https://github.com/ormecia/ormecia/discussions) rather than an issue.
