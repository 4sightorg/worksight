# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter=@worksight/web...

# ---- Build ----
FROM deps AS build
COPY . .
RUN pnpm --filter=@worksight/web build

# ---- Runtime ----
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/web/.next /app/apps/web/.next
COPY --from=build /app/apps/web/public /app/apps/web/public
COPY --from=build /app/node_modules /app/node_modules
COPY apps/web/package.json apps/web/

EXPOSE 3000
CMD ["pnpm", "--filter=@worksight/web", "start"]
