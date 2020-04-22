const mongoose = require("mongoose");
// scheme 对象
// 创建一个和集合相关的 scheme 对象，类似于表头
const Schema = mongoose.Schema;
// 获取 scheme 对象
const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  mail: { type: String, required: true },
  img: { type: String, default: null },
  position: { type: String, default: null },
  company: { type: String, default: null },
  selfIntroduction: { type: String, default: null },
  homepage: { type: String, default: null },
  last_login_time: { type: Number, default: null },
});
// 将 scheme 对象转换为数据模型
var User = mongoose.model("users", schema); // 该数据对象和集合关联('集合名', scheme 对象)
// 抛出
module.exports = User;
