import controllers from '../controllers';
import RestServer from './rest-server';
import SocketServer from './socket-server';

export default (config) => {
  const socketServer = new SocketServer();
  return {
    RestServer: new RestServer(config, controllers, socketServer),
    SocketServer: socketServer,
  };
};
