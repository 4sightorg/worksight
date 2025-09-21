# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy root manifests (required for monorepo install)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/docs/package.json apps/docs/

# Install with pnpm limited to docs workspace
RUN pnpm install --frozen-lockfile --filter=apps/docs

# Copy the rest of the project
COPY . .

# Build VitePress site
RUN pnpm --filter=apps/docs build

# ---- Runtime stage ----
FROM nginx:alpine

# Clean default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/apps/docs/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
