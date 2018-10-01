<template>
  <div class="common-problem">
    <div class="main">
      <el-row class="content">
        <el-col :span="24">
          <h3>常见问题</h3>
        </el-col>
        <el-col :span="24" class="problem">
          <div class="" v-for="item in issue">
            <h4>{{item.title}}</h4>
            <p v-html="item.content"></p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'commonProblem',//关于我们--常见问题
    data() {
      return {
        issue: {}
      };
    },
    created() {
      this.handleGetIssueData();//获取常见问题数据
    },
    methods: {

      //获取常见问题数据
      handleGetIssueData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/commonProblem",
        }).then((res) => {
          if (res.data.status === 200) {
            _this.issue = res.data.data;
          }
        });
      },
    }
  };
</script>
<style lang="less" scoped>
  .content {
    background: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    h3 {
      margin: 20px 0 0 20px;
      font-size: 24px;
    }
    .problem {
      //  text-align: center;
      padding: 20px;
      h4 {
        font-size: 18px;
        color: #333;
      }
      p {
        color: #666;
      }
    }
  }
</style>
