# Multi-stage build for React Native/Expo app
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g expo-cli

# Dependencies stage
FROM base AS deps
COPY package.json ./
RUN npm install

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY . .
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
CMD ["npm", "run", "dev"]

# Build stage (for production builds)
FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production stage can be expanded as needed
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/build ./build
# Add production deployment commands here
