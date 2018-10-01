<template>
  <div class="demand">
    <h3>该企业发布过的需求</h3>
    <div v-for="item in demands" :key="item.id">
      <img
        @click="handleLookDetail(item)"
        :src="$store.state.outputImgByIdUrl+item.productFile"
        :alt="item.productFile+'img'">
      <h4 @click="handleLookDetail(item)">{{item.productTitle}}</h4>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'demand',//历史需求
    data() {
      return {
        demands: [], //需求
      };
    },
    created() {
      let _this = this;
      _this.handleGetHavePublishedData(); //该企业发布过的需求
    },
    methods: {

      //该企业发布过的需求
      handleGetHavePublishedData() {
        let _this = this;
        _this
          .$axios({
            method: "post",
            url: "/product/openDemand",
            data: {
              id: _this.$route.query.id,
              companyId: _this.$route.query.companyId
            }
          })
          .then(res => {
            if (res.data.status === 200) _this.demands = res.data.data;
            console.log("_this.detail", _this.detail);
          });
      },

      //查看发布过的商品
      handleLookDetail(item) {
        let _this = this;
        _this.$router.push({
          path: '/wasteDetail',
          query: {
            id: item.id,
            tradeType: item.tradeType,
            companyId: item.companyId
          }
        });
        _this.$emit("handleGetDetailData");
      },
    }
  };
</script>

<style lang="less" scoped>
  .demand {
    margin-top: 20px;
    h3 {
      padding-top: 10px;
      border-top: 1px solid #ccc;
    }
    h4 {
      color: #636363;
    }
    img {
      margin-top: 10px;
      width: 200px;
      height: 120px;
    }
  }
</style>
