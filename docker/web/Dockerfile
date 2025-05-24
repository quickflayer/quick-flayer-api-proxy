# Multi-stage build for Next.js web application
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g next

# Dependencies stage
FROM base AS deps
COPY package.json ./
# Clean install without node_modules linking to ensure consistent store usage
RUN rm -rf node_modules
RUN npm install --frozen-lockfile --prefer-offline=false
RUN npm install --save-exact --save-dev @types/react @types/node

# Build stage
FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Set build-time environment variables for Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --frozen-lockfile --prod
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "run", "start"]

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
