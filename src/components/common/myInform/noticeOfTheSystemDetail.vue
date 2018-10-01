<template>
  <div class="notice-of-the-system-detail">

    <!-- 公共标题 -->
    <CommonTitle title="系通知详情"></CommonTitle>
    <GoBack class="return" ></GoBack>

    <!-- 系通知详情 -->
    <div>
      <h3>{{detail.title}}</h3>
      <div class="notice">{{detail.content}}</div>
    </div>

  </div>
</template>
<script>
  import CommonTitle from '../commonTitle'
  import GoBack from '../goBack'

  export default {
    name: "noticeOfTheSystemDetail",//系通知详情
    data() {
      return {
        detail: {},//系通知详情--数据
      };
    },
    components: {
      CommonTitle,//公共标题
      GoBack,//返回
    },
    created() {
      let _this = this;
      _this.handleGetSystemDetailData(_this.$route.query.id);//获取通知详情数据
    },
    methods: {

      //获取通知详情数据
      handleGetSystemDetailData(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/notice/readlyRead",
          data: {
            id: id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.detail = res.data.data;
              break;
          }
        })
      },
    }
  };
</script>



<style lang="less" scoped>
  .notice-of-the-system-detail {
    .pagination {
      height: 50px;
      padding-top: 10px;
      padding-left: 33%;
    }
    .return{
      float: right;
      margin:20px 20px 0 0 ;
    }
    h3{
      margin:60px 0 0 30px;; 
    }
    .notice{
    margin: 10px 0;
    padding:5px 30px;
    color: #6f6f6f;  
    }
  }
</style>
