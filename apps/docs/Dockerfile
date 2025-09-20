# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install

# Copy root manifests (required for monorepo install)
COPY package.json turbo.json ./
COPY apps/docs/package.json apps/docs/

RUN npm install  --filter=apps/docs

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
