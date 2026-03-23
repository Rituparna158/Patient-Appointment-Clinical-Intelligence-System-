FROM node:18-slim AS base
WORKDIR /app
RUN npm install -g pnpm turbo
 
# BUILDER
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=report-analytics-service --docker
 
# INSTALLER / BUILD
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 
RUN pnpm install --frozen-lockfile
 
COPY --from=builder /app/out/full/ .
 
RUN pnpm turbo run build --filter=report-analytics-service
RUN pnpm --filter=report-analytics-service deploy --prod --legacy /prod/report-analytics-service
 
# RUNNER
FROM node:18-slim AS runner
WORKDIR /app
 
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
 
ENV NODE_ENV=production
 
COPY --from=installer /prod/report-analytics-service ./
 
EXPOSE 4006
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:4006/api/reports-analytics/health-report || exit 1
 
CMD ["node", "dist/index.js"]
 