<template>
  <div>
    <img v-if="$route.query.tradingState=='serviceProcess'" src="../../../assets/img/server1.jpg" alt="serviceProcess"
         style="width: 100%; min-width: 1366px;">
    <img v-else-if="$route.query.tradingState=='recycleProcess'" src="../../../assets/img/server2.jpg"
         alt="recycleProcess"
         style="width: 100%; min-width: 1366px;">
    <img v-else-if="$route.query.tradingState=='wasteProcess'" src="../../../assets/img/server3.jpg" alt="wasteProcess"
         style="width: 100%; min-width: 1366px;">
    <img v-else-if="$route.query.tradingState=='serviceProduct'" src="../../../assets/img/server4.jpg"
         alt="serviceProduct"
         style="width: 100%; min-width: 1366px;">
    <img v-else-if="$route.query.tradingState=='chargeStandard'" src="../../../assets/img/server5.jpg"
         alt="chargeStandard"
         style="width: 100%; min-width: 1366px;">
    <div class="icons-detail main">
      <div class="content">
        <h3>{{detail.title}}</h3>
        <div v-html="detail.content" class="text"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'iconsDetail',//流程详情
    data() {
      return {
        type: '',
        detail: {}
        //资讯详情--数据
      };
    },
    created() {
      this.type = this.$route.query.tradingState;
      this.handleGetDetailInfo(this.type); //获取详情信息
    },

    methods: {

      //获取详情信息
      handleGetDetailInfo(type) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/serviceInfoList",
          data: {
            tradingState: type
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.detail = res.data.data;
            console.log("_this.data", _this.data);
          }
        });
      }
    }
  }
  ;
</script>
<style lang="less" scoped>
  .content {
    h3 {
      text-align: center;
      color: #000;
      font-size: 26px;
      margin-top: 20px;
    }
    .text {
      margin-top: 50px;
      color: #666;
      img {
        width: 100%;
      }
    }

  }
</style>
<style lang="less">
  .text {
    p {
      max-width: 1200px;
      img {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 40%;
      }
    }
  }
</style>
