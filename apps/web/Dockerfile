# syntax=docker/dockerfile:1
# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter web...

# ---- Lint & Test ----
FROM deps AS lint-test
COPY . .
RUN pnpm lint --filter web && pnpm test --filter web

# ---- Build ----
FROM deps AS build
COPY . .
RUN pnpm build --filter web

# ---- Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built app
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web/package.json ./

EXPOSE 3000
CMD ["pnpm", "start", "--filter", "web"]
