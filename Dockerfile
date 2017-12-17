FROM node:latest

COPY ./src ./src
COPY ./package.json ./package.json

RUN ["npm", "install"]
WORKDIR ./src
CMD ["node", "index.js"]