FROM node:lts-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install --omit=dev

COPY ../../dist/apps/mail-service ./

RUN mkdir -p /app/apps/mail-service/src/temp

EXPOSE 3000

CMD ["node","main.js"]