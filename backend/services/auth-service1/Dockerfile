FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./services/auth-service1/package*.json ./services/auth-service1/
RUN cd services/auth-service1 && npm install

COPY services/auth-service1 ./services/auth-service1
COPY shared ./shared

WORKDIR /app/services/auth-service1

EXPOSE 8001

CMD [ "npm","start" ]
