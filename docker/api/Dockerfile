# Multi-stage build for production optimization
FROM node:20-alpine AS base
WORKDIR /app
# Install pnpm and NestJS CLI globally
RUN npm install -g @nestjs/cli

# Dependencies stage
FROM base AS deps
COPY package.json ./
# Install dependencies
RUN npm install

# Build stage
FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --prod
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package.json ./
# Install all dependencies including devDependencies
RUN npm install
# Copy the rest of the application code
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
