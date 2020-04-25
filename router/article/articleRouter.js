const express = require("express");
const router = express.Router();
const Article = require("./model");

/**
 * @api {post} /PublishArticleAPI 添加
 * @apiName 添加
 * @apiGroup Article
 *
 * @apiParam {String} uid 发布者用户id.
 * @apiParam {String} title 文章标题.
 * @apiParam {String} content 文章内容.
 * @apiParam {String} label 文章分类(一级标签).
 * @apiParam {String} child 标签名(二级标签child).
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.post("/PublishArticleAPI", (req, res) => {
  let { uid, title, content, label, child } = req.body;
  if (uid && title && content && label && child) {
    let time = new Date().getTime();
    Article.insertMany({ uid, title, content, label, child, publish_time: time })
      .then(() => {
        res.send({ err: null, msg: "发布成功" });
      })
      .catch(() => {
        res.send({ err: "error", msg: "发布失败" });
      });
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {put} /UpdateArticleAPI 修改
 * @apiName 修改
 * @apiGroup Article
 *
 * @apiParam {String} aid 文章id.
 * @apiParam {String} title 文章标题.
 * @apiParam {String} content 文章内容.
 * @apiParam {String} label 文章分类(一级标签).
 * @apiParam {String} child 标签名(二级标签child).
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.put("/UpdateArticleAPI", (req, res) => {
  let { aid, title, content, label, child } = req.body;
  if (aid && title && content && label && child) {
    let time = new Date().getTime();
    Article.updateOne(
      { _id: aid },
      { title, content, label, child, publish_time: time }
    )
      .then(() => {
        res.send({ err: null, msg: "修改成功" });
      })
      .catch(() => {
        res.send({ err: "error", msg: "修改失败" });
      });
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {delete} /DeleteArticleAPI 删除
 * @apiName 删除
 * @apiGroup Article
 *
 * @apiParam {String} aid 要删除文章的id.
 * @apiParam {array} ids 要批量删除文章的id数组.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.delete("/DeleteArticleAPI", (req, res) => {
  let { aid, ids } = req.body;
  if (ids) {
    Article.deleteMany({ _id: { $in: ids } })
      .then(() => {
        res.send({ err: null, msg: "删除成功" });
      })
      .catch(() => {
        res.send({ err: "error", msg: "删除失败" });
      });
  } else if (aid) {
    Article.deleteOne({ _id: aid })
      .then(() => {
        res.send({ err: null, msg: "删除成功" });
      })
      .catch(() => {
        res.send({ err: "error", msg: "删除失败" });
      });
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {get} /ArticleListAPI 文章整个list查询(不传query默认全部，传参分类查询)
 * @apiName 文章整个list查询
 * @apiGroup Article
 *
 * @apiParam {String} uid 要查询用户有关的文章的id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.get("/ArticleListAPI", (req, res) => {
  let { uid, label, child } = req.query;
  if (uid) {
    // 根据用户查
    Article.find({ uid })
      .then((data) => {
        data.length > 0
          ? res.send({ err: null, data })
          : res.send({ err: null, msg: "暂无相关数据" });
      })
      .catch((err) => {
        res.send({ err: null, msg: err });
      });
  } else if (label) {
    // 根据所选标签查
    Article.find({ label })
      .then((data) => {
        data.length > 0
          ? res.send({ err: null, data })
          : res.send({ err: null, msg: "暂无相关数据" });
      })
      .catch((err) => {
        res.send({ err: null, msg: err });
      });
  } else if (label && child) {
    Article.find({ $and: [{ label }, { child }] })
      .then((data) => {
        data.length > 0
          ? res.send({ err: null, data })
          : res.send({ err: null, msg: "暂无相关数据" });
      })
      .catch((err) => {
        res.send({ err: null, msg: err });
      });
  } else {
    Article.find()
      .then((data) => {
        data.length > 0
          ? res.send({ err: null, data })
          : res.send({ err: null, msg: "暂无相关数据" });
      })
      .catch((err) => {
        res.send({ err: null, msg: err });
      });
  }
});

/**
 * @api {get} /ArticleDetailAPI 每个文章详情查询
 * @apiName 每个文章详情查询
 * @apiGroup Article
 *
 * @apiParam {String} aid 要查询文章详情的id.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.get("/ArticleDetailAPI", (req, res) => {
  let { aid } = req.body;
  Article.find({ _id: aid })
    .then((data) => {
      data.length > 0
        ? res.send({ err: null, data })
        : res.send({ err: null, msg: "暂无相关数据" });
    })
    .catch((err) => {
      res.send({ err: null, msg: err });
    });
});

// 热度 = 点击数 * 0.25 + 评论数 * 0.35 + 收藏数 * 0.4

module.exports = router;
