const https = require('https')
const {mysql} = require('../qcloud')
module.exports = async (ctx) => {
    const {isbn, openid} = ctx.request.body
    console.log('isbn, openid', isbn, openid)
    if (isbn && openid) {
        const findRes = await mysql('books')
        .select()
        .where('isbn', isbn)
        console.log(findRes)
        if (findRes.length) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '图书已存在'
                }
            }
            return
        }
        // let url = `https://api.douban.com/v2/book/isbn/${isbn}`
        let url = 'https://api.douban.com/v2/book/isbn/' + isbn
        // 获取豆瓣信息
        console.log('================>')
        const bookinfo = await getJSON(url)
        console.log(`bookinfo:${bookinfo}`)
        const rate = bookinfo.rating.average
        const {title, image, alt, publisher, summary, price} = bookinfo
        // 标签是有多个的
        const tags = bookinfo.tags.map(v => {
            return `${v.title} ${v.count}`
        }).join(',')
        // 多个作者
        const author = bookinfo.author.join(',')
        // 入库
        try {
            await mysql('books').insert({
                isbn, openid, rate, title, image, alt, publisher, summary, price, tags, author
            })
            ctx.state.data = {
                title,
                msg: 'success'
            }
        } catch (e) {
            ctx.state = {
                code: -1,
                data: {
                    msg: '新增失败:' + e.sqlMessage
                }
            }
        }
    }
}

function getJSON (url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let urlData = ''
            res.on('data', data => {
                urlData += data
            })
            res.on('end', data => {
                const bookinfo = JSON.parse(urlData)
                console.log(bookinfo)
                if (bookinfo.title) {
                    resolve(bookinfo)
                }
                reject(bookinfo)
            })
        })
    })
}
