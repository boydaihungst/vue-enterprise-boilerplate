FROM node:14-alpine as base
ENV NODE_OPTIONS=--max_old_space_size=4096
LABEL maintainer="xxx@gmail.com" vendor="xxx"
RUN mkdir -p /home/app \
  /home/node/.vscode-server/extensions \
  /home/node/.vscode-server-insiders/extensions \
  && chown -R node \
  /home/node/.vscode-server \
  /home/node/.vscode-server-insiders
WORKDIR /home/app

# ---------- Dev ----------
FROM base as dev-stage
RUN apk add --no-cache \
  git \
  openssh-client \
  ca-certificates \
  bash \
  g++ \
  make \
  automake \
  autoconf

RUN yarn global add typescript @vue/cli@next node-gyp
RUN chown -Rh node:node ./
COPY ./package.json ./
COPY ./yarn.lock ./
# ---------- Tests ----------
FROM dev-stage AS test-stage
RUN yarn install
# RUN yarn test

# ---------- Builder ----------
FROM dev-stage AS build-stage
COPY ./ ./
RUN yarn build

# ---------- Release ----------
FROM nginx:stable-alpine AS release-stage
COPY --from=build-stage /home/app/dist ./
COPY --from=build-stage /home/app/deploy/nginx.conf /etc/nginx/nginx.conf
