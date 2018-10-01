<template>
  <el-button type="primary" class="go-back" @click="handleClickGoBack">返回</el-button>
</template>
<script>
  export default {
    name: 'goBack',//返回
    methods: {
      handleClickGoBack() {
        let _this = this;
        _this.$router.back(-1);
        _this.$axios({
          method: "post",
          url: "/notice/systemNotification",
          data: {
            notificationFlag: _this.notificationFlag,//通知状态
            currentPage: _this.page.currentPage,//页码
            pageSize: _this.page.pageSize,//页条数
          }
        }).then((res) => {
          switch (res.data.status) {
            case  -500:
              _this.tableData = [];
              break;
            case  200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              let totals = [];
              _this.tableData.map(item => {
                if (item.notificationFlag == '1')
                  totals.push(item);
              });
              Event.$emit("getTotal", totals);
              break;
            case  300:
              _this.tableData = [];
              break;
          }
        });
      }
    }
  };
</script>
