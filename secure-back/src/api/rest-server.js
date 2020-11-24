import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware2';
import Utils from '../utils';

// API Route handlers
import RouteHandlers from './route-handlers';

// Cors middelware parameters
const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
});

/**
 * Rest Server main class, includes route handlers for handling specific API routes
 */
class RestServer {
  constructor(config, controllers, socketServer) {
    this.config = config;

    // Initialize route handlers
    this.routeHandlers = new RouteHandlers(
      config,
      controllers,
      socketServer,
    );

    this.server = restify.createServer();
    this.server.pre(cors.preflight);
    this.server.use(cors.actual);
    this.server.use(restify.plugins.queryParser({ mapParams: false }));
    this.server.use(restify.plugins.bodyParser());

    // Register API Routes
    this.registerRoutes();
  }

  /**
     * Register API routes and connect them with route handlers
     */
  registerRoutes() {
    // Testing routes
    this.server.get('/ping', this.routeHandlers.pingHandler.bind(this.routeHandlers));
    this.server.get('/code', this.routeHandlers.codeHandler.bind(this.routeHandlers));
    // this.server.post('/message', this.routeHandlers.sendMessageHandler.bind(this.routeHandlers));
    this.server.post('/messages', this.routeHandlers.fetchManyMessagesHandler.bind(this.routeHandlers));
    // this.server.post('/socket', this.routeHandlers.createSocketHandler.bind(this.routeHandlers));
    // this.server.get('/sockets', this.routeHandlers.fetchManySocketsHandler.bind(this.routeHandlers));
    // this.server.post('/user', this.routeHandlers.createUserHandler.bind(this.routeHandlers));
    // this.server.get('/user', this.routeHandlers.fetchOneUserHandler.bind(this.routeHandlers));

    // login
    this.server.post('/auth', this.routeHandlers.authHandler.bind(this.routeHandlers));

    // logoff
    this.server.post('/logoff', this.routeHandlers.authHandler.bind(this.routeHandlers));
  }

  /**
     * Start REST API
     */
  start() {
    this.server.listen(
      this.config.apiConfig.port,
      this.config.apiConfig.host,
      () => Utils.log(`API started listening on ${
        this.server.address().address
      }:${
        this.config.apiConfig.port
      }`),
    );
  }
}

export default RestServer;
