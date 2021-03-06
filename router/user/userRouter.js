const express = require("express");
const router = express.Router();
const User = require("./model");
const email = require("../../utils/email");
const jwt = require("../../utils/token");

let codes = {};

function GetRepeatUser(username, mail) {
  return new Promise((resolve, reject) => {
    if (username || mail) {
      User.find({ $or: [{ username }, { mail }] })
        .then(data => {
          if (data.length > 0) {
            resolve({ err: 'error', msg: "用户已存在" });
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
 * @api {post} /regist 用户注册
 * @apiName 用户注册
 * @apiGroup User
 *
 * @apiParam {String} username 用户名.
 * @apiParam {String} password 密码.
 * @apiParam {String} mail 邮箱.
 * @apiParam {Number} code 验证码.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg  注册成功.
 * 
 * @apiError {String} err error
 * @apiError {String} msg 验证码错误/请校验必填项
 */

router.post("/regist", (req, res) => {
  // 获取数据
  let { username, password, mail, code } = req.body;
  if (username && password && mail && code) {
    if (codes[mail] === +code) {
      GetRepeatUser(username).then(data => {
        if (data.err === null) {
          User.insertMany({ username, password, mail })
            .then(() => {
              res.send({ err: null, msg: "注册成功" });
            })
            .catch((err) => {
              res.send({ err: "error", msg: err });
            });
        } else {
          res.send(data)
        }
      })
    } else {
      return res.send({ err: "error", msg: "验证码错误" });
    }
  } else {
    return res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {post} /login 用户登陆
 * @apiName 用户登陆
 * @apiGroup User
 *
 * @apiParam {String} username 用户名或者mail.
 * @apiParam {String} password 密码.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 登陆成功.
 * @apiSuccess {String} token 登陆成功返回的 token 值.
 */

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  if (username && password) {
    User.find({ $or: [{ username }, { mail: username }] })
      .then((data) => {
        data.length > 0
          ? User.find({ password }).then((data) => {
            if (data.length > 0) {
              let token = jwt.createToken({ id: data[0]._id, img: data[0].img, last_login_time: data[0].last_login_time });
              let time = new Date().getTime();
              User.updateOne({ username }, { last_login_time: time }).then(
                () => {
                  res.send({ err: null, msg: "登陆成功", token });
                }
              );
            } else {
              res.send({ err: "error", msg: "密码错误" });
            }
          })
          : res.send({ err: "error", msg: "用户名不存在" });
      })
      .catch((err) => {
        return res.send({ err: "error", msg: err });
      });
  } else {
    return res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {post} /GetMailCodeAPI 验证码获取
 * @apiName 验证码获取
 * @apiGroup User
 *
 * @apiParam {String} mail 邮箱.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 验证码发送成功(有效时间3分钟).
 */

// 邮箱验证
router.post("/GetMailCodeAPI", (req, res) => {
  let { mail } = req.body;
  let code = parseInt(Math.random() * (9999 - 1000) + 1000);
  let date = Math.round(new Date() / 1000);
  if (codes["date"]) {
    if (date - codes["date"] > 60 * 3) {
      email
        .sendMessage(mail, code)
        .then(() => {
          codes[mail] = code;
          codes["date"] = date;
          res.send({ err: null, msg: "验证码发送成功" });
        })
        .catch((err) => {
          res.send({ err: "error", msg: err });
        });
    } else {
      res.send({ err: "error", msg: "已发送请求，请稍后" });
    }
  } else {
    email
      .sendMessage(mail, code)
      .then(() => {
        codes[mail] = code;
        codes["date"] = date;
        res.send({ err: null, msg: "验证码发送成功" });
      })
      .catch((err) => {
        res.send({ err: "error", msg: err });
      });
  }
});

/**
 * @api {put} /UpdateUserAPI 修改用户信息
 * @apiName 修改用户信息
 * @apiGroup User
 *
 * @apiParam {String} uid 要修改用户的uid required.
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

router.put("/UpdateUserAPI", (req, res) => {
  let {
    uid,
    img,
    username,
    oldpassword,
    newpassword,
    position,
    company,
    selfIntroduction,
    homepage,
  } = req.body;
  if (uid) {
    if (oldpassword && newpassword) {
      // 修改密码
      User.findOne({ _id: uid }).then((dataOne) => {
        if (dataOne.password === oldpassword) {
          User.updateOne({ _id: uid }, { password: newpassword })
            .then(() => {
              res.send({ err: null, msg: "修改成功" });
            })
            .catch(() => {
              res.send({ err: "error", msg: "修改失败" });
            });
        } else {
          res.send({ err: "error", msg: "原始密码不正确" });
        }
      });
    } else {
      // 修改用户信息
      GetRepeatUser(username).then(data => {
        if (data.err === null) {
          User.updateOne(
            { _id: uid },
            { img, username, position, company, selfIntroduction, homepage }
          )
            .then(() => {
              res.send({ err: null, msg: "修改成功" });
            })
            .catch(() => {
              res.send({ err: "error", msg: "修改失败" });
            });
        } else {
          res.send(data);
        }
      })
    }
  } else {
    res.send({ err: "error", msg: "请校验必填项" });
  }
});

/**
 * @api {delete} /DeleteUserAPI 删除用户信息
 * @apiName 删除用户信息
 * @apiGroup User
 *
 * @apiParam {String} ids 要删除用户的id数组.
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} msg 删除成功.
 */

router.put("/DeleteUserAPI", (req, res) => {
  let { ids } = req.body;
  if (ids) {
    User.deleteMany({ _id: { $in: ids } })
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
 * @api {get} /UserListAPI 查看用户信息列表
 * @apiName 查看用户信息列表
 * @apiGroup User
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data 用户对象.
 */

router.get("/UserListAPI", (req, res) => {
  User.find()
    .then((data) => {
      if (data.length > 0) {
        res.send({ err: null, data });
      } else {
        res.send({ err: null, msg: "暂无相关数据" });
      }
    })
    .catch((err) => {
      res.send({ err: "error", msg: err });
    });
});

/**
 * @api {get} /UserInfoAPI 查看用户信息
 * @apiName 查看用户信息
 * @apiGroup User
 *
 * @apiParam {String} uid 查看用户的id
 *
 * @apiSuccess {String} err null.
 * @apiSuccess {String} data 用户对象.
 */

router.get("/UserInfoAPI", (req, res) => {
  let { uid } = req.query;
  if (uid) {
    User.find({ _id: uid })
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

// 关注用户
router.post('/AttentionUserAPI', (req, res) => { 
  let { uid, attentionID } = req.body
  User.findOne({ _id: attentionID }).then(data => { 
    User.updateOne({ _id: attentionID }, { attention: { lists: data.attention.lists.concat(uid) }}).then(() => { 
      res.send({err: null, msg: '关注成功'})
    }).catch(err => { 
      res.send({err: 'error', msg: err})
    })
  })
})


module.exports = router;
