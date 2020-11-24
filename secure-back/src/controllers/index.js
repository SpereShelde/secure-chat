import MessageController from './message-controller';
import SocketController from './socket-controller';
import UserController from './user-controller';
import CodeController from './code-controller';
import models from '../models';

const messageController = new MessageController(models.MessageModel);
const socketController = new SocketController(models.SocketModel);
const userController = new UserController(models.UserModel);
const codeController = new CodeController(models.CodeModel);

const controllers = {
  messageController,
  socketController,
  userController,
  codeController,
};

export default controllers;
