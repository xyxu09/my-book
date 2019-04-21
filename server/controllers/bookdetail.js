// 获取图书详情
const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
    const {id} = ctx.request.id
    await mysql('books')
        .where('id', id)
        .increment('count', 1)
}
