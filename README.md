# Quick Flayer Monorepo

## Overview

Quick Flayer is a modern, scalable multi-platform application ecosystem built with:
- React Native (Expo) for mobile
- Next.js for web
- NestJS for backend API

## Repository Structure

```
quick-flayer-root/
├── app/
│   ├── quick-flayer-app/     # React Native mobile app
│   ├── quick-flayer-web/     # Next.js web application
│   └── quick-flayer-api/     # NestJS backend API
├── .npmrc                    # PNPM configuration
├── pnpm-workspace.yaml       # Workspace configuration
└── tsconfig.base.json        # Shared TypeScript configuration
```

## Prerequisites

- **Node.js**: v20.x LTS
- **pnpm**: Latest version (will be installed if not present)
- **Git**: Latest version with submodule support

## Getting Started

### 1. Clone the Repository

```bash
git clone --recurse-submodules git@github.com:quick-flayer/quick-flayer-root.git
cd quick-flayer-root
```

### 2. Install Dependencies

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all project dependencies
pnpm install
```

## Development Workflows

### Running Applications

```bash
# Run all applications concurrently
pnpm dev:all

# Run specific applications
pnpm dev:app    # Mobile app
pnpm dev:web    # Web application
pnpm dev:api    # Backend API
```

### Building Applications

```bash
# Build all applications
pnpm build:all

# Build specific application
pnpm --filter quick-flayer-web build
```

### Linting and Testing

```bash
# Lint all applications
pnpm lint:all

# Run tests for all applications
pnpm test:all
```

## Dependency Management

- Uses PNPM workspaces for efficient dependency management
- Shared dependencies are hoisted at the root level
- Platform-specific dependencies are isolated

## Environment Configuration

- Copy `.env.example` to `.env` in each application
- Customize environment variables as needed

## Submodule Management

```bash
# Update all submodules
git submodule update --recursive

# Pull latest changes in all submodules
git submodule foreach git pull origin main
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

- Ensure Node.js and pnpm versions match prerequisites
- Clear PNPM store if dependency issues occur: `pnpm store prune`
- Check individual app READMEs for specific setup instructions

## License

[Specify your license here]

## Contact

[Provide contact information or support channels]