<template>
  <div class="progressbar"> 
    <!-- <van-progress
      :percentage="75"
      pivot-color="#7232dd"
      color="linear-gradient(to right, #be99ff, #7232dd)"
    /> -->
    <progress :percent='percent' activeColor='#EA5A49' show-info />
    <p>{{year}}年已经过了{{days}}天,目标实现了吗?</p>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
    }
  },
  computed: {
    year () {
      return new Date().getFullYear()
    },
    days () {
      let start = new Date()
      start.setMonth(0)
      start.setDate(1)
      let offset = new Date().getTime() - start.getTime()
      return parseInt(offset / 1000 / 60 / 60 / 24) + 1
    },
    percent () {
      return (this.days * 100 / this.getDaysOfYear()).toFixed(1)
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    isLeapYear () {
      const year = new Date().getFullYear()
      if (year % 400 === 0) {
        return true
      } else if (year % 4 === 0 && year % 100 !== 0) {
        return true
      } else {
        return false
      }
    },
    getDaysOfYear () {
      return this.isLeapYear ? 366 : 365
    }
  }
}
</script>

<style scoped lang="scss">
.progressbar{
  text-align: center;
  margin-top:10px;
  margin-bottom:40px;
  width:100%;
  progress{
    margin-bottom: 10px;
  }
}
</style>
