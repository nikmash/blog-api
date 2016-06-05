FROM node:latest

WORKDIR /home/blog-api

ADD package.json package.json
RUN npm install --no-optional

ADD . .
CMD npm run server

EXPOSE 5000
