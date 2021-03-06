# syntax=docker/dockerfile:1
FROM node:18-alpine3.14
WORKDIR /app
COPY . .
RUN mkdir gpx
RUN chmod -R 777 /app
RUN npm install --production
CMD ["node", "server.js"]
EXPOSE 80