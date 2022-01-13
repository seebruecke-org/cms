FROM node:14.17.6-alpine as build
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY . .

RUN cd plugins/field-link && npm install && \
  cd ../field-wysiwyg && npm install && npm run build && \
  cd ../.. && npm install && npm i semver && \
  NODE_OPTIONS=--max_old_space_size=4096 npm run build -- --clean && \
#  npm prune --production && \
  mkdir -p /usr/src/app/public/uploads


FROM node:14.17.6-alpine
ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY --from=build /usr/src/app .

ENTRYPOINT npm run start
