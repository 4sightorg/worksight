# ---- Build stage ----
FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/docs/package.json apps/docs/

RUN pnpm install --frozen-lockfile --filter @worksight/docs...

COPY . .

RUN pnpm --filter @worksight/docs build

# ---- Runtime stage ----
FROM nginx:mainline-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/apps/docs/.vitepress/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
