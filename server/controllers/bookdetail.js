const {mysql} = require('../qcloud.js')
module.exports = async (ctx) => {
    const id = ctx.query.id
    // 获取图书详情
    const detail = await mysql('books')
        // 连表查询 获取用户信息
        .select('books.*', 'cSessionInfo.user_info')
        .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')
        .where('id', id)
        .first()
    const info = JSON.parse(detail.user_info)
    ctx.state.data = Object.assign({}, detail, {
        user_info: {
            nickName: info.nickName,
            image: info.avatarUrl
        }
    })
    await mysql('books')
        .where('id', id)
        .increment('count', 1)  // 统计图书访问量
}
