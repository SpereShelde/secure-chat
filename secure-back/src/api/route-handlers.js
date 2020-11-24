import crypto from 'crypto';
import Utils from '../utils';

function sendResponse(res, obj, status) {
  res.status(status);
  res.send(obj);
}

function returnSuccess(res, message = 'Success', data = null, status = 200) {
  sendResponse(res, { message, data }, status);
}

function returnBadRequest(res, message = 'Bad Request', data = null, status = 400) {
  sendResponse(res, { message, data }, status);
}

function returnUnauthorized(res, message = 'Unauthorized', data = null, status = 401) {
  sendResponse(res, { message, data }, status);
}

function returnNotFound(res, message = 'Not Found', data = null, status = 404) {
  sendResponse(res, { message, data }, status);
}

/**
 * Main class with registered route handlers
 */
class RouteHandlers {
  constructor(
    config,
    controllers,
    socketServer,
  ) {
    this.config = config;
    this.controllers = controllers;
    this.socketServer = socketServer;

    setInterval(async () => {
      if (this.socketServer.msgToStore.length > 0) {
        // console.log('Store', this.socketServer.msgToStore.length, 'messages');
        await this.controllers.messageController.createMany(this.socketServer.msgToStore);
        this.socketServer.msgToStore = [];
      }
    }, 10 * 1000);
  }

  // Simple ping-pong route
  pingHandler(req, res, next) {
    Utils.log('Ping request received');
    returnSuccess(res, undefined, 'pong');
    return next();
  }

  // get auth code
  async codeHandler(req, res, next) {
    Utils.log('Code request received');
    const code = Math.random().toString(36).substring(7);
    // console.log('Send code', code);
    await this.controllers.codeController.create({ code });
    returnSuccess(res, undefined, { code });
    return next();
  }

  // auth
  async authHandler(req, res, next) {
    Utils.log('Auth request received');
    const { body } = req;
    const {
      pubKey, nickName, code, signature,
    } = body;

    const verified = await this.controllers.codeController.verifySignature(code, pubKey, signature);
    // console.log('Auth verified', verified);
    if (!verified) {
      returnUnauthorized(res);
      return next();
    }

    await this.controllers.codeController.del({ code });
    const hash = crypto.createHash('sha256');
    hash.update(pubKey);
    const id = hash.digest('hex');

    const channels = {};

    const user = await this.controllers.userController.getOne({ id }, null, {
      path: 'unreadMessages',
      // sort: {
      //   updatedAt: 1,
      // },
      // populate: {
      //   path: 'from',
      // },
    });

    if (!user) {
      await this.controllers.userController.create({
        id,
        pubKey,
        nickName,
        offline: false,
      });
    } else {
      const { unreadMessages } = user;

      // update nickname and status
      await this.controllers.userController.updateOne({ id }, { nickName, offline: false });

      await Promise.all(unreadMessages.map(async (msg) => {
        await this.controllers.messageController.del(msg);
      }));

      await Promise.all(unreadMessages.map(async (msg) => {
        const { encryptedMessage, from, updatedAt } = msg;
        // todo improve performance
        const fromUser = await this.controllers.userController.getOne({ id: from });
        if (!channels[from]) {
          channels[from] = {
            nickName: fromUser.nickName,
            unread: 1,
            pubKey: fromUser.pubKey,
            msg: [{
              encryptedMessage,
              updatedAt,
            }],
          };
        } else {
          channels[from].msg.push({
            encryptedMessage,
            updatedAt,
          });
          channels[from].unread += 1;
        }
      }));

      Object.keys(channels).forEach((key) => {
        channels[key].msg.sort((a, b) => (
          a.updatedAt - b.updatedAt
        ));
        //  todo delete
        channels[key].msg = channels[key].msg.map((m) => ({
          direction: 0,
          msg: m.encryptedMessage,
        }));
      });
    }
    returnSuccess(res, undefined, { channels });
    return next();
  }

  // send message
  // async sendMessageHandler(req, res, next) {
  //   Utils.log('Create message request received');
  //   const { body } = req;
  //   const { to, encryptedMsg } = body;
  //   const { offline } = await this.controllers.userController.getOne({ id: to });
  //   if (offline) {
  //   //  store message in db
  //     const result = await this.controllers.messageController.create(body);
  //     returnSuccess(res, undefined, result._id);
  //   } else {
  //   //  send message via socket
  //
  //   }
  //   return next();
  // }

  // Store many messages (store messages in db)
  // async storeManyMessagesHandler(req, res, next) {
  //   Utils.log('Store many messages request received');
  //   const { body } = req;
  //   const { to, encryptedMsg } = body;
  //   const messages = await this.controllers.messageController.get(query);
  //   returnSuccess(res, undefined, messages);
  //   return next();
  // }

  // Fetch many messages (fetch messages in db)
  async fetchManyMessagesHandler(req, res, next) {
    Utils.log('Fetch many messages request received');
    const { body } = req;
    const messages = await this.controllers.messageController.get(body);
    returnSuccess(res, undefined, messages);
    return next();
  }

  // todo 发送消息的时候检查是否有socket，没有则判断对方是否在线，在线则创建socket
  // Create socket
  async createSocketHandler(req, res, next) {
    Utils.log('Create socket request received');
    const { body } = req;
    const result = await this.controllers.messageController.create(body);
    returnSuccess(res, undefined, result._id);
    return next();
  }

  // Fetch many sockets
  async fetchManySocketsHandler(req, res, next) {
    Utils.log('Fetch many sockets request received');
    const { query } = req;
    console.log(query);
    const results = await this.controllers.messageController.get(query);
    returnSuccess(res, undefined, results);
    return next();
  }

  // Create user
  async createUserHandler(req, res, next) {
    Utils.log('Create user request received');
    const { body } = req;
    const result = await this.controllers.messageController.create(body);
    returnSuccess(res, undefined, result._id);
    return next();
  }

  // Fetch one user
  async fetchOneUserHandler(req, res, next) {
    Utils.log('Fetch one user request received');
    const { query } = req;
    console.log(query);
    const results = await this.controllers.messageController.get(query);
    returnSuccess(res, undefined, results);
    return next();
  }

  // logoff
  async logOffHandler(req, res, next) {
    Utils.log('Logoff request received');
    const { body } = req;
    const { id } = body;

    const channel = this.socketServer.channels.get(id);
    channel.status = 0;
    this.socketServer.channels.set(id, channel);

    const user = await this.controllers.userController.getOne({ id });
    user.offline = true;
    user.save();
    returnSuccess(res, undefined);
    return next();
  }
}

export default RouteHandlers;
