FROM node:alpine

WORKDIR /app
COPY package.json .
#do not install dev
RUN npm install --omit=dev 
COPY . .

CMD ["npm", "start"]