const express = require("express");
const router = express.Router();
const Topic = require("./model");
const User = require("../user/model")

/**
 * @api {post} /AddTopicAPI 添加沸点
 * @apiName 添加沸点
 * @apiGroup Topic
 *
 * @apiParam {String} uid 用户id.
 * @apiParam {String} content 发布内容.
 * @apiParam {Array} img 图片数组.
 * @apiParam {String} href 链接.
 * @apiParam {String} theme 话题.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg  发布沸点成功.
 * 
 * @apiError {String} err error
 * @apiError {String} msg 请校验必填项
 */

router.post("/AddTopicAPI", (req, res) => {
  // 获取数据
  let { uid, content, imgs, href, theme } = req.body;
  if (uid && content) {
    let last_add_time = new Date().getTime();
    console.log(imgs)
    User.find({ _id: uid }).then(data => { 
      Topic.insertMany({ author: data[0], content, imgs, href, theme, last_add_time })
      .then(() => {
          res.send({ err: null, msg: "发布沸点成功" });
      })
      .catch((err) => {
          res.send({ err: "error", msg: err });
      })
    })
    
  } else {
    return res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {put} /UpdateTopicAPI 修改沸点信息
 * @apiName 修改沸点信息
 * @apiGroup Topic
 *
 * @apiParam {String} tid 要修改沸点的tid.
 * @apiParam {String} img 用户头像.
 * @apiParam {String} username 用户名.
 * @apiParam {String} position 职位.
 * @apiParam {String} company 公司.
 * @apiParam {String} selfIntroduction 个人介绍.
 * @apiParam {String} homepage 个人主页.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 修改成功.
 */

router.put("/UpdateTopicAPI", (req, res) => {
  let {
    tid,
    content,
    img,
    href,
    theme,
  } = req.body;
  if (tid) {  
    Topic.updateOne(
      { _id: tid },
      { img, content, href, theme }
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
 * @api {delete} /DeleteTopicAPI 删除沸点信息
 * @apiName 删除沸点信息
 * @apiGroup Topic
 *
 * @apiParam {String} ids 要删除沸点的id数组.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 删除成功.
 */

router.put("/DeleteTopicAPI", (req, res) => {
  let { ids } = req.body;
  if (ids) {
    Topic.deleteMany({ _id: { $in: ids } })
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
 * @api {get} /TopicListAPI 查看沸点列表
 * @apiName 查看沸点列表
 * @apiGroup Topic
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data 用户对象.
 */

router.get("/TopicListAPI", (req, res) => {
  let { sort, theme } = req.query
  if (theme) {
    Topic.find({ theme })
      .then((data) => {
        if (data.length > 0) {
          res.send({ err: null, data });
        } else {
          res.send({ err: 'error', msg: "暂无相关数据" });
        }
      })
      .catch((err) => {
        res.send({ err: "error", msg: err });
      });
  } else { 
    if (sort === 'new') {
      Topic.find().sort({ last_add_time: -1 })
        .then((data) => {
          if (data.length > 0) {
            res.send({ err: null, data });
          } else {
            res.send({ err: 'error', msg: "暂无相关数据" });
          }
        })
        .catch((err) => {
          res.send({ err: "error", msg: err });
        });
    } else { 
      Topic.find().sort({ likes : -1 })
      .then((data) => {
        if (data.length > 0) {
          res.send({ err: null, data });
        } else {
          res.send({ err: 'error', msg: "暂无相关数据" });
        }
      })
      .catch((err) => {
        res.send({ err: "error", msg: err });
      });
    }
  }
  
});

/**
 * @api {get} /TopicDetailAPI 查看沸点信息
 * @apiName 查看沸点信息
 * @apiGroup Topic
 *
 * @apiParam {String} tid 查看沸点的id
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data 用户对象.
 */

router.get("/TopicDetailAPI", (req, res) => {
  let { tid } = req.query;
  if (tid) {
    Topic.find({ _id: tid })
      .then((data) => {
        res.send({ err: null, data: data[0] });
      })
      .catch((err) => {
        res.send({ err: "error", msg: err });
      });
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});


module.exports = router;
