// wx.request 请求函数的简单封装
import config from '../config/index'
export function request (url, data, method, header = {}) {
  wx.showLoading({
    title: 'Loading...', // 提示的内容,
    mask: true // 显示透明蒙层，防止触摸穿透,
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url, // 开发者服务器接口地址",
      data: data, // 请求的参数",
      method: method || 'GET',
      headers: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code === 0) {
          resolve(res)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        wx.hideLoading()
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
}
