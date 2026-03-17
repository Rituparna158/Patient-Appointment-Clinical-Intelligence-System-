#  BUILD STAGE 
FROM node:18-slim AS builder
 
WORKDIR /app
 
RUN npm install -g pnpm
 
COPY . .
 
RUN pnpm install
 
RUN pnpm --filter web-app build
 
#  NGINX STAGE 
FROM nginx:alpine
 
RUN apk add --no-cache curl
 
COPY apps/web-app/dist /usr/share/nginx/html
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
CMD curl -f http://localhost/ || exit 1