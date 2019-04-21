const {mysql} = require('../qcloud.js')
module.exports = async (ctx) => {
    const top = await mysql('books')
      .select('id', 'title', 'image', 'count')
      .orderBy('count', 'desc')
      .limit(9)
    ctx.state.data = {
        list: top
    }
}
