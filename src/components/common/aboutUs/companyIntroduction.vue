<template>
  <div class="company-introduction">
    <img src="../../../assets/img/introduction.jpg" alt="" style="width: 100%; min-width: 1366px;">
    <div class="main">
      <el-row class="content">
        <el-col :span="24">
          <h3>公司简介</h3>
        </el-col>
        <el-col :span="24">
          <div>
            <el-col :span="16">
              <h4>{{company.title}}</h4>
              <p v-html="company.content"></p>
            </el-col>
            <el-col :span="4" class="picture">
              <img src="../../../assets/img/company.jpg" alt="">
              <!--<img-->
              <!--:src="$store.state.outputImgUrl+item.id+'&COMPANY_LOGO_IMG=prod_img'"-->
              <!--:alt="current.id">-->
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'companyIntroduction',//关于我们--公司介绍
    data() {
      return {
        company: {}
      };
    },
    created() {
      this.handleGetCompanyData();//获取公司简介数据
    },
    methods: {

      //获取公司简介数据
      handleGetCompanyData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/companyIntroduction",
        }).then((res) => {
          if (res.data.status === 200) {
            _this.company = res.data.data;
            console.log(" _this.company", _this.company);
          }
        });
      },
    }
  };
</script>

<style lang="less" scoped>
  .content {
    h3{
    text-align: center;
    color: #208dd6;
     font-size: 22px; 
     margin-top: 20px;
    }
    h4{
     font-size: 20px;
     margin-top: 20px; 
    }
    img{
      margin-top: 45px;
      margin-left: 20px;
      width: 400px;
      height: 300px;
    }
    p{
      color:#666;
    }
    .picture{
      margin-top: 60px;
      
    }
  }
</style>
