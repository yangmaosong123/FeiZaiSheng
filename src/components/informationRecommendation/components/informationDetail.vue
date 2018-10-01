<template>
  <div class="information-detail">
    <img src="../../../assets/img/news.jpg" alt="" style="width: 100%; min-width: 1366px;">
    <div class="main">
      <div class="content">
        <h2>{{detail.moduleCode=='info'?'资讯':detail.moduleCode=='notice'?'公告':''}}</h2>
        <h3>{{detail.title}}</h3>
        <p>发布日期：{{detail.createDate}}</p>
        <pre class="white-space" v-html="detail.content"></pre>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'informationDetail',//资讯详情
    data() {
      return {
        detail: {}
        //资讯详情--数据
      };
    },
    created() {
      this.handleGetDetailInfo(this.$route.query.id); //获取详情信息
    },

    methods: {

      //获取详情信息
      handleGetDetailInfo(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/infoListDetail",
          data: {
            id: id
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
    p {
      text-align: center;
    }
    h4 {
      font-size: 20px;
      margin-top: 20px;
      border-bottom: 1px solid #e1e1e1;
      span {
        padding: 5px 0 5px 0px;
        border-bottom: 1px solid #208dd6;
      }
    }

    .text {
      margin-top: 50px;
      color: #666;
    }

  }
</style>


