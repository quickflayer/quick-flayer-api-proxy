# Setup Prompt for Quick Flayer Applications

Set up three separate applications with the following technology stacks. Each application should be created as a standalone project that can be used as a Git submodule in a monorepo.

## Application 1: quick-flayer-app (React Native with Expo)

**Location:** `quick-flayer-app/`

**Requirements:**
1. Initialize a new Expo React Native project using the latest stable version
2. Use TypeScript as the primary language
3. Set up the project structure with:
   ```
   quick-flayer-app/
   ├─ src/
   │  ├─ components/
   │  ├─ screens/
   │  ├─ navigation/
   │  ├─ services/
   │  └─ types/
   ├─ assets/
   ├─ app.json
   ├─ package.json
   ├─ tsconfig.json
   └─ README.md
   ```
4. Install and configure essential dependencies:
   - `@react-navigation/native` and `@react-navigation/stack`
   - `react-native-safe-area-context`
   - `react-native-screens`
   - `expo-status-bar`
5. Create a basic navigation setup with at least 2 screens (Home, Profile)
6. Add basic TypeScript interfaces for common data types
7. Include development dependencies for linting and formatting (ESLint, Prettier)

**Commands to run:**
```bash
npx create-expo-app quick-flayer-app --template typescript
cd quick-flayer-app
# Install additional dependencies and set up structure
```

---

## Application 2: quick-flayer-web (Next.js)

**Location:** `quick-flayer-web/`

**Requirements:**
1. Initialize a new Next.js project using the latest stable version (App Router)
2. Use TypeScript as the primary language
3. Set up the project structure with:
   ```
   quick-flayer-web/
   ├─ src/
   │  ├─ app/
   │  │  ├─ globals.css
   │  │  ├─ layout.tsx
   │  │  └─ page.tsx
   │  ├─ components/
   │  ├─ lib/
   │  └─ types/
   ├─ public/
   ├─ package.json
   ├─ tsconfig.json
   ├─ tailwind.config.js
   └─ README.md
   ```
4. Install and configure:
   - Tailwind CSS for styling
   - ESLint and Prettier for code quality
   - Basic UI components structure
5. Create at least 3 pages: Home (`/`), About (`/about`), Contact (`/contact`)
6. Set up basic layout with navigation
7. Configure TypeScript strict mode
8. Add basic SEO setup with metadata

**Commands to run:**
```bash
npx create-next-app@latest quick-flayer-web --typescript --tailwind --eslint --app --src-dir
cd quick-flayer-web
# Set up additional configurations and pages
```

---

## Application 3: quick-flayer-api (NestJS)

**Location:** `quick-flayer-api/`

**Requirements:**
1. Initialize a new NestJS project using the latest stable version
2. Use TypeScript (default for NestJS)
3. Set up the project structure with:
   ```
   quick-flayer-api/
   ├─ src/
   │  ├─ modules/
   │  │  ├─ auth/
   │  │  ├─ users/
   │  │  └─ health/
   │  ├─ common/
   │  │  ├─ decorators/
   │  │  ├─ guards/
   │  │  ├─ interceptors/
   │  │  └─ dto/
   │  ├─ config/
   │  ├─ app.module.ts
   │  └─ main.ts
   ├─ test/
   ├─ package.json
   ├─ tsconfig.json
   └─ README.md
   ```
4. Install and configure essential dependencies:
   - `@nestjs/config` for configuration management
   - `@nestjs/swagger` for API documentation
   - `class-validator` and `class-transformer` for validation
   - `@nestjs/throttler` for rate limiting
5. Create basic modules:
   - **Health module**: Simple health check endpoint (`GET /health`)
   - **Users module**: Basic CRUD operations for users
   - **Auth module**: Basic authentication structure (without implementation)
6. Set up:
   - Global validation pipes
   - Swagger documentation at `/api`
   - Environment configuration
   - Basic error handling
7. Configure development tools (ESLint, Prettier, Jest)

**Commands to run:**
```bash
npm i -g @nestjs/cli
nest new quick-flayer-api
cd quick-flayer-api
# Install additional dependencies and set up modules
```

---

## General Requirements for All Applications:

1. **Git Setup**: Each application should be initialized as a Git repository with:
   - Proper `.gitignore` file for the respective technology
   - Initial commit with basic setup
   - Clear commit messages

2. **Package.json Scripts**: Each application should have relevant scripts:
   - `dev`/`start:dev`: Development server
   - `build`: Production build
   - `lint`: Linting
   - `test`: Testing

3. **Documentation**: Each application should have a README.md with:
   - Project description
   - Installation instructions
   - Development commands
   - Basic usage examples
   - Technology stack used

4. **TypeScript Configuration**: Strict TypeScript setup with proper type checking

5. **Code Quality**: ESLint and Prettier configuration for consistent code style

## Expected File Structure After Setup:

```
quick-flayer-app/          (Expo React Native + TypeScript)
quick-flayer-web/          (Next.js + TypeScript + Tailwind)
quick-flayer-api/          (NestJS + TypeScript)
```

Each application should be production-ready with basic functionality and ready to be used as Git submodules in a monorepo structure.

---

**Additional Notes:**
- Use the latest LTS versions of Node.js
- Ensure all applications can run simultaneously on different ports
- Set up proper CORS configuration in the API for web application integration
- Consider adding basic environment variable templates (`.env.example`) for each application