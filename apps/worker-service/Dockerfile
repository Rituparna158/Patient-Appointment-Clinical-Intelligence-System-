# FROM node:18-slim AS base
# WORKDIR /app
# RUN npm install -g pnpm turbo
 
# #BUILDER
# FROM base AS builder
# WORKDIR /app
# COPY . .
# RUN turbo prune --scope=worker-service --docker
 
# # INSTALLER 
# FROM base AS installer
# WORKDIR /app
 
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 
# RUN pnpm install --frozen-lockfile
 
# COPY --from=builder /app/out/full/ .
 
# RUN pnpm turbo run build --filter=worker-service
 
# #  RUNNER 
# FROM node:18-slim AS runner
# WORKDIR /app
 
# RUN apt-get update && apt-get install -y curl
 
# ENV NODE_ENV=production
 
# COPY --from=installer /app .
 
# EXPOSE 4005
 
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
# CMD curl -f http://localhost:4005/api/worker/health-worker || exit 1
 
# CMD ["node","apps/worker-service/dist/worker.js"]

FROM node:18-slim AS base
WORKDIR /app
RUN npm install -g pnpm turbo
 
# BUILDER
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=worker-service --docker
 
# INSTALLER / BUILD
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 
RUN pnpm install --frozen-lockfile
 
COPY --from=builder /app/out/full/ .
 
RUN pnpm turbo run build --filter=worker-service
RUN pnpm --filter=worker-service deploy --prod --legacy /prod/worker-service
 
# RUNNER
FROM node:18-slim AS runner
WORKDIR /app
 
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
 
ENV NODE_ENV=production
 
COPY --from=installer /prod/worker-service ./
 
EXPOSE 4005
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:4005/api/worker/health-worker || exit 1
 
CMD ["node", "dist/worker.js"]
 