FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN npm install --build-from-source
COPY . .
EXPOSE 3003
CMD ["node", "src/index.js"]
