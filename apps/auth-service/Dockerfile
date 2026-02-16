FROM node:18-slim
 
WORKDIR /app
 
RUN npm install -g pnpm
 
ENV HUSKY=0
ENV CI=true

COPY . .
 
 
RUN pnpm install
 
RUN pnpm --filter ./apps/auth-service... exec tsc
 
EXPOSE 4001
 
CMD ["pnpm","--filter","./apps/auth-service...","start"]