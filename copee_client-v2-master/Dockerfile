FROM node:21.3 as dev 
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
ENTRYPOINT ["tail", "-f", "/dev/null"]