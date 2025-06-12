---
title: "Fast Commit Task"
read_only: true
type: "command"
---

# Create new fast commit task

This task uses the same logic as the commit task (.claude/commands/commit.md) but automatically selects the first suggested commit message without asking for confirmation.

## Rules

- Generate 3 commit message suggestions following the same format as the commit task
- Automatically use the first suggestion without asking the user
- Immediately run `git commit -m` with the first message
- All other behaviors remain the same as the commit task (format, package names, staged files only)
- Do NOT add Claude co-authorship footer to commits

## Format

<scope>: <type> <description>

- `<scope>`: The affected part of the monorepo (`frontend`, `backend`, `shared`, `docs`, `ci`, `build`)
- `<type>`: The type of change (see list below)
- `<description>`: A short, clear summary (imperative mood, no period)

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes only
- **chore**: Routine tasks, refactors, or cleanups
- **style**: Code formatting, white-space, etc (no logic changes)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **test**: Adding or updating tests
- **ci**: Changes to CI/CD configuration
- **build**: Changes that affect the build system or dependencies

## Scopes

- **frontend**: React or frontend-specific changes
- **backend**: Python API or backend-related changes
- **shared**: Shared assets, types, or schemas
- **docs**: Documentation files
- **ci**: CI/CD configurations or scripts
- **build**: Build configuration (e.g., Docker, Vite, Webpack)

## Examples

frontend: feat implement dashboard UI
backend: fix validate JWT before access
shared: chore add common error types
ci: add GitHub Actions for backend tests
docs: update README with install instructions

## Guidelines

- Use the imperative mood (e.g., "add", "fix", "update")
- Limit description to 72 characters
- For complex changes, add a detailed body after a blank line
