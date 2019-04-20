// const https = require('https')
const {mysql} = require('../qcloud')
var CryptoJS = require('crypto-js')
// var request = require('request')
var rp = require('request-promise')
var querystring = require('querystring')

module.exports = async (ctx) => {
    // 云市场分配的密钥Id
    var secretId = ''
    // 云市场分配的密钥Key
    var secretKey = ''
    var source = 'market'

    var datetime = (new Date()).toGMTString()
    var signStr = 'x-date: ' + datetime + '\n' + 'x-source: ' + source
    var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
    var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"'
    // 请求方法
    var method = 'GET'
    // 请求头
    var headers = {
        'X-Source': source,
        'X-Date': datetime,
        'Authorization': auth
    }
    const {isbn, openid} = ctx.request.body
    console.log('isbn, openid', isbn, openid)
    // 查询参数
    var queryParams = {isbn}
    // body参数（POST方法下）
    var bodyParams = {
    }
    // url参数拼接
    var url = 'https://service-osj3eufj-1255468759.ap-shanghai.apigateway.myqcloud.com/release/isbn'
    if (Object.keys(queryParams).length > 0) {
        url += '?' + querystring.stringify(queryParams)
    }

    var options = {
        url: url,
        timeout: 5000,
        method: method,
        headers: headers
    }
    if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
        options['body'] = querystring.stringify(bodyParams)
        options['headers']['Content-Type'] = 'application/x-www-form-urlencoded'
    }
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
        // 获取豆瓣信息
        let bookinfo = ''
        try {
            const result = await rp(options)
            console.log(result)
            bookinfo = JSON.parse(result).showapi_res_body.data
        } catch (err) {
            console.log(err)
        }

        // const bookinfo = await getJSON(url)
        console.log(`bookinfo:==============>>${bookinfo}`)
        // const rate = bookinfo.rating.average // 评分 此接口不返回 使用一个随机数
        const rate = Math.floor(Math.random() * 10 + 1) // 暂时不处理小数
        const alt = 'alt'
        // const {title, price, author} = bookinfo
        const title = bookinfo.title || 'title'
        const price = bookinfo.price || 99.99
        const author = bookinfo.author || 'zhaos'
        const publisher = bookinfo.publisher || 'zhaos'
        const image = bookinfo.img || 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4069844287,1275964251&fm=26&gp=0.jpg'
        const summary = bookinfo.gist || 'summary'
        // 标签是有多个的
        let tags = ['a', 'b', 'c']
        tags = tags.map(v => {
            return `${v.title} ${v.count}`
        }).join(',')
        // 多个作者
        // const author = bookinfo.author.join(',')
        // 入库
        console.log(isbn, openid, rate, title, image, alt, publisher, summary, price, tags, author)
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

// function getJSON (url) {
//     return new Promise((resolve, reject) => {
//         https.get(url, res => {
//             let urlData = ''
//             res.on('data', data => {
//                 urlData += data
//             })
//             res.on('end', data => {
//                 const bookinfo = JSON.parse(urlData)
//                 console.log(bookinfo)
//                 if (bookinfo.title) {
//                     resolve(bookinfo)
//                 }
//                 reject(bookinfo)
//             })
//         })
//     })
// }
