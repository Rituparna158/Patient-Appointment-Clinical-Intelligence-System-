
FROM node:18-slim AS base
WORKDIR /app
RUN npm install -g pnpm turbo
 
# BUILDER
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=auth-service --docker
 
# INSTALLER / BUILD
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 
RUN pnpm install --frozen-lockfile
 
COPY --from=builder /app/out/full/ .
 
RUN pnpm turbo run build --filter=auth-service
RUN pnpm --filter=auth-service deploy --prod --legacy /prod/auth-service
 
# RUNNER
FROM node:18-slim AS runner
WORKDIR /app
 
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
 
ENV NODE_ENV=production
 
COPY --from=installer /prod/auth-service ./

COPY --from=builder /app/packages/swagger ./packages/swagger
 
EXPOSE 4001
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:4001/api/health || exit 1
 
CMD ["node", "dist/index.js"]
 