FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY env.js /usr/share/nginx/html/env.js

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3005

CMD ["nginx", "-g", "daemon off;"]