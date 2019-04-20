<template>
  <div>
    <!-- <div v-for="book in books" :key="book.id">{{book.title}}</div> -->
    <Card v-for="(item, index) in books" :key="index" :book='item'>
    </Card>
  </div>
</template>

<script>
import Card from '../../components//card'
export default {
  components: {
    Card
  },
  data () {
    return {
      books: []
    }
  },
  mounted () {
    this.getBookList()
  },
  methods: {
    async getBookList () {
      const bookList = await this.$request('/weapp/booklist')
      this.books = bookList.data.data.list
    }
  }
}
</script>

<style scoped lang="scss">
  
</style>
