FROM node:lts-alpine as builder

RUN apk --no-cache add git

RUN apk --no-cache add python3 make g++

COPY ./package.json ./
RUN yarn install
RUN mkdir /app-ui
RUN mv ./node_modules ./app-ui
WORKDIR /app-ui
COPY ./public ../app-ui/public
COPY ./src ../app-ui/src
COPY ./.env \
     ./.nvmrc \
     ./config-overrides.js \
     ./package.json \
     ../app-ui/
RUN npm run build

FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app-ui/build /usr/share/nginx/html
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
