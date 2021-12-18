FROM node:16-alpine
LABEL maintainer="João Marques <marques.joaopereira@gmail.com>"

ENV USER=friency
ENV UID=1001
ENV GID=1001

RUN apk update && apk upgrade && \
    apk add --no-cache bash

RUN addgroup \
    -g "$GID" \
    "$USER"

RUN adduser \
    --disabled-password \
    -h /var/www/friency \
    --ingroup "$USER" \
    --uid "$UID" \
    "$USER"

WORKDIR /var/www/friency

RUN chown "$USER" /var/www/friency

USER friency

COPY --chown="$USER" package*.json ./

RUN npm install

COPY --chown="$USER" . .

RUN npm run build

ENV PORT=3000
ENV LOG_LEVEL=INFO

EXPOSE ${PORT}

CMD [ "npm", "run", "serve" ]
