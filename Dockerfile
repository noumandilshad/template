FROM node:16-alpine
LABEL maintainer="João Marques <marques.joaopereira@gmail.com>"

RUN apk update && apk upgrade && \
    apk add --no-cache bash

RUN addgroup -g 1001 expressjs-boilerplate && adduser -u 1001 -G expressjs-boilerplate -h /usr/expressjs-boilerplate -D expressjs-boilerplate

WORKDIR /var/www/expressjs-boilerplate

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

ENV PORT=3000
ENV LOG_LEVEL=INFO

EXPOSE ${PORT}

USER expressjs-boilerplate

CMD [ "npm", "run", "serve" ]
