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
      <button @click='scanBook' class='btn'>添加图书</button>
    </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk'
import YearProgress from '@/components/YearProgress'
import config from '@/config'
export default {
  props: {

  },
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
  methods: {
    doLogin () {
      let user = wx.getStorageSync('userinfo')
      if (!user) {
        qcloud.setLoginUrl(config.loginUrl)
        qcloud.login({
          success: res => {
            qcloud.request({
              url: config.userUrl,
              login: true,
              success (userRes) {
                console.log(userRes)
                wx.setStorageSync('userinfo', userRes.data.data)
                this.userinfo = userRes.data.data
              }
            })
          },
          fail: err => {
            console.error(err)
          }
        })
      }
    },
    async addBook (isbn) {
      console.log('调用豆瓣的api来添加book')
    },
    scanBook () {
      console.log('扫描添加图书')
      wx.scanCode({
        // onlyFromCamera: true, // 只允许通过相机扫码
        success (res) {
          console.log(res)
        }
      })
      this.addBook()
    }
  },
  // 小程序的onShow钩子
  onShow () {
    let userInfo = wx.getStorageSync('userinfo')
    console.log('userInfo', userInfo)
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
