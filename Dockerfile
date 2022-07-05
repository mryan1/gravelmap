# syntax=docker/dockerfile:1
FROM node:18-alpine3.14
WORKDIR /app
COPY . .
RUN chmod -R 777 /app
RUN npm install --production
RUN mkdir gpx
CMD ["node", "server.js"]
EXPOSE 80