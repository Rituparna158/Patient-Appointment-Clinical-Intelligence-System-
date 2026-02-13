FROM node:20-alpine

WORKDIR /repo
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --ignore-scripts
WORKDIR /repo/apps/api-server
EXPOSE 5000
CMD ["pnpm","run","dev"]
