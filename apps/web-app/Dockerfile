FROM node:18-slim AS base
WORKDIR /app
RUN npm install -g pnpm turbo
 
# BUILDER
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=web-app --docker
 
# INSTALLER / BUILD
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
 
RUN pnpm install --frozen-lockfile
 
COPY --from=builder /app/out/full/ .
 
RUN pnpm turbo run build --filter=web-app
 
# NGINX RUNNER
FROM nginx:alpine AS runner
 
RUN apk add --no-cache curl
 
COPY --from=installer /app/apps/web-app/dist /usr/share/nginx/html
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost/ || exit 1