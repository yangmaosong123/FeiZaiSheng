<template>
  <div class="price-to-broadcast-title">
    <div class="title">
      <img src="../../../assets/img/index-icon/price.png"/>
    </div>
  </div>
</template>
<script>

  export default {
    name: "priceToBroadcastTitle",//价格播报-标题
  };
</script>

<style lang="less" scoped>
  .price-to-broadcast-title {
  width: 100%;
    .title {
      margin-bottom: 5px;
      // background: red;
      .line {
        margin-left: 30px;
        display: inline-block;
        width: 980px;
        height: 50px;
        background: url(../../../assets/img/line.png);
      }
    }
  }
</style>
