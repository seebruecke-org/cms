FROM node:18.15.0-alpine as build
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY . .

RUN npm install && npm i semver && \
  NODE_OPTIONS=--max_old_space_size=4096 npm run build && \
  mkdir -p /usr/src/app/public/uploads


FROM node:18.15.0-alpine
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY --from=build /usr/src/app .

ENTRYPOINT npm run start
