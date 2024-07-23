FROM --platform=linux/amd64 node:lts-alpine

ARG PORT_SERVER=8080
ENV PORT $PORT_SERVER

EXPOSE $PORT

RUN mkdir -p /home/node/app/node_modules 

WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD [ "node", "src/index.js" ]