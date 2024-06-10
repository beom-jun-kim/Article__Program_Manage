FROM --platform=linux/amd64 node:20.11.1-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable
RUN yarn config set nodeLinker node-modules
RUN yarn

FROM base AS builder

COPY . /app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
RUN corepack enable
RUN yarn config set nodeLinker node-modules
RUN yarn build
RUN chmod +x .next/standalone/docker-entrypoint.sh

FROM base AS runner

ENV NODE_ENV='production'
ENV HOSTNAME='0.0.0.0'
ENV PORT='80'
ENV MAX_OLD_SPACE_SIZE='2048'
ENV TZ='Asia/Seoul'

COPY --from=builder /app/.next/standalone /standalone
WORKDIR /standalone

EXPOSE 80/tcp
ENTRYPOINT ["./docker-entrypoint.sh"]