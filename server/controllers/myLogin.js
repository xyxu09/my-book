const request = require('request')
module.exports = async (ctx, next) => {
    console.log(ctx)
    let code = ctx.query.code
    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
            grant_type: 'authorization_code',
            appid: 'wx024ff50a2f858375',
            secret: '5c30165eb23e6527b725a1b071b14e19',
            js_code: code
        }
    }, (err, res, data) => {
        if (res.statusCode === 200) {
            console.log('res', res)
            console.log('[openid]', data.openid)
            console.log('[session_key]', data.session_key)
            // const sessionid = data.openid + data.session_key
            // 不能返回敏感的数据 操作数据库
            // res.json({ sessionid: sessionid })
            // res.json({ openid: data.openid })
        } else {
            res.json(err)
        }
    })
}
