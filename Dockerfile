FROM node:6.9-alpine
COPY . /app
WORKDIR /app
RUN npm install
CMD npm start
EXPOSE 3000
