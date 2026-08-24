# SIH 2026

A [Next.js](https://nextjs.org) 16 application built with React 19, TypeScript, Tailwind CSS v4, and Biome.

---

## Prerequisites

Make sure the following are installed before you start:

| Tool | Minimum version | Check with | Where to get it |
| --- | --- | --- | --- |
| **Node.js** | 20.x or newer (22.x recommended) | `node -v` | https://nodejs.org |
| **npm** | 10.x or newer (ships with Node) | `npm -v` | bundled with Node.js |
| **Git** | 2.30 or newer | `git --version` | https://git-scm.com |
| **A code editor** | — | — | VS Code recommended |

Recommended (optional):

- **VS Code extensions:** [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for formatting/linting, and the Tailwind CSS IntelliSense extension.
- **A GitHub account** with access to this repository — required if you want to push branches and open pull requests.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/OmMaheshwari653/sih-2026.git
cd sih-2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

If the project needs secrets or configuration, create a `.env.local` file in the project root:

```bash
# .env.local
# Add your keys here, for example:
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

`.env.local` is ignored by Git — **never commit secrets**.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. The page reloads automatically as you edit files.

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server on port 3000 |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production build (run `npm run build` first) |
| `npm run lint` | Runs Biome checks (lint + format verification) |
| `npm run format` | Formats the codebase with Biome |

---

## Project structure

```
sih-2026/
├── src/
│   └── app/            # Next.js App Router: pages, layouts, routes
├── public/             # Static assets served as-is
├── next.config.ts      # Next.js configuration
├── biome.json          # Linter and formatter configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

---

## How to contribute

We use a **branch-per-change** workflow. Nobody commits directly to `main`. Every change starts on its own branch and reaches `main` through a pull request.

### Step 1 — Clone the repository

If you have not cloned it yet:

```bash
git clone https://github.com/OmMaheshwari653/sih-2026.git
cd sih-2026
npm install
```

### Step 2 — Get the latest `main`

Always start from an up-to-date `main` so you don't build on stale code:

```bash
git checkout main
git pull origin main
```

### Step 3 — Create your own branch

Create a new branch **from `main`** and switch to it in one command:

```bash
git checkout -b feature/your-feature-name
```

Use a clear, descriptive branch name with one of these prefixes:

- `feature/` — a new feature, e.g. `feature/login-page`
- `fix/` — a bug fix, e.g. `fix/navbar-overflow`
- `chore/` — tooling, config, or dependency work, e.g. `chore/update-biome`
- `docs/` — documentation only, e.g. `docs/setup-guide`

Confirm which branch you are on at any time:

```bash
git branch --show-current
```

### Step 4 — Make your changes

Write your code, then verify it locally before committing:

```bash
npm run lint     # check for lint / formatting problems
npm run format   # auto-fix formatting
npm run build    # make sure the project still builds
```

### Step 5 — Commit your work

```bash
git add .
git commit -m "feat: add login page"
```

Write commit messages in the imperative mood and keep them focused. Suggested prefixes:

- `feat:` a new feature
- `fix:` a bug fix
- `docs:` documentation changes
- `style:` formatting only, no logic change
- `refactor:` code restructuring without behaviour change
- `chore:` build, config, or dependency changes

### Step 6 — Push **from your own branch**

Push the branch you created — **not** `main`:

```bash
git push -u origin feature/your-feature-name
```

The `-u` flag links your local branch to the remote one, so afterwards a plain `git push` is enough for that branch.

> ⚠️ **Important:** Never run `git push origin main`. All changes must go through a pull request so they can be reviewed.

### Step 7 — Open a pull request

1. Go to https://github.com/OmMaheshwari653/sih-2026
2. GitHub will show a **"Compare & pull request"** banner for the branch you just pushed — click it. (Otherwise: **Pull requests → New pull request** and pick your branch.)
3. Set the base branch to `main` and the compare branch to your branch.
4. Give the PR a clear title and describe **what** you changed and **why**. Add screenshots for UI changes.
5. Request a review and wait for approval before merging.

### Step 8 — Keep your branch up to date

If `main` moves ahead while your PR is open, pull the new commits into your branch:

```bash
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main
# resolve any conflicts, then:
git push
```

### Step 9 — After the PR is merged

Clean up your local repository:

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name          # delete the local branch
git push origin --delete feature/your-feature-name   # delete the remote branch
```

---

## Contribution rules

- One branch = one logical change. Don't mix unrelated work in a single PR.
- Never commit directly to `main`.
- Never commit `.env.local`, `node_modules/`, or `.next/`.
- Run `npm run lint` and `npm run build` before pushing.
- Keep pull requests small and reviewable.
- If you're unsure about an approach, open an issue or ask before writing a lot of code.

---

## Troubleshooting

**Port 3000 is already in use**

```bash
npm run dev -- -p 3001
```

**Dependency or build errors after pulling**

Reinstall dependencies and clear the Next.js cache:

```bash
rm -rf node_modules .next
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, .next
npm install
```

**`git push` is rejected**

Someone else pushed first. Pull and merge, then push again:

```bash
git pull origin main
```

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev)
