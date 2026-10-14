FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./services/billing-service1/package*.json ./services/billing-service1/
RUN cd services/billing-service1 && npm install

COPY services/billing-service1 ./services/billing-service1
COPY shared ./shared

WORKDIR /app/services/billing-service1

EXPOSE 8005

CMD [ "npm","start" ]
