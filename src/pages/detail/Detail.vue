<template>
    <div>
      <BookInfo :info='info'></BookInfo>
      <CommentList :comments='comments'></CommentList>

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
      bookid: '',
      info: {},
      comments: [],
      comment: '',
      location: '',
      phone: ''
    }
  },
  mounted () {
    this.bookid = this.$root.$mp.query.id
    console.log(this.bookid)
    this.getBookDetai()
    this.getComments()
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
    }
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
