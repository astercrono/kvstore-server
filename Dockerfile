FROM node:8.15.0-jessie
MAINTAINER Travis Kern <kern.travis@gmail.com>

RUN apt update --fix-missing
RUN apt install -y bash software-properties-common build-essential sqlite3 libsqlite3-dev

RUN mkdir -p /app
WORKDIR /app

COPY node_modules ./node_modules
COPY src ./src
COPY app.js ./
COPY config.json ./
COPY package.json ./
COPY package-lock.json ./
COPY entrypoint.docker.sh ./

RUN npm install -g forever

EXPOSE 8080

ENTRYPOINT /app/entrypoint.docker.sh