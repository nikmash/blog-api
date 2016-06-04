FROM ubuntu:14.04

RUN apt-get update && apt-get install -y \
    curl \
    bash

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

RUN apt-get install -y nodejs

ADD package.json package.json
RUN npm install --no-optional

ADD . .
CMD npm start

EXPOSE 5000
