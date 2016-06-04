FORM ubuntu:14.04

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    bash

RUN ln -s "$(which nodejs)" /usr/bin/node

ADD package.json package.json
RUN npm install --no-optional

ADD . .
CMD npm start

EXPOSE 5000
