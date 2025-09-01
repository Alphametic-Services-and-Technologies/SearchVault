FROM node:17-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html