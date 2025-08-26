# Stage 1: Build VitePress site
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only manifests first (better caching)
COPY apps/docs/package.json ./

# Install deps with pnpm
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the project
COPY . .

# Build VitePress site
RUN pnpm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Clean default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
