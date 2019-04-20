<template>
    <div class="container">
      <div class="userinfo" @click="doLogin">
        <img :src="userinfo.avatarUrl" alt="">
        <p>{{userinfo.nickName}}</p>
        <!-- <p v-if="userinfo.nickName">{{userinfo.nickName}}</p> -->
        <!-- <button 
           v-if="!userinfo.nickName"
           open-type="getUserInfo" 
           lang="zh_CN" 
           bindgetuserinfo="doLogin">获取用户信息
        </button> -->
      </div>
      <YearProgress></YearProgress>
      <button  @click='scanBook' class='btn'>添加图书</button>
    </div>
</template>

<script>
import qcloud from 'wafer2-client-sdk'
import YearProgress from '@/components/YearProgress'
import config from '@/config'
import showSuccess from '@/utils' // 改用vant封装好的
export default {
  props: {

  },
  components: {
    YearProgress
  },
  data () {
    return {
      userinfo: {
        avatarUrl: '../../static/images/unlogin.png',
        nickName: '点击登入'
      }
    }
  },
  methods: {
    doLogin () {
      let user = wx.getStorageSync('userinfo')
      // 不是第一次登入 可以使用token来标识
      // storage中的状态数据 考虑使用store来管理
      // wx.getUserInfo 接口后续将不再出现授权弹窗
      if (user) {
        qcloud.setLoginUrl(config.loginUrl)
        qcloud.loginWithCode({
          success: res => {
            console.log(res)
            this.userInfo = res
            wx.setStorageSync('userinfo', res)
            showSuccess('登录成功')
            // this.Toast.success('登录成功')
          },
          fail: err => {
            console.error(err)
            // this.Toast.fail('登录错误', err.message)
          }
        })
      } else {
        qcloud.setLoginUrl(config.loginUrl)
        qcloud.login({
          success: res => {
            console.log(res)
            this.userInfo = res
            wx.setStorageSync('userinfo', res)
            showSuccess('登录成功')
            // this.Toast.success('登录成功')
          },
          fail: err => {
            console.error(err)
            // this.Toast.fail('登录错误', err.message)
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
