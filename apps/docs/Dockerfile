# ---- Build stage ----
FROM node:24-alpine AS builder
WORKDIR /app

# Copy root manifests (required for monorepo install)
COPY package.json turbo.json ./
COPY apps/docs/package.json apps/docs/

# Install dependencies for the docs workspace
RUN npm install --workspace=@worksight/docs --legacy-peer-deps

# Copy the rest of the project
COPY . .

# Build VitePress site for production
RUN npm --workspace=@worksight/docs run build

# ---- Runtime stage ----
FROM nginx:mainline-alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx content
RUN rm -rf ./*

# Copy built site
COPY --from=builder /app/apps/docs/.vitepress/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
