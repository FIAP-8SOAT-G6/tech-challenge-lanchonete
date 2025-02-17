FROM node:lts-alpine

RUN adduser -D products-api

ARG PORT_SERVER=8080
ENV PORT $PORT_SERVER

ARG API_PORT=8080
ENV API_PORT=${API_PORT}

EXPOSE $PORT

RUN mkdir -p /usr/src/app

RUN chown -R products-api /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts -g nodemon && npm install --ignore-scripts

# COPY --chown=products-api . .

COPY --chown=root:root --chmod=755 ./src ./src
COPY --chown=root:root --chmod=755 tsconfig.json ./
COPY --chown=root:root --chmod=755 .sequelizerc ./
COPY --chown=root:root --chmod=755 nodemon.json ./
COPY --chown=root:root --chmod=755 package*.json ./
COPY --chown=root:root --chmod=755 mocharc.json ./

RUN npm run build

USER products-api

CMD [ "node", "build/index.js" ]
