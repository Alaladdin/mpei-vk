FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev --silent
COPY . .

CMD [ "npm", "start" ]
