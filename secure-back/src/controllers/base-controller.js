class BaseController {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async del(data) {
    await this.model.deleteOne(data);
  }

  async get(query, columns = null, fields = null, sort = null) {
    if (fields) {
      return this.model.find(query)
        // .populate({
        //   path: fields,
        //   select: '-_id',
        // })
        .populate(fields)
        .sort(sort)
        .select(columns).lean()
        .exec();
    }
    return this.model.find(query)
      .select(columns).lean()
      .exec();
  }

  async getOne(query, columns = null, fields = null, sort = null) {
    if (fields) {
      return this.model.findOne(query)
        // .populate({
        //   path: fields,
        //   select: '-_id',
        // })
        .populate(fields)
        .sort(sort)
        .select(columns).lean()
        .exec();
    }
    return this.model.findOne(query)
      .select(columns).lean()
      .exec();
  }

  async updateOne(query, update) {
    return this.model.updateOne(query, {
      $set: update,
    });
  }

  async checkExist(body) {
    return this.model.exists(body);
  }
}

export default BaseController;
