FROM node:18

# set the working directory
WORKDIR /app

# install the dependencies
COPY package*.json ./
RUN npm install

COPY . .

# port 3000
EXPOSE 3000

# start app
CMD ["npm", "start"]