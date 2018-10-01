<template>
  <div class="common-title">
    <div class="title">
      <slot>{{title}}</slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: String,//标题类型
    }
  };
</script>
<style lang="less" scoped>
  .common-title {
    background: #fff;
    border-bottom: 1px solid #ebeef5;
    .title {
      margin: 0 0 4px 10px;
      height: 60px;
      line-height: 60px;
      font-weight: bold;
    }
  }
</style>
