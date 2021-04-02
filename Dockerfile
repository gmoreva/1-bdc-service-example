FROM node:alpine

WORKDIR /app
COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm i
COPY ./ /app
CMD node index.js
