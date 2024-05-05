ARG NODE_VERSION=22.1.0-alpine3.18

FROM node:${NODE_VERSION} AS builder

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM node:${NODE_VERSION}

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./

USER node

ARG PORT=3000
ENV PORT ${PORT}
EXPOSE ${PORT}

CMD [ "node", "./server.js" ]

