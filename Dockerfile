FROM node:16-alpine
LABEL maintainer="João Marques <marques.joaopereira@gmail.com>"

RUN apk update && apk upgrade && \
    apk add --no-cache bash

RUN addgroup -g 1001 friency && adduser -u 1001 -G friency -h /usr/friency -D friency

WORKDIR /var/www/friency

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

ENV PORT=3000
ENV LOG_LEVEL=INFO

EXPOSE ${PORT}

USER friency

CMD [ "npm", "run", "serve" ]
