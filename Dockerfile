FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm \
  && npm ci

COPY . .

RUN npm run buildatroot

###
FROM nginx:1.27-alpine

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/

EXPOSE 80