FROM node

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY ./services/resume-service1/package*.json ./services/resume-service1/
RUN cd services/resume-service1 && npm install

COPY services/resume-service1 ./services/resume-service1
COPY shared ./shared

WORKDIR /app/services/resume-service1

EXPOSE 8003

CMD [ "npm","start" ]