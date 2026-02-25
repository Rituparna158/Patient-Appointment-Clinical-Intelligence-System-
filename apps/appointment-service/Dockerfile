FROM node:18-slim
 
WORKDIR /app
 
RUN npm install -g pnpm
 
ENV HUSKY=0
ENV CI=true

COPY . .
 
 
RUN pnpm install
 
RUN pnpm --filter ./apps/appointment-service... exec tsc
 
EXPOSE 4003
 
CMD ["pnpm","--filter","./apps/appointment-service...","start"]