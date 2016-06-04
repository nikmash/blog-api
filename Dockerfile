FROM node:latest

ADD package.json package.json
RUN npm install --no-optional

ADD . .
CMD npm start

EXPOSE 5000
