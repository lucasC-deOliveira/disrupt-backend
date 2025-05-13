from node

RUN apt-get update && apt-get install -y ffmpeg

workdir /usr/app

copy . .

run npm install

expose 3333

cmd ["npm","run","start:dev"]