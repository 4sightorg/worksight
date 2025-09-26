# ---- Base ----
FROM node:24-alpine AS base
WORKDIR /app

# Enable Corepack (optional, mainly for yarn/pnpm)
RUN corepack enable

# ---- Dependencies (dev + prod for build) ----
FROM base AS deps
WORKDIR /app

# Copy manifests
COPY package.json turbo.json ./
COPY apps/web/package.json apps/web/

# Install all dependencies (dev + prod) for build
RUN npm install --workspace=apps/web --legacy-peer-deps

# ---- Build ----
FROM deps AS build
WORKDIR /app

# Copy full source code
COPY . .

# Set dummy environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy_anon_key"
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="dummy_key"
ENV NEXT_PUBLIC_IS_OFFLINE=false

# Build only the web app workspace
RUN npm --workspace=apps/web run build

# ---- Runtime (production only) ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy package manifests
COPY package.json turbo.json ./
COPY apps/web/package.json apps/web/

# Install only production dependencies for the web workspace
RUN npm install --workspace=apps/web --omit=dev --legacy-peer-deps

# Copy build artifacts
COPY --from=build /app/apps/web/.next /app/apps/web/.next
COPY --from=build /app/apps/web/public /app/apps/web/public

EXPOSE 3000

# Start the app
CMD ["npm", "--workspace=apps/web", "start"]
