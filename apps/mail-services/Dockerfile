FROM node:lts-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install --omit=dev

COPY ../../dist/apps/mail-services ./

RUN mkdir -p /app/apps/mail-services/src/temp

EXPOSE 3000

CMD ["node","main.js"]