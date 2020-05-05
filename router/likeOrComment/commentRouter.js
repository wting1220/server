const express = require("express");
const router = express.Router();
const Article = require("../article/model");
const Topic = require("../topic/model");

// 点赞文章
router.post('/CommentAPI', (req, res) => { 
  let { uid, aid, tid, comment } = req.body
  if (aid) {
    Article.findOne({ _id: aid }).then(data => {
      Article.updateOne({ _id: aid }, { comment: { lists: data.comment.lists.concat({ uid, comment }) } }).then(() => {
        Article.findOne({ _id: aid }).then(secData => {
          res.send({ err: null, data: { lists: secData.comment.lists, count: secData.comment.lists.length } })
        })
      }).catch(err => {
        res.send({ err: 'error', msg: err })
      })
    })
  } else {
    Topic.findOne({ _id: tid }).then(data => {
      Topic.updateOne({ _id: tid }, { comment: { lists: data.comment.lists.concat({ uid, comment }) } }).then(() => {
        Topic.findOne({ _id: tid }).then(secData => {
          res.send({ err: null, data: { lists: secData.comment.lists, count: secData.comment.lists.length } })
        })
      }).catch(err => {
        res.send({ err: 'error', msg: err })
      })
    })
  } 
})

module.exports = router