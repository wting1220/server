const mongoose = require("mongoose");
// scheme 对象
// 创建一个和集合相关的 scheme 对象，类似于表头
const Schema = mongoose.Schema;
// 获取 scheme 对象
const schema = new Schema({
  author: { type: Object, required: true },
  content: { type: String, required: true },
  theme: { type: String, default: null },
  imgs: { type: Array, default: null },
  href: { type: String, default: null },
  likes: {
    lists: {type:Array, default: []},
  },
  comment: {
    lists: { type: Array, default: [] },
  },
  last_add_time: { type: Number, default: null },
});
// 将 scheme 对象转换为数据模型
var Topic = mongoose.model("topic", schema); // 该数据对象和集合关联('集合名', scheme 对象)
// 抛出
module.exports = Topic;