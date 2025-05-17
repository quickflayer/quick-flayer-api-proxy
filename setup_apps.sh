#!/bin/bash

# Ensure latest Node.js LTS is used
echo "Checking Node.js version..."
node_version=$(node --version)
if [[ ! $node_version =~ ^v20\. ]]; then
    echo "Please use Node.js v20.x LTS"
    exit 1
fi

# Ensure pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Create directories if they don't exist
mkdir -p app/quick-flayer-app app/quick-flayer-web app/quick-flayer-api

# 1. Setup quick-flayer-app (React Native with Expo)
cd app/quick-flayer-app
npx create-expo-app . --template typescript
pnpm add @react-navigation/native @react-navigation/stack react-native-safe-area-context react-native-screens expo-status-bar
pnpm add -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Create project structure
mkdir -p src/components src/screens src/navigation src/services src/types
mkdir assets

# Basic ESLint config
cat > .eslintrc.js << EOL
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
EOL

# Basic Prettier config
cat > .prettierrc << EOL
{
    "singleQuote": true,
    "trailingComma": "es5",
    "tabWidth": 4
}
EOL

# Create README
cat > README.md << EOL
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
EOL

# Initial git setup
git init
git add .
git commit -m "Initial setup of React Native Expo app"

# 2. Setup quick-flayer-web (Next.js)
cd ../quick-flayer-web
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Create additional structure
mkdir -p src/components src/lib src/types

# Create README
cat > README.md << EOL
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
EOL

# Initial git setup
git init
git add .
git commit -m "Initial setup of Next.js web application"

# 3. Setup quick-flayer-api (NestJS)
cd ../quick-flayer-api
npx @nestjs/cli new . --package-manager pnpm --language typescript

# Create additional modules and structure
mkdir -p src/modules/auth src/modules/users src/modules/health
mkdir -p src/common/decorators src/common/guards src/common/interceptors src/common/dto
mkdir -p src/config

# Install additional dependencies
pnpm add @nestjs/config @nestjs/swagger class-validator class-transformer @nestjs/throttler

# Create README
cat > README.md << EOL
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
EOL

# Initial git setup
git init
git add .
git commit -m "Initial setup of NestJS API"

echo "All applications have been set up successfully!"
