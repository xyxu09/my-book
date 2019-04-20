<template>
  <div class="book-card">
    <div class="thumb" @click.stop='preview'>
      <img :src="book.image" class="img" mode="aspectFix">
    </div>
    <div class="detail">
      <div class="row text-primary">
        <div class="right">
          {{book.rate}} <van-rate v-model="book.rate" allow-half readonly size='10' style="display: inline-block"/>
        </div>
        <div class="left">
          {{book.title}}
        </div>
      </div>
      <div class="row">
        <div class="right text-primary">
          浏览量:{{book.count}}
        </div>
        <div class="left">{{book.author}}</div>
      </div>
      <div class="row">
        <div class="right">
           {{book.user_info.nickName}}
        </div>
        <div class="left">
         {{book.publisher}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    book: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang='scss' scoped>
.book-card{
  padding:5px;
  overflow: hidden;
  margin-top:5px;
  margin-bottom:5px;
  font-size:14px;
  .thumb{
    width:90px;
    height:90px;
    float: left;
    margin:0 auto;
    overflow:hidden;
    .img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .detail{
    margin-left: 100px;
    .row{
      line-height:20px;
      margin-bottom:3px;
    }
    .right{
      float: right;
    }
    .left{
      margin-right:80px;
    }
  }
  
}
</style>
