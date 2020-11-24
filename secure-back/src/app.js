import mongoose from 'mongoose';
import api from './api';

class App {
  constructor(config) {
    mongoose.connect(config.databaseConfig.url + config.databaseConfig.database, { useNewUrlParser: true, useUnifiedTopology: true });
    this.api = api(config);
  }

  start() {
    this.api.RestServer.start();
    this.api.SocketServer.start(this.api.RestServer.server.server);
    // socketEmitController is used to broadcast socket message to front-end
    // this.api.RestServer.controllers.socketEmitController.on('broadcast', (args) => {
    //   this.api.SocketServer.broadcast(args.data, args.nameSpace);
    // });
  }
}

export default App;
