import CommentList from '@/components/CommentList';
<template>
  <div class="container">
    <CommentList 
        v-if='userinfo.openId' 
        type='user' 
        :comments="comments">
    </CommentList>
    <div v-if="userinfo.openId">
      <div class="page-title">我的图书</div>
      <Card 
        v-for='book in books' 
        :key='book.id'
        :book='book'>
      </Card>
    </div>
    <div v-if='!books.length'>暂时还没添加过书，快去添加几本把</div>
  </div>
</template>

<script>
import CommentList from '@/components/CommentList.vue'
import Card from '@/components/Card'
export default {
  components: {
    CommentList,
    Card
  },
  data () {
    return {
      comments: [],
      books: [],
      userinfo: {}
    }
  },
  methods: {
    init () {
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    },
    async getBooks () {
      const books = await this.$request('/weapp/booklist', {
        openid: this.userinfo.openId
      })
      this.books = books.data.data.list
    },
    async getComments () {
      const comments = await this.$request('/weapp/commentlist', {
        openid: this.userinfo.openId
      })
      this.comments = comments.data.data.list
    }
  },
  onPullDownRefresh () {
    this.init()
    wx.stopPullDownRefresh()
  },
  onShow () {
    if (!this.userinfo.openId) {
      let userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
        this.init()
      }
    }
  }
}
</script>
<style>


</style>
