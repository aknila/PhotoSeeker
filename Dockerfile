FROM node:10.15.3

WORKDIR /usr/src/app

COPY *.json ./

RUN npm install

COPY . .

EXPOSE 80

ENV PORT=80

CMD [ "npm", "run", "prod" ]