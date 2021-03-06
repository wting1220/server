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
app.use(express.static('public'))
// 引入路由
const userRouter = require('./router/user/userRouter')
app.use('/api', userRouter)
const tagsRouter = require('./router/tags/tagsRouter')
app.use('/api', tagsRouter)
const articleRouter = require('./router/article/articleRouter')
app.use('/api', articleRouter)
const themeRouter = require('./router/theme/themeRouter')
app.use('/api', themeRouter)
const uploadRouter = require('./router/upload/uploadRouter')
app.use('/api', uploadRouter)
const topicRouter = require('./router/topic/topicRouter')
app.use('/api', topicRouter)
const likeRouter = require('./router/likeOrComment/likeRouter')
app.use('/api', likeRouter)
const commentRouter = require('./router/likeOrComment/commentRouter')
app.use('/api', commentRouter)
// const fileRouter = require('./router/fileRouter')
// app.use('/file', fileRouter)


app.listen(3000, () => {
    console.log('打开')
})