FROM node:12.18.1
RUN cp -r . /app
WORKDIR "/app"
RUN npm install && npm start
