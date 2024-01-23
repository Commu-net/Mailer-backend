FROM node:lts-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install --omit=dev

COPY ../../dist/apps/auth ./

EXPOSE 4000

CMD ["node","main.js"]