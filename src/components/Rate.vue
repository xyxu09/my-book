<template>
  <div class='rate'>
    <span>☆☆☆☆☆</span>
    <div class="hollow" :style='style'>
      ★★★★★
    </div>
    
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    // 重写宽度 来覆盖下面的☆
    style () {
      return `width:${this.value / 2}em`
    }
  }
}
</script>
<style lang='scss'>
.rate{
  position: relative;
  display: inline-block;
  .hollow{
    position: absolute;
    display: inline-block;
    top:0;
    left:0;
    width:0;
    overflow:hidden;
  }
}
</style>
