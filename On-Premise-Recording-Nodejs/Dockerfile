FROM ubuntu:18.04

# Install Node.js
RUN apt update
RUN apt -y install curl wget
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt -y install nodejs
RUN apt -y install build-essential

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Download the Agora Recording SDK for Linux
RUN wget https://download.agora.io/ardsdk/release/Agora_Recording_SDK_for_Linux_v3.0.6_20210531-1622447901_972.tar.gz \
    && tar -xvzf Agora_Recording_SDK_for_Linux_v3.0.6_20210531-1622447901_972.tar.gz \
    && rm Agora_Recording_SDK_for_Linux_v3.0.6_20210531-1622447901_972.tar.gz \
    && mv Agora_Recording_SDK_for_Linux_FULL/ record/src/sdk/

# Install node-gyp
RUN npm install -g node-gyp

## Build
WORKDIR /usr/src/app/record/src
RUN node-gyp clean \
    && node-gyp configure \
    && node-gyp build \
    && cp build/Release/agorasdk.node ../.

WORKDIR /usr/src/app/server

RUN npm install

EXPOSE 3000
CMD [ "node", "app.js" ]