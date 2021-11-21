FROM node:16-alpine
LABEL maintainer="João Marques <marques.joaopereira@gmail.com>"

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Had to remove this because Heroku requires port 80, which needs a priviledged account
#RUN addgroup -g 1001 ghouse && adduser -u 1001 -G ghouse -h /usr/ghouse -D ghouse
WORKDIR /var/www/expressjs-boilerplate
#USER ghouse

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# Remove because of heroku
#ENV PORT=80
#EXPOSE ${PORT}

CMD [ "npm", "run", "serve" ]
