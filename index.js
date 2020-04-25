const express = require('express')
const db = require('./db/connect')
const app = express()
const path = require('path')
const cors = require('cors')
// 转换数据格式
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
// 跨域
app.use(cors())

// 引入路由
const userRouter = require('./router/user/userRouter')
app.use('/api', userRouter)
const tagsRouter = require('./router/tags/tagsRouter')
app.use('/api', tagsRouter)
const articleRouter = require('./router/article/articleRouter')
app.use('/api', articleRouter)
// const fileRouter = require('./router/fileRouter')
// app.use('/file', fileRouter)


app.listen(3000, () => {
    console.log('打开')
})