FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./services/interview-service1/package*.json ./services/interview-service1/
RUN cd services/interview-service1 && npm install

COPY services/interview-service1 ./services/interview-service1
COPY shared ./shared

WORKDIR /app/services/interview-service1

EXPOSE 8002

CMD [ "npm","start" ]