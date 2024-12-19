FROM node:20.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx sucrase ./src -d ./dist --transforms imports

EXPOSE 3333

CMD ["node", "dist/server.js"]
