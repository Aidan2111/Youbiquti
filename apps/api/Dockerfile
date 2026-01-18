# Build stage
FROM node:20-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.base.json ./

# Copy all packages (needed for workspace dependencies)
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages in dependency order
RUN pnpm --filter @youbiquti/core build
RUN pnpm --filter @youbiquti/service-graph build
RUN pnpm --filter @youbiquti/gno-tools build
RUN pnpm --filter @youbiquti/api build

# Production stage
FROM node:20-slim AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy built packages
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/api/ ./apps/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "dist/index.js"]
