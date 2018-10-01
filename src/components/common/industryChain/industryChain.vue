<template>
  <div class="industryChain">
    <div class="main">
      <div class="aptitude" v-show="$route.query.type=='智能'">
        <img src="../../../assets/img/zhi-neng-1.jpg"
             alt="zhi-neng-1.jpg">

      </div>
      <div class="logistics" v-show="$route.query.type=='物流'">
        <img
          src="../../../assets/img/zhi-neng-2.jpg"
          alt="zhi-neng-2.jpg">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'industryChain',//全产业链
  };
</script>
<style lang="less" scoped>
  .industryChain {
    .main {
      .aptitude,
      .logistics {
        img {
          display: block;
          margin: 50px auto;
        }
      }
    }
  }
</style>
