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

## Application Setup

We provide two scripts to set up the applications in this monorepo:

- `setup_apps.sh` (for Unix-like systems)
- `setup_apps.ps1` (for Windows)

### Prerequisites

- Node.js v20.x LTS
- pnpm (will be installed if not present)

### Setup Instructions

1. Clone the repository
2. Run the appropriate setup script:

**Unix/Mac:**
```bash
chmod +x setup_apps.sh
./setup_apps.sh
```

**Windows:**
```powershell
.\setup_apps.ps1
```

The scripts will:
- Create three applications in the `app/` directory
- Initialize Git repositories for each application
- Install necessary dependencies
- Set up basic project structures

### Applications

1. **quick-flayer-app**: React Native mobile app with Expo
2. **quick-flayer-web**: Next.js web application
3. **quick-flayer-api**: NestJS backend API