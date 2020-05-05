const express = require("express");
const router = express.Router();
const Theme = require("./model");

function GetRepeatTheme(name) {
  return new Promise((resolve, reject) => {
    if (name) {
      Theme.find({ name })
        .then(data => {
          if (data.length > 0) {
            resolve({ err: 'error', msg: "话题已存在" });
          } else { 
            resolve({ err: null, msg: "" });
          }
        })
        .catch((err) => {
          resolve({ err: "error", msg: err });
        });
    } else {
      resolve({ err: "error", msg: '请校验必填项' });
    }
  })
}


/**
 * @api {post} /AddThemeAPI 添加
 * @apiName 添加
 * @apiGroup Theme
 *
 * @apiParam {String} name 话题名.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 添加成功.
 */

router.post("/AddThemeAPI", (req, res) => {
  let { name, img, info } = req.body;
  if (name) {
    GetRepeatTheme(name).then(data => { 
      if (data.err === null) { 
        Theme.insertMany({ name, img, info }).then(() => { 
          res.send({ err: null, msg: "添加成功" });
        }).catch(() => {
        res.send({ err: "error", msg: "添加失败" });
      });
      }
    })
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {delete} /DeleteThemeAPI 删除
 * @apiName 删除
 * @apiGroup Theme
 *
 * @apiParam {String} ids 要删除话题的id数组.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 删除成功.
 */

router.delete("/DeleteThemeAPI", (req, res) => {
  let { ids } = req.body;
  if (ids) {
    Theme.deleteMany({ _id: { $in: ids } })
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
 * @api {get} /ThemeListAPI 话题整个list查询
 * @apiName 话题整个list查询
 * @apiGroup Theme
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data [{label: '', child: []}].
 */

router.get("/ThemeListAPI", (req, res) => {
  Theme.find()
    .then((data) => {
      res.send({ err: null, data });
    })
    .catch((err) => {
      res.send({ err: 'error', msg: err });
    });
});

/**
 * @api {get} /GetThemeAPI 话题详情查询
 * @apiName 话题详情查询
 * @apiGroup Theme
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data [{label: '', child: []}].
 */

router.get("/GetThemeAPI", (req, res) => {
  let { tid } = req.query
  Theme.find({ _id: tid })
    .then((data) => {
      res.send({ err: null, data: data[0] });
    })
    .catch((err) => {
      res.send({ err: 'error', msg: err });
    });
});

/**
 * @api {get} /UpdateThemeAPI 话题修改
 * @apiName 话题修改
 * @apiGroup Theme
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data [{label: '', child: []}].
 */
router.post("/UpdateThemeAPI", (req, res) => {
  let {
    tid,
    img,
    name,
    info
  } = req.body;
  if (tid) {
    Theme.updateOne(
      { _id: tid },
      { name, img, info }
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

module.exports = router;
