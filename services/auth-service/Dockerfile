FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install --build-from-source
COPY . .
CMD ["node", "src/index.js"]
