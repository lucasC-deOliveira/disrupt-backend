from node

workdir /usr/app

copy . .

run npm install

expose 3333

cmd ["npm","run","start:dev"]