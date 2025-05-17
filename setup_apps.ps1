# PowerShell script for setting up Quick Flayer applications

# Ensure latest Node.js LTS is used
$nodeVersion = node --version
if ($nodeVersion -notmatch "^v20\.") {
    Write-Error "Please use Node.js v20.x LTS"
    exit 1
}

# Ensure pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pnpm..."
    npm install -g pnpm
}

# Create directories if they don't exist
New-Item -ItemType Directory -Path "app\quick-flayer-app", "app\quick-flayer-web", "app\quick-flayer-api" -Force

# 1. Setup quick-flayer-app (React Native with Expo)
Set-Location "app\quick-flayer-app"
npx create-expo-app . --template typescript
pnpm add @react-navigation/native @react-navigation/stack react-native-safe-area-context react-native-screens expo-status-bar
pnpm add -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Create project structure
New-Item -ItemType Directory -Path "src\components", "src\screens", "src\navigation", "src\services", "src\types", "assets"

# Basic ESLint config
@"
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
}
"@ | Out-File -FilePath .eslintrc.js

# Basic Prettier config
@"
{
    "singleQuote": true,
    "trailingComma": "es5",
    "tabWidth": 4
}
"@ | Out-File -FilePath .prettierrc

# Create README
@"
# Quick Flayer App (React Native + Expo)

## Setup
\`\`\`bash
pnpm install
pnpm start
\`\`\`

## Technologies
- React Native
- Expo
- TypeScript
- React Navigation
"@ | Out-File -FilePath README.md

# Initial git setup
git init
git add .
git commit -m "Initial setup of React Native Expo app"

# 2. Setup quick-flayer-web (Next.js)
Set-Location "..\quick-flayer-web"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Create additional structure
New-Item -ItemType Directory -Path "src\components", "src\lib", "src\types"

# Create README
@"
# Quick Flayer Web (Next.js)

## Setup
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Technologies
- Next.js (App Router)
- TypeScript
- Tailwind CSS
"@ | Out-File -FilePath README.md

# Initial git setup
git init
git add .
git commit -m "Initial setup of Next.js web application"

# 3. Setup quick-flayer-api (NestJS)
Set-Location "..\quick-flayer-api"
npx @nestjs/cli new . --package-manager pnpm --language typescript

# Create additional modules and structure
New-Item -ItemType Directory -Path "src\modules\auth", "src\modules\users", "src\modules\health"
New-Item -ItemType Directory -Path "src\common\decorators", "src\common\guards", "src\common\interceptors", "src\common\dto"
New-Item -ItemType Directory -Path "src\config"

# Install additional dependencies
pnpm add @nestjs/config @nestjs/swagger class-validator class-transformer @nestjs/throttler

# Create README
@"
# Quick Flayer API (NestJS)

## Setup
\`\`\`bash
pnpm install
pnpm start:dev
\`\`\`

## Technologies
- NestJS
- TypeScript
- Swagger
- Class Validator
"@ | Out-File -FilePath README.md

# Initial git setup
git init
git add .
git commit -m "Initial setup of NestJS API"

Write-Host "All applications have been set up successfully!"
