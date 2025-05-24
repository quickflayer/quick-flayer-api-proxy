# Multi-stage build for Next.js web application
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm next
# Set up pnpm store for better caching and performance
RUN pnpm config set store-dir /pnpm-store
# Configure pnpm for Next.js compatibility
RUN echo "node-linker=hoisted" > /root/.npmrc
RUN echo "shamefully-hoist=true" >> /root/.npmrc
RUN echo "strict-peer-dependencies=false" >> /root/.npmrc

# Dependencies stage
FROM base AS deps
COPY package.json ./
# Clean install without node_modules linking to ensure consistent store usage
RUN rm -rf node_modules
RUN pnpm install
RUN pnpm add -D --save-exact @types/react @types/node

# Build stage
FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Set build-time environment variables for Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package.json ./
RUN pnpm install --prod
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./

EXPOSE 3000
CMD ["pnpm", "run", "start"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package.json ./ 
RUN pnpm install
COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "dev"]
