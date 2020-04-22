const jwt = require('jsonwebtoken');

const secret = 'userissocute,userissocute'

// 生成token
function createToken(payload) {
    payload.ctime = Date.now()
    // 生成token参数， 密钥， 过期时间
    return jwt.sign(payload, secret, { expiresIn: "10d"}) 
}

// 校验token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            err ? reject('token 校验失败') : resolve(data)
        })
    })
}

module.exports = { createToken, verifyToken }