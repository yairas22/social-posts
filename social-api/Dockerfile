FROM node:15.8.0-slim

WORKDIR /social-api

COPY package.json package.json

RUN npm install

COPY . .

CMD ["node", "server.js"]
