const express = require("express");
const router = express.Router();
const multer = require('multer')

// 上传图片头像
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/IT-Reader/server/public/assets/')
  },
  filename: function (req, file, cb) { 
    cb(null, file.originalname)
  }
})
let limits = '5M'
let upload = multer({ storage, limits })
router.post('/UploadAPI', upload.single('img'), (req, res) => {
  let { size, mimetype, filename } = req.file
  let types = ['jpg', 'jpeg', 'png']
  let mintype = mimetype.split('/')[1]
  if (size > 5 * 1024 * 1024) {
    return res.send({ err: 'error', msg: '上传文件太大' })
  } else if (types.indexOf(mintype) === -1) {
    return res.send({ err: 'error', msg: '上传文件类型不符合' })
  } else {
    let url = `/assets/${filename}`
    res.send({ err: null, imgUrl: url })
  }
})

module.exports = router;