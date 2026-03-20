FROM node:18-alpine AS builder
WORKDIR /app
ENV GENERATE_SOURCEMAP=false

COPY package.json yarn.lock ./
RUN corepack enable
RUN yarn install --frozen-lockfile --non-interactive

ARG REACT_APP_API_URL=
ARG REACT_APP_SITE_URL=http://localhost

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL

COPY public ./public
COPY src ./src
COPY tsconfig.json ./
RUN yarn build

FROM nginx:1.27-alpine AS runner

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
