FROM node:4-slim

ENV ELASTICSEARCH_URL "http://elasticsearch:9200"

COPY . /usr/src/node
WORKDIR /usr/src/node
RUN npm install --production

EXPOSE 80
CMD [ "node", "src/server.js" ]
