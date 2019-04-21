<template>
    <div>
      <BookInfo :info='info'></BookInfo>
      <CommentList :comments='comments'></CommentList>
      <div class="comment" v-if="showAdd">
        <textarea 
          v-model="comment"
          class="textarea"
          :maxlength="100"
          placeholder="请输入图书短评"
        ></textarea>
        <div class="location">
          地理位置:
          <switch
            color='#EA5A49'
            :checked='location'
            @change="getGeo"
            />
          <span class='text-primary'>{{location}}</span>
        </div>
        <div class="phone">
          手机型号:
          <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
          <span class='text-primary'>{{phone}}</span>
        </div>
        <button class="btn" @click="addComment">评论</button>
      </div>
      <div v-else class="text-footer">
        您还没有登入或者已经评论过了
      </div>
      <!-- 分享的可以考虑使用canvas绘图之后分享 加入小程序码 定位在页面的最下面-->
      <button open-type='share' class="btn">转发给好友</button>
    </div>
</template>

<script>
import BookInfo from './component/BookInfo.vue'
import CommentList from '@/components/CommentList.vue'
export default {
  components: {
    BookInfo,
    CommentList
  },
  data () {
    return {
      userinfo: {},
      bookid: '',
      info: {},
      comments: [],
      comment: '',
      location: '',
      phone: ''
    }
  },
  computed: {
    // 判断是否显示新增评论
    showAdd () {
      if (!this.userinfo.openId) {
        return false // 没有登入的用户
      }
      if (this.comments.filter(v => v.openid === this.userinfo.openId).length) {
        return false // 已经评论过的 不显示 可以使用find
      }
      return true
    }
  },
  mounted () {
    this.bookid = this.$root.$mp.query.id
    console.log(this.bookid)
    this.getBookDetai()
    this.getComments()
    const userinfo = wx.getStorageSync('userinfo')
    console.log('userinfo', userinfo)
    if (userinfo) {
      this.userinfo = userinfo
    }
  },
  methods: {
    // 根据bookid获取详情
    async getBookDetai () {
      const result = await this.$request('/weapp/bookdetail', {id: this.bookid})
      console.log('result', result)
      this.info = result.data.data
      wx.setNavigationBarTitle({
        title: this.info.title
      })
    },
    // 获取评论列表
    async getComments () {
      const comments = await this.$request('/weapp/commentlist', {bookid: this.bookid})
      console.log('comments', comments)
      this.comments = comments.data.data.list || []
    },
    // 获取地理位置
    getGeo (e) {
      const ak = 'FnQba1MbqdbySoHxBBKL1XDSf6HWlbh4'
      let url = 'http://api.map.baidu.com/geocoder/v2/'
      if (e.target.value) {
        wx.getLocation({
          type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
          success: res => {
            wx.request({
              url,
              data: {
                ak,
                location: `${res.latitude},${res.longitude}`,
                output: 'json'
              },
              success: data => {
                console.log('百度api获取的地理信息', data)
                if (data.data.status === 0) {
                  this.location = data.data.result.addressComponent.city
                } else {
                  this.location = '未知地点'
                }
              }
            })
          },
          fail: () => {
            console.log('getLocation failed')
          }
        })
      }
    },
    // 获取手机型号
    getPhone (e) {
      if (e.target.value) {
        const phoneInfo = wx.getSystemInfoSync()
        this.phone = phoneInfo.model
      } else {
        this.phone = ''
      }
    },
    // 新增评论
    async addComment () {
      // 模拟器上出现bug
      this.comment = this.comment || 'test'
      if (!this.comment) {
        console.log('没有评论是不能提交的')
        return
      }
      const data = {
        openid: this.userinfo.openId,
        bookid: this.bookid,
        comment: this.comment,
        phone: this.phone,
        location: this.location
      }
      try {
        await this.$request('/weapp/addcomment', data, 'POST')
        this.comment = ''
        this.getComments()
      } catch (e) {
        console.log(e)
      }
    }
  },
  onShareAppMessage  () {
    console.log('分享')
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  }
}
</script>

<style scoped lang="scss">
.comment{
  margin-top:10px;
  .textarea{
    width:730rpx;
    height:200rpx;
    background:#eee;
    padding:10rpx;
  }
  .location{
    margin-top:10px;
    padding:5px 10px;
  }
  .phone{
    margin-top:10px;
    padding:5px 10px;
    
  }
}
</style>
