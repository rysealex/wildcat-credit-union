FROM node:18

# set working directory inside the container
WORKDIR /usr/src/app

COPY package*.json ./

# install the dependencies
RUN npm install

COPY . .

# port 5000
EXPOSE 5000

# start the server
CMD ["npm", "start"]