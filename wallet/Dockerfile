FROM ubuntu:14.04
MAINTAINER Grant Pidwell <grantpidwell@infinity-g.com>

#### General ####

RUN apt-get update && apt-get install -y curl wget git

#### Install Ruby, Bundler ####

RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev ruby-bundler && \
  rm -rf /var/lib/apt/lists/*
RUN gem install bundler

#### SSH keys for Github access ####
# Ensure that the /.ssh folder is present in the root context!

RUN mkdir -p /root/.ssh
ADD /.ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

#### Clone Github repos ####

RUN mkdir -p home
RUN git clone git@github.com:InfinityG/id-io-static.git /home/id-io-static

#RUN \
#  cd /home/id-io-static/wallet

WORKDIR /home/id-io-static/wallet

### Install NodeJS, npm, Bower, Gulp ###
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update && apt-get install -y curl wget git nodejs
RUN npm install bower -g
RUN npm install gulp -g

### Build the static site ###

RUN gulp build

### Install Ruby dependencies ###

RUN bundler install

####

EXPOSE 8000

CMD rackup

# To build: sudo docker build -t infinityg/id-io-wallet:v1 .
# To run: sudo docker run -it --rm infinityg/id-io-wallet:v1
#   - with port: -p 8000:8000
# Inspect: sudo docker inspect [container_id]
# Delete all containers: sudo docker rm $(docker ps -a -q)
# Delete all images: sudo docker rmi $(docker images -q)
# Connect to running container: sudo docker exec -it [container_id] bash
# Attach to running container: sudo docker attach [container_id]
# Detach from running container without stopping process: Ctrl-p Ctrl-q
# Restart Docker service: sudo service docker.io restart