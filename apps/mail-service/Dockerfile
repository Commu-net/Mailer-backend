FROM node:lts-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install --omit=dev

COPY ../../dist/apps/mail-service ./

CMD ["node","main.js"]