const express = require("express");
const router = express.Router();
const Article = require("../article/model");
const Topic = require("../topic/model");

// 点赞文章
router.post('/LikeAPI', (req, res) => { 
  let { uid, aid, tid } = req.body
  if (aid) {
    Article.findOne({ _id: aid }).then(data => {
      const index = data.likes.lists.indexOf(uid)
      if (data.likes.lists.includes(uid)) {
        Article.updateOne({ _id: aid }, { likes: { lists: data.likes.lists.slice(0, index) } }).then(() => {
          Article.findOne({ _id: aid }).then(secData => { 
            res.send({ err: null, count: secData.likes.lists.length })
          })
        }).catch(err => {
          res.send({ err: 'error', msg: err })
        })
      } else {
        Article.updateOne({ _id: aid }, { likes: { lists: data.likes.lists.concat(uid) } }).then(() => {
          Article.findOne({ _id: aid }).then(secData => { 
            res.send({ err: null, count: secData.likes.lists.length })
          })
        }).catch(err => {
          res.send({ err: 'error', msg: err })
        })
      }
    })
  } else { 
    Topic.findOne({ _id: tid }).then(data => {
      const index = data.likes.lists.indexOf(uid)
      console.log(index)
      if (data.likes.lists.includes(uid)) {
        Topic.updateOne({ _id: tid }, { likes: { lists: data.likes.lists.slice(0, index) } }).then(() => {
          Topic.findOne({ _id: tid }).then(secData => { 
            res.send({ err: null, count: secData.likes.lists.length })
          })
        }).catch(err => {
          res.send({ err: 'error', msg: err })
        })
      } else {
        Topic.updateOne({ _id: tid }, { likes: { lists: data.likes.lists.concat(uid) } }).then(() => {
          Topic.findOne({ _id: tid }).then(secData => { 
            res.send({ err: null, count: secData.likes.lists.length })
          })
        }).catch(err => {
          res.send({ err: 'error', msg: err })
        })
      }
    })
  }
  
})


module.exports = router