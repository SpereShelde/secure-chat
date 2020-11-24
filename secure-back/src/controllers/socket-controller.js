/* eslint-disable no-extra-boolean-cast,no-param-reassign */
import BaseController from './base-controller';

class SocketController extends BaseController {
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

  async getOne(query, columns, fields = null) {
    const result = await super.getOne(query, columns, fields);
    if (result === null) {
      return Promise.reject({ errors: 'Not found' });
    }
    return result;
  }
}

export default SocketController;
