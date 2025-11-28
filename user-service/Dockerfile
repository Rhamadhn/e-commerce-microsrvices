FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y wait-for-it
COPY . .
EXPOSE 4000
CMD ["wait-for-it", "user-db:3306", "--timeout=60", "--", "node", "server.js"]