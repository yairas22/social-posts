FROM node:15.8.0-slim

WORKDIR diagnostic

COPY package.json package.json

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
