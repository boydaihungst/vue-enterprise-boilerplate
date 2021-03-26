FROM node:14-alpine as base
ENV NODE_OPTIONS=--max_old_space_size=8192
LABEL maintainer="boydaihungst@gmail.com" vendor="Huy Hoang"
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
  make
# Install python/pip
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
# COPY ./dev/server.crt /usr/local/share/ca-certificates/
# RUN update-ca-certificates
#
RUN yarn global add typescript @vue/cli nuxt node-gyp
# RUN chown -Rh node:node /home/app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
# ---------- Builder ----------
FROM dev-stage AS build-stage
COPY ./ ./
RUN rm -rf ./dist
RUN yarn build
# ---------- Tests ----------
FROM build-stage AS test-stage
RUN yarn test

# ---------- Release ----------
FROM nginx:stable-alpine AS release-stage
COPY --from=build-stage /home/app/dist/spa /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
