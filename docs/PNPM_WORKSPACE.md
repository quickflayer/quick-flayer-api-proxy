# PNPM Monorepo Dependencies Management Setup

Set up a pnpm monorepo that efficiently manages dependencies across multiple applications (React Native/Expo, Next.js, and NestJS) using workspaces, with proper dependency hoisting and isolation.

## Project Structure

```
my-monorepo/
├─ app/
│  ├─ quick-flayer-app/     (Expo/React Native + TypeScript)
│  ├─ quick-flayer-web/     (Next.js + TypeScript + Tailwind)
│  └─ quick-flayer-api/     (NestJS + TypeScript)
├─ .npmrc
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

## Step 1: Root Configuration Files

### Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'app/*'
```

### Create `.npmrc` (CRITICAL for proper dependency management):
```
# Enable hoisting for better performance and shared dependencies
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
hoist-pattern[]=*typescript*
hoist-pattern[]=*jest*

# Prevent hoisting of platform-specific dependencies
public-hoist-pattern[]=*react-native*
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=*next*
public-hoist-pattern[]=*nestjs*

# Strict peer dependencies to avoid version conflicts
strict-peer-dependencies=false
auto-install-peers=true

# Enable shamefully-hoist for React Native compatibility
shamefully-hoist=true

# Node.js version management
engine-strict=true
```

### Root `package.json`:
```json
{
  "name": "quick-flayer-monorepo",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "install:all": "pnpm install",
    "dev:app": "pnpm --filter quick-flayer-app dev",
    "dev:web": "pnpm --filter quick-flayer-web dev",
    "dev:api": "pnpm --filter quick-flayer-api start:dev",
    "build:all": "pnpm --filter '*' build",
    "lint:all": "pnpm --filter '*' lint",
    "test:all": "pnpm --filter '*' test",
    "clean": "pnpm --filter '*' clean && rm -rf node_modules",
    "dev:all": "concurrently \"pnpm dev:api\" \"pnpm dev:web\" \"pnpm dev:app\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

## Step 2: Update Individual App Package.json Files

### For `app/quick-flayer-app/package.json` (Expo):
Add/modify these fields:
```json
{
  "name": "quick-flayer-app",
  "scripts": {
    "dev": "expo start",
    "build": "expo build",
    "lint": "eslint . --ext .ts,.tsx",
    "clean": "rm -rf node_modules .expo"
  }
}
```

### For `app/quick-flayer-web/package.json` (Next.js):
Add/modify these fields:
```json
{
  "name": "quick-flayer-web",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf node_modules .next"
  }
}
```

### For `app/quick-flayer-api/package.json` (NestJS):
Add/modify these fields:
```json
{
  "name": "quick-flayer-api",
  "scripts": {
    "start:dev": "nest start --watch --port 3001",
    "build": "nest build",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest",
    "clean": "rm -rf node_modules dist"
  }
}
```

## Step 3: Shared Dependencies Management

### Create shared TypeScript config at root (`tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@quick-flayer/app/*": ["./app/quick-flayer-app/src/*"],
      "@quick-flayer/web/*": ["./app/quick-flayer-web/src/*"],
      "@quick-flayer/api/*": ["./app/quick-flayer-api/src/*"]
    }
  }
}
```

### Update each app's `tsconfig.json` to extend base:
```json
{
  "extends": "../../tsconfig.base.json",
  // ... app-specific overrides
}
```

## Step 4: Installation and Development Commands

### Installation Process:
```bash
# Install all dependencies for all workspaces
pnpm install

# Install dependency for specific workspace
pnpm --filter quick-flayer-web add lodash
pnpm --filter quick-flayer-api add @nestjs/jwt

# Install dev dependency for all workspaces
pnpm add -DW jest

# Install dependency for multiple workspaces
pnpm --filter "./app/*" add axios
```

### Development Commands:
```bash
# Run specific app
pnpm dev:web
pnpm dev:api
pnpm dev:app

# Run all apps concurrently
pnpm dev:all

# Build all apps
pnpm build:all

# Lint all apps
pnpm lint:all

# Clean all node_modules
pnpm clean
```

## Step 5: Environment Variables Management

### Create `.env.example` at root:
```env
# API Configuration
API_PORT=3001
API_HOST=localhost

# Web Configuration
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# App Configuration
EXPO_PUBLIC_API_URL=http://localhost:3001

# Shared Configuration
NODE_ENV=development
```

### Update each app to use environment variables:
- **API**: Use `process.env.API_PORT` for port configuration
- **Web**: Use `process.env.NEXT_PUBLIC_API_URL` for API calls
- **App**: Use `process.env.EXPO_PUBLIC_API_URL` for API calls

## Step 6: Cross-Platform Dependency Handling

### Handle React Native specific dependencies:
```bash
# These should NOT be hoisted (managed per .npmrc)
pnpm --filter quick-flayer-app add react-native-safe-area-context
pnpm --filter quick-flayer-app add @react-navigation/native
```

### Handle shared utilities (optional):
Create a shared package for common utilities:
```bash
mkdir packages/shared
cd packages/shared
pnpm init
```

Then reference it in other apps:
```bash
pnpm --filter quick-flayer-web add @quick-flayer/shared@workspace:*
```

## Step 7: Git Integration with Submodules

### Update `.gitignore` at root:
```gitignore
node_modules/
.env
.env.local
dist/
.next/
.expo/
```

### Each submodule should have its own `.gitignore`:
```gitignore
node_modules/
.env
.env.local
# app-specific ignores
```

## Step 8: CI/CD Considerations

### Create GitHub Actions workflow (`.github/workflows/ci.yml`):
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint:all
      - run: pnpm test:all
      - run: pnpm build:all
```

## Expected Behavior After Setup:

1. **Single `pnpm install`** installs all dependencies for all apps
2. **Shared dependencies** are hoisted to root node_modules for efficiency  
3. **Platform-specific dependencies** remain isolated in individual apps
4. **Cross-workspace commands** work seamlessly
5. **Development servers** can run simultaneously on different ports
6. **Build processes** work independently for each app
7. **Submodules maintain** their independence while sharing workspace benefits

## Troubleshooting Commands:

```bash
# Clear all caches and reinstall
pnpm clean && pnpm install

# Check workspace configuration
pnpm list --depth=0

# Verify hoisting
pnpm why <package-name>

# Run audit across all workspaces  
pnpm audit --fix
```

This setup ensures efficient dependency management while maintaining the independence of each application within the monorepo structure.