FROM node:18-slim
 
WORKDIR /app
 
RUN npm install -g pnpm
 
ENV HUSKY=0
ENV CI=true

COPY . .
 
 
RUN pnpm install
 
RUN pnpm --filter ./apps/patient-service... exec tsc
 
EXPOSE 4002
 
CMD ["pnpm","--filter","./apps/patient-service...","start"]