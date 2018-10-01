<template>
  <div class="advertising-position-top">
    <a :href="advertising.extField" target="_blank">
      <img v-if="!advertising.extField2" src="../../../assets/img/advertising.jpg">
      <img
        v-else
        style="width:1200px;height:120px;"
        :src="$store.state.outputImgByIdUrl+advertising.extField2"
        :alt="'img'+advertising.extField2">
    </a>
  </div>
</template>
<script>

  export default {
    name: "advertisingPositionTop",//广告位
    data() {
      return {
        advertising: {},//广告图片
      };
    },
    created() {
      let _this = this;
      _this.getCarousel();
    },

    methods: {

      //初始化轮播图数据
      getCarousel() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/advertisment"
        }).then((res) => {
          res.data.data.map(item => {
            if (item.itemCode == "home1") _this.advertising = item;
          });
        });
      },
    }
  };
</script>
<style lang="less" scoped>
  .advertising-position-top {
    margin-top: 20px;
    a {
      img {
        display: block;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
