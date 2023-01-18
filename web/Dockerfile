FROM node:alpine

ARG NODE_ENV=development

ENV NODE_ENV=$NODE_ENV
ENV HOST=cluster

# RUN echo NODE_ENV is $NODE_ENV

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD npm run start