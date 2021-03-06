FROM node:10
WORKDIR /app
COPY package.json package.jso
RUN npm install
COPY . . 
EXPOSE 3000
CMD ["npm, start"]