const mongoose = require("mongoose");
const MongooseHelper = require("../helper/MongooseHelper");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email required"],
    trim: true,
    unique: true,
  },
  password: String,
  salt: String,
  name: String,
  phone: {
    type: String,
    required: [true, "Phone number required"],
    trim: true,
    unique: true,
  },
  telegramID: { type: String, default: "" },
  role: { type: String, default: "customer" },
  isActive: { type: Boolean, default: true },
  isPermit: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserRepository = {
  async createUser(userparam) {
    try {
      const User = mongoose.model("User", userSchema);
      const user = new User({
        ...userparam,
        isActive: true,
        isPermit: false,
      });
      const conn = new MongooseHelper();
      const result = await conn.basicSave(user);
      delete conn;
      return result;
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  },
  async getUser(param) {
    try {
      const User = mongoose.model("User", userSchema);
      const conn = new MongooseHelper();
      await conn.getConnection();
      let findresult = await User.find(param, "-password -salt");
      await conn.closeConnection();
      return findresult;
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  },
  async getOneUser(param) {
    try {
      const User = mongoose.model("User", userSchema);
      const conn = new MongooseHelper();
      await conn.getConnection();
      let findresult = await User.findOne(param, "-password -salt");
      await conn.closeConnection();
      return findresult;
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  },
  async updateOneUser(condition, data) {
    try {
      const User = mongoose.model("User", userSchema);
      const conn = new MongooseHelper();
      await conn.getConnection();
      let updateresult = await User.findOneAndUpdate(
        condition,
        {
          ...data,
          updatedAt: new Date(),
        },
        { new: true }
      );
      await conn.closeConnection();
      return updateresult;
    } catch (err) {
      throw new Error(err.message, { cause: err });
    }
  },
};

module.exports = UserRepository;
