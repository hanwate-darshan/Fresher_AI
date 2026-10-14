FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./gateway1/package*.json ./gateway1/
RUN cd gateway1 && npm install

COPY gateway1 ./gateway1
COPY shared ./shared

WORKDIR /app/gateway1

EXPOSE 8000

CMD [ "npm","start" ]





