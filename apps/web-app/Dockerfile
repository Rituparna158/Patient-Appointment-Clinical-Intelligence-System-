
FROM node:18-slim AS builder
 
WORKDIR /app
RUN npm install -g pnpm
ENV CI=true
 
COPY . .
RUN pnpm install
RUN pnpm --filter web-app build
 
FROM node:18-slim
 
WORKDIR /app
COPY --from=builder /app/apps/web-app/dist ./dist
 
CMD ["sleep", "infinity"]