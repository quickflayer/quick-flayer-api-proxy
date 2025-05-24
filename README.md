# Quick Flayer Monorepo

## Repository Setup

This is a monorepo managed with `pnpm` workspaces and Git submodules.

### Cloning the Repository

To clone the repository with all submodules:

```bash
git clone --recurse-submodules git@github.com:quick-flayer/quick-flayer-root.git
```

### Installing Dependencies

Ensure you have `pnpm` installed globally:

```bash
npm install -g pnpm
```

Then install dependencies:

```bash
pnpm install
```

### Managing Submodules

- To update submodules: 
  ```bash
  git submodule update --recursive
  ```

- To pull latest changes in all submodules:
  ```bash
  git submodule foreach git pull origin main
  ```

### Workspace Structure

- `app/`: Contains all application submodules
  - `quick-flayer-app`
  - `quick-flayer-web`
  - `quick-flayer-api`