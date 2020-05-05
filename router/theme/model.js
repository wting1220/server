const mongoose = require("mongoose");
// scheme 对象
// 创建一个和集合相关的 scheme 对象，类似于表头
const Schema = mongoose.Schema;
// 获取 scheme 对象
const schema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  info: {type:String},
  attention: { type: Number, default: 0 },
  topic: { type: Number, default: 0 },
});
// 将 scheme 对象转换为数据模型
var Theme = mongoose.model("theme", schema); // 该数据对象和集合关联('集合名', scheme 对象)
// 抛出
module.exports = Theme;
