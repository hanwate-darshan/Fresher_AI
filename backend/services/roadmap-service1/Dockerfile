FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./services/roadmap-service1/package*.json ./services/roadmap-service1/
RUN cd services/roadmap-service1 && npm install

COPY services/roadmap-service1 ./services/roadmap-service1
COPY shared ./shared

WORKDIR /app/services/roadmap-service1

EXPOSE 8004

CMD [ "npm","start" ]