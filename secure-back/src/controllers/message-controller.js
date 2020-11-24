/* eslint-disable no-extra-boolean-cast,no-param-reassign */
import BaseController from './base-controller';

class MessageController extends BaseController {
  constructor(model) {
    super(model);
  }

  /**
   * Create new message
   * @param {Object} msg
   */
  async create(msg) {
    return super.create(msg);
  }

  /**
   * Create new message
   * @param {Array} messages
   */
  async createMany(messages) {
    await Promise.all(messages.map((msg) => (
      this.create(msg)
    )));
  }

  async getOne(query, columns, fields = null) {
    const result = await super.getOne(query, columns, fields);
    if (result === null) {
      return Promise.reject({ errors: 'Not found' });
    }
    return result;
  }
}

export default MessageController;
