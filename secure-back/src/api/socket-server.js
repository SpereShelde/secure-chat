import Server from 'socket.io';

class SocketServer {
  constructor() {
    this.channels = {};
    this.msgToStore = [];
  }

  start(restServer) {
    this.server = new Server(restServer);
    this.chatNamespace = this.server.of('/chat');
    this.chatNamespace.on('connection', (socket) => {
      socket.on('init', (data) => {
        const { id, pubKey, nickName } = data; // id denotes userID

        this.channels[id] = {
          socket,
          pubKey,
          nickName,
          status: 1, // active
        };
      });

      socket.on('build', (data) => {
        const { fromID, toID } = data;
        const toSocket = this.channels[toID];
        const fromSocket = this.channels[fromID];
        if (fromSocket.socket.id !== socket.id) {
          return;
        }

        if (toSocket && toSocket.status === 1) {
          // return success to fromID
          socket.emit('buildSuccess', { pubKey: toSocket.pubKey, nickName: toSocket.nickName, id: toID });

          // send newCon to toID
          toSocket.socket.emit('newCon', { pubKey: fromSocket.pubKey, nickName: fromSocket.nickName, id: fromID });
        } else {
          //  fail
          socket.emit('fail', 'Opponent not exist or offline');
        }
      });

      socket.on('msg', (data) => {
        const { fromID, toID, msg } = data;
        console.log('get message');
        const toSocket = this.channels[toID];

        const fromSocket = this.channels[fromID];
        console.log('msg from', fromSocket.nickName);
        console.log('msg to', toSocket.nickName, 'status:', toSocket.status);

        if (toSocket) {
          if (toSocket.status === 1) {
            // console.log('online, send');
            toSocket.socket.emit('msg', { msg, fromID });
          } else {
          // todo store in db
          //   socket.emit('fail', 'User offline');
            console.log('offline!!!');
            this.msgToStore.push({
              from: fromID,
              to: toID,
              encryptedMessage: msg,
            });
          }
        } else {
        //  fail
          socket.emit('fail', 'User not exist');
        }
      });

      // todo implement
      socket.on('logOff', (data) => {
        const { id } = data;
        // const channel = this.channels[id];

        console.log(id, 'go offline');
        // make sure it's not from others'
        if (this.channels[id].socket.id === socket.id) {
          this.channels[id].status = 0;
          // socket.disconnect();
        }
      });
    });
    return this.server;
  }
}

export default SocketServer;
