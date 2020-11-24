/* eslint-disable no-extra-boolean-cast,no-param-reassign */
import BaseController from './base-controller';
const crypto = require('crypto');

class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  /**
   * Create new socket
   * @param {Object} messageData: content, from, to, deleteAfterSeconds
   */
  async create(props) {
    return super.create({
      ...props,
    });
  }

  // async getOne(query, columns, fields = null) {
  //   return super.getOne(query, columns, fields);
  // }

  /**
   * Verify user's keys
   * @param {Object} messageData
   */
  async verify() {

  }
}

export default UserController;
