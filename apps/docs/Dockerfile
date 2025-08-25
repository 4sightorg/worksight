# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
COPY apps/docs/package.json apps/docs/
RUN pnpm install --frozen-lockfile --filter docs...

# ---- Lint & Test ----
FROM deps AS lint-test
COPY . .
RUN pnpm lint --filter docs && pnpm test --filter docs

# ---- Build ----
FROM deps AS build
COPY . .
RUN pnpm build --filter docs

# ---- Runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/apps/docs/.next ./.next
COPY --from=build /app/apps/docs/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/docs/package.json ./

EXPOSE 3001
CMD ["pnpm", "start", "--filter", "docs"]
