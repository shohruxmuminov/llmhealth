FROM node:20-slim AS base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Script to run migrations and start the app
CMD npx prisma migrate deploy && npm start
