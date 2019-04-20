<template>
    <div class="container">
      <div class="userinfo">
        <img :src="userInfo.avatarUrl" alt="">
        <p v-if="userInfo.nickName">{{userInfo.nickName}}</p>
        <button 
           v-if="!userInfo.nickName"
           open-type="getUserInfo" 
           lang="zh_CN" 
           @getuserinfo="doLogin">获取用户信息
        </button>
      </div>
      <YearProgress></YearProgress>
      <button @click='scanBook' class='btn' v-if="userInfo.nickName">添加图书</button>
    </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk'
import YearProgress from '@/components/YearProgress'
import config from '@/config'
// import showModal from '../../utils/index'
export default {
  components: {
    YearProgress
  },
  data () {
    return {
      userInfo: {
        avatarUrl: '../../static/images/unlogin.png',
        nickName: ''
      }
    }
  },
  // created () {
  //   // 获取用户信息 判断是否已经授权
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权 不需要弹窗
  //         wx.getUserInfo({
  //           withCredentials: false, // 是否带上登入信息
  //           success: res => {
  //             // 必须在授权过的情况下调用该接口
  //             this.userInfo = res.userInfo
  //             wx.setStorageSync('userinfo', res.userInfo)
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  methods: {
    doLogin () {
      let user = wx.getStorageSync('userinfo')
      if (!user) {
        wx.showLoading({
          title: 'Loading...', // 提示的内容,
          mask: true
        })
        // wx.login({
        //   success: res => {
        //     const code = res.code
        //     if (code) {
        //       console.log(code)
        //       // 向后台发送请求
        //       const url = '/weapp/myLogin'
        //       const data = { code }
        //       this.$request(url, data)
        //         .then(res => {
        //           console.log(res)
        //         })
        //     } else {
        //       console.log('登入失败')
        //     }
        //   }
        // })
        qcloud.setLoginUrl(config.loginUrl)
        qcloud.login({
          success: res => {
            qcloud.request({
              url: config.userUrl,
              login: true,
              success: (userRes) => {
                console.log(userRes)
                wx.hideLoading()
                this.userInfo = userRes.data.data
                wx.setStorageSync('userinfo', userRes.data.data)
              }
            })
          },
          fail: err => {
            wx.hideLoading()
            console.error(err)
          }
        })
      }
    },
    async addBook (isbn) {
      try {
        const res = await this.$request('/weapp/addbook', {
          isbn,
          openid: this.userInfo.openId
        }, 'POST')
        console.log('addbook', res)
        if (res.data.code === 0) {
          wx.showModal({
            title: '添加成功',
            content: `${res.data.data.title}添加成功`
          })
        } else {
        // 这里的信息最好是后台返回的
          wx.showModal({
            title: '添加失败', // 提示的标题,
            content: '已经存在相同的书籍'
          })
        }
      } catch (err) {
        wx.showModal({
          title: '添加失败', // 提示的标题,
          content: '已经存在相同的书籍'
        })
      }
    },
    scanBook () {
      wx.scanCode({
        // onlyFromCamera: true, // 只允许通过相机扫码
        success: (res) => {
          if (res.result) {
            this.addBook(res.result)
          }
        }
      })
    }
  },
  // 小程序的onShow钩子
  onShow () {
    let userInfo = wx.getStorageSync('userinfo')
    if (userInfo) {
      this.userInfo = userInfo
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 0 30rpx;  
  .userinfo{
    margin-top:100rpx;
    text-align:center;
    img{
      width: 150rpx;
      height:150rpx;
      margin: 20rpx;
      border-radius: 50%;
    }
  }
}
</style>
