<template>
  <div class="market-center-details">
    <div class="main">
      <div class="content">
        <h3>{{detail.title}}</h3>
        <p>发布日期：{{detail.createDate}}</p>
        <div v-html="detail.content" class="text"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'marketCenterDetails',//行情详情
    data() {
      return {
        detail: {}
        //资讯详情--数据
      };
    },
    created() {
      this.handleGetDetailInfo(); //获取详情信息
    },

    methods: {

      //获取详情信息
      handleGetDetailInfo() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/infoListDetail",
          data: {
            id: _this.$route.query.id
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.detail = res.data.data;
            console.log("_this.data", _this.data);
          }
        });
      },
      //查看详情
      handleLookDetail(id) {
        let _this = this;
        _this.$router.push({
          path: 'marketCenterDetails',
          query: {
            id: id
          }
        });
      }
    }
  }
  ;
</script>
<style lang="less" scoped>
  .market-center-details {

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
      img{
       width: 150px;
       height: 120px;
        }
      }

      .text {
        margin-top: 50px;
        color: #666;
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
