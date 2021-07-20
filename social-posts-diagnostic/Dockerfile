FROM node:15.8.0-slim

WORKDIR diagnostic

COPY index.js index.js

COPY wait-for-it.sh wait-for-it.sh

COPY package.json package.json

RUN npm install

CMD ["npm", "run", "start"]
