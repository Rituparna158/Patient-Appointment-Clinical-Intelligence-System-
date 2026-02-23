
FROM node:18-slim AS builder
 
WORKDIR /app
RUN npm install -g pnpm
ENV CI=true
 
COPY . .
RUN pnpm install
RUN pnpm --filter web-app build
 
FROM nginx:alpine
 
COPY --from=builder /app/apps/web-app/dist /usr/share/nginx/html
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
 
CMD ["nginx","-g", "daemon off;"]