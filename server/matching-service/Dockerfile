FROM node:16-alpine

EXPOSE 3003

# package setup
WORKDIR /app

COPY src /app/src
COPY .eslintrc.json ./
COPY .prettierrc ./
COPY .babelrc ./
COPY .env ./

COPY package.json /app
COPY package-lock.json /app

RUN npm install

CMD ["npm", "start"]
