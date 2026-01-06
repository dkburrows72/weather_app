FROM node:24-alpine3.22
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
COPY . .
EXPOSE 3000
CMD ["pm2-runtime", "index.js"]


