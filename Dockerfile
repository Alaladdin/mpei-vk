FROM node:16-alpine

RUN apk add --no-cache g++ libc6-compat make py3-pip python3 jpeg-dev cairo-dev giflib-dev pango-dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev --foreground-scripts=true
COPY . .

CMD [ "npm", "start" ]
