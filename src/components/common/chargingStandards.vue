<template>
  <div class="repository">
    <img src="../../assets/img/file.jpg" alt="">
    <div class="main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="生产企业会员服务价格" name="first"></el-tab-pane>
      <el-tab-pane label="回收企业服务价格" name="second"></el-tab-pane>
    </el-tabs>
    <div v-for="item in content">
      <p v-html="item.content"></p>
    </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'repository',//知识库
    data() {
      return {
        activeName: 'first',
        content: []
      };
    },
    created() {
      this.getLoadingCompanyTypeList('scqy');
    },
    methods: {
      handleClick(tab) {
        this.activeName = tab.name;
        if (this.activeName == 'first')
          this.getLoadingCompanyTypeList('scqy');
        else if (this.activeName == 'second')
          this.getLoadingCompanyTypeList('hsqy');


      },

      //加载企业类型数据
      getLoadingCompanyTypeList(type) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: type
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.content = res.data.data.hsqy ? res.data.data.hsqy : res.data.data.scqy ? res.data.data.scqy : '';
          }
        });
      },
    }
  };
</script>
<style>
  .repository {
  }
</style>
