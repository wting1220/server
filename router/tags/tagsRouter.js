const express = require("express");
const router = express.Router();
const Tags = require("./model");

/**
 * @api {post} /AddTagsAPI 添加
 * @apiName 添加
 * @apiGroup Tags
 *
 * @apiParam {String} label 标签名.
 * @apiParam {Array} child 标签二级.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 添加成功.
 */

router.post("/AddTagsAPI", (req, res) => {
  let { label, child } = req.body;
  if (label) {
    Tags.find({ label })
      .then((data) => {
        if (data.length > 0) {
          res.send({ err: "error", msg: "该标签已存在" });
        } else {
          return Tags.insertMany({ label, child });
        }
      })
      .then(() => {
        res.send({ err: null, msg: "添加成功" });
      })
      .catch(() => {
        res.send({ err: "error", msg: "添加失败" });
      });
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {put} /UpdateTagsAPI 修改
 * @apiName 修改
 * @apiGroup Tags
 *
 * @apiParam {String} tid 要修改标签的id.
 * @apiParam {String} label 标签名.
 * @apiParam {Array} child 标签二级.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 修改成功.
 */

router.put("/UpdateTagsAPI", (req, res) => {
  let { tid, label, child } = req.body;
  if (tid && (label || child)) {
    Tags.updateOne({ _id: tid }, { label, child })
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
 * @api {delete} /DeleteTagsAPI 删除
 * @apiName 删除
 * @apiGroup Tags
 *
 * @apiParam {String} ids 要删除标签的id数组.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 删除成功.
 */

router.delete("/DeleteTagsAPI", (req, res) => {
  let { ids } = req.body;
  if (ids) {
    Tags.deleteMany({ _id: { $in: ids } })
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
 * @api {get} /TagsListAPI 标签整个list查询
 * @apiName 标签整个list查询
 * @apiGroup Tags
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data [{label: '', child: []}].
 */

router.get("/TagsListAPI", (req, res) => {
  Tags.find()
    .then((data) => {
      res.send({ err: null, data });
    })
    .catch((err) => {
      res.send({ err: null, msg: err });
    });
});

/**
 * @api {get} /TagsDetailAPI 每个标签详情查询
 * @apiName 每个标签详情查询
 * @apiGroup Tags
 *
 * @apiParam {String} tid 要查询标签详情的tid.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

router.get("/TagsDetailAPI", (req, res) => {
  let { tid } = req.body;
  Tags.find({ _id: tid })
    .then((data) => {
      res.send({ err: null, data: data[0] });
    })
    .catch((err) => {
      res.send({ err: null, msg: err });
    });
});

module.exports = router;
