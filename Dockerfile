FROM node:16 AS ec-usage-by-project-client

WORKDIR /opt/client

COPY ./client/package.json .
COPY ./client/package-lock.json .
RUN npm install

COPY ./client/public ./public
COPY ./client/src ./src

RUN npm run build

FROM node:16

WORKDIR /opt/api

COPY ./api/package.json .
COPY ./api/package-lock.json .

RUN npm install

COPY --from=ec-usage-by-project-client /opt/client/build ./api/public
COPY ./api/src ./src
COPY ./api/bin ./bin

EXPOSE 8080

CMD [ "node", "./bin/www" ]

