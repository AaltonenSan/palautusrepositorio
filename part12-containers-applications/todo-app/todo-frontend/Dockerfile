FROM node:16 AS base

ENV REACT_APP_BACKEND_URL=http://localhost:3000

WORKDIR /usr/src/app

FROM base as test-stage
COPY . .
RUN npm ci
RUN CI=true npm test

FROM test-stage as build-stage
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

