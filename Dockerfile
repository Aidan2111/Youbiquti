# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./

# Copy package.json and tsconfig files for all packages
COPY packages/core/package.json packages/core/tsconfig.json packages/core/
COPY packages/gno-tools/package.json packages/gno-tools/tsconfig.json packages/gno-tools/
COPY packages/service-graph/package.json packages/service-graph/tsconfig.json packages/service-graph/
COPY apps/api/package.json apps/api/tsconfig.json apps/api/

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/core/src packages/core/src
COPY packages/gno-tools/src packages/gno-tools/src
COPY packages/service-graph/src packages/service-graph/src
COPY apps/api/src apps/api/src

# Build all packages with skipLibCheck to avoid type conflicts
RUN cd packages/core && npx tsc --skipLibCheck
RUN cd packages/gno-tools && npx tsc --skipLibCheck
RUN cd packages/service-graph && npx tsc --skipLibCheck
RUN cd apps/api && npx tsc --skipLibCheck

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/core/package.json packages/core/
COPY packages/gno-tools/package.json packages/gno-tools/
COPY packages/service-graph/package.json packages/service-graph/
COPY apps/api/package.json apps/api/

# Install ALL dependencies (we need express at runtime)
RUN pnpm install --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/packages/core/dist packages/core/dist
COPY --from=builder /app/packages/gno-tools/dist packages/gno-tools/dist
COPY --from=builder /app/packages/service-graph/dist packages/service-graph/dist
COPY --from=builder /app/apps/api/dist apps/api/dist

# Copy data files
COPY apps/api/data apps/api/data

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the API
WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]
