FROM node:lts-alpine AS frontend

WORKDIR /usr/src/app

COPY client/package*.json ./

RUN npm install

COPY client/ ./

RUN npm run build

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ ./

COPY --from=frontend /usr/src/app/build ./build

ENV BUILD_PATH ./build

CMD ["node", "index.js"]
