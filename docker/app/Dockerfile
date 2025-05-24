# Multi-stage build for React Native/Expo app
FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g pnpm expo-cli

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Development stage (no production build needed for Expo)
FROM base AS development
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Set environment variables for Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Expose ports for Expo
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start Expo development server
CMD ["pnpm", "start"]
