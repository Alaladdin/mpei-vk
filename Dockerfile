FROM node:16-bullseye

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

CMD [ "npm", "start" ]
