# syntax=docker/dockerfile:1
FROM node:18-alpine3.14
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
EXPOSE 80