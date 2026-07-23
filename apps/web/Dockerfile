# ---- Base ----
FROM node:24-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# ---- Dependencies (dev + prod for build) ----
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/assets/package.json packages/assets/
COPY packages/common/package.json packages/common/

RUN pnpm install --frozen-lockfile --filter @worksight/web...

# ---- Build ----
FROM deps AS build
WORKDIR /app

COPY . .

ENV NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy_anon_key"
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="dummy_key"
ENV NEXT_PUBLIC_IS_OFFLINE=false

RUN pnpm --filter @worksight/web build

# ---- Runtime (production only) ----
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/assets/package.json packages/assets/
COPY packages/common/package.json packages/common/

RUN pnpm install --frozen-lockfile --prod --filter @worksight/web...

COPY --from=build /app/apps/web/.next /app/apps/web/.next
COPY --from=build /app/apps/web/public /app/apps/web/public

EXPOSE 3000

CMD ["pnpm", "--filter", "@worksight/web", "start"]
