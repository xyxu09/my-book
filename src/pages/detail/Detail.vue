<template>
    <div>
      详情页面
    </div>
</template>

<script>
export default {
  components: {

  },
  props: {

  },
  data () {
    return {
      bookid: ''
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.bookid = this.$root.$mp.query.id
    console.log(this.bookid)
    this.getBookDetai()
  },
  methods: {
    // 根据bookid获取详情
    async getBookDetai () {
      const result = await this.$request('/weapp/bookdetail', {id: this.bookid})
      console.log(result)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
