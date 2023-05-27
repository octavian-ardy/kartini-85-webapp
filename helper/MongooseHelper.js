const debug = require("debug")("app:MongooseHelper");

class MongooseHelper {
  constructor() {
    this.conn_string = process.env.MONGOURL;
    this.conn_string =
      this.conn_string
        .replace("<username>", process.env.MONGOUSER)
        .replace("<password>", process.env.MONGOPASS) + process.env.MONGODB;
    this.mongoose = require("mongoose");
  }

  async getConnection() {
    await this.mongoose
      .connect(this.conn_string, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 10000,
      })
      .then(() => debug("Connected to mongoDB"))
      .catch((err) => {
        throw new Error("Mongo Helper error. Check Connection", { cause: err });
      });
  }

  async closeConnection() {
    await this.mongoose.connection.close();
  }

  // basic save only receive a class of mongoose.model
  async basicSave(model) {
    try {
      await this.getConnection();
      const result = await model.save();
      await this.closeConnection();
      return result;
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  }
}

module.exports = MongooseHelper;
