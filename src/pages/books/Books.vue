<template>
  <div>
    <TopSwiper :tops='tops'></TopSwiper>
    <Card v-for="(item, index) in books" :key="index" :book='item'>
    </Card>
    <p v-if="!more" class="text-primary">没有更多数据</p>
  </div>
</template>

<script>
import Card from '../../components//card'
import TopSwiper from '@/components/TopSwiper'
export default {
  components: {
    Card,
    TopSwiper
  },
  data () {
    return {
      books: [],
      page: 0,
      more: true,
      tops: []
    }
  },
  mounted () {
    this.getBookList(true)
    this.getTop() // 获取轮播图的数据
  },
  methods: {
    // 获取轮播图
    async getTop () {
      const tops = await this.$request('/weapp/top')
      this.tops = tops.data.data.list
    },
    // 获取列表数据
    async getBookList (init) {
      if (init) { // 初始化
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading()
      const bookList = await this.$request('/weapp/booklist', {page: this.page})
      console.log('booklist', bookList)
      // 没有更多的数据
      if (bookList.data.data.list.length < 10 && this.page > 0) {
        this.more = false
      }
      if (init) {
        this.books = bookList.data.data.list
        wx.stopPullDownRefresh()
      } else {
        this.books = this.books.concat(bookList.data.data.list)
      }
      wx.hideNavigationBarLoading()
    }
  },
  onPullDownRefresh () {
    this.getBookList(true)
    this.getTop()
  },
  onReachBottom () {
    if (!this.more) {
      return false
    }
    this.page = this.page + 1
    this.getBookList()
  }
}
</script>

<style scoped lang="scss">
  p {
    padding-bottom: 5px;
    text-align: center;
  }
</style>
