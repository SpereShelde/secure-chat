# secure-chat
A RSA based online chat system

## Install

Ubuntu is the recommended system

### Install Git

`apt install git`

### Install Node.js

Install Node.js v14.x

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

###  Clone Repo

`git clone https://github.com/SpereShelde/secure-chat.git`

### Install Dependencies

```
cd secure-chat
cd secure-back
npm i                   # install backend dependancies
cd ../secure-front
npm i                   # install fontend dependancies
```

### Install MongoDB

[Doc](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Run

### Run Backend

```
cd PATH-TO-secure-back
npm start
```

Now, the secure-back runs at `127.0.0.1:8181`

You can test the backend by visit `127.0.0.1:8181/ping`

### Rund frontend

```
cd PATH-TO-secure-front
npm start
```

Now, the secure-front runs at `127.0.0.1:3000`

You can test the frontend by visit `127.0.0.1:3000`
