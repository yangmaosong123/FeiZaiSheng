<template>
  <div class="header">
    <div class="container">

      <!--<span class="user display" v-if="account">欢迎用户：{{account}}</span>-->
      <div class="left-nav"><img src="../../assets/img/index-icon/classification.png" alt=""><span>商品分类</span></div>
      <!-- nav导航 -->
      <el-menu :default-active="activeIndex" class="el-menu-demo display" background-color="rgba(255, 255, 255, 1)"
               mode="horizontal" :router="true" text-color="#424242" active-text-color="#208dd6" @select="handleSelect">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/marketCenter">行情中心</el-menu-item>
        <el-menu-item index="/informationRecommendation">资讯推荐</el-menu-item>
        <!--<el-menu-item index="">交易中心</el-menu-item>-->
        <el-menu-item index="/companiesToRecommend">企业推荐</el-menu-item>
        <el-menu-item index="/repository">知识库</el-menu-item>
        <el-submenu index="7">
          <template slot="title">关于我们</template>
          <el-menu-item index="/companyIntroduction">公司介绍</el-menu-item>
          <el-menu-item index="/joinUs">加入我们</el-menu-item>
          <el-menu-item index="/commonProblem">常见问题</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: "/", //默认显示第一个tab
        menuList: "", //菜单数据,
      };
    },
    created: function () {
      this.getLoginAccountInfo();
      this.handleGetMenuList(); //获取menu数据
      if (this.timeOut != "") {
        clearInterval(this.timeOut);
      }
      this.startTimeout();
    },
    mounted() {
      let _this = this;
      _this.activeIndex = sessionStorage.getItem("activeIndex");
    },
    watch: {
      '$store.state.account': function () {
        if (this.$store.state.account != "") {
          this.getLoginAccountInfo();
        }
      },
    },
    computed: {
      timeOut: {
        set(val) {
          this.$store.state.timeout.compileTimeout = val;
        },
        get() {
          return this.$store.state.timeout.compileTimeout;
        }
      },

    },
    methods: {
      startTimeout() {
        var _this = this;
        this.timeOut = setInterval(() => {
          _this.getLoginAccountInfo2();
        }, 1000 * 60);
      },
      //获取menu数据
      getLoginAccountInfo() {
        let _this = this;
        this.$axios({
          method: "post",
          url: "/user/getLoginAccountInfo"
        }).then(function (res) {
          if (res.data.status == 200) {
            _this.$store.state.account = res.data.data.account;
            _this.$store.state.accountObj = res.data.data;
          }
        })
      },
      //获取menu数据
      getLoginAccountInfo2() {
        //判断是否还未登录
        if (this.$store.state.account == "") {
          return;
        }
        let _this = this;
        this.$axios({
          method: "post",
          url: "/user/getLoginAccountInfo"
        }).then(function (res) {
          if (res.data.status == 200) {
            _this.$store.state.account = res.data.data.account;
            _this.$store.state.accountObj = res.data.data;
          } else if (res.data.status == 300) {
            _this.$store.state.account = "";
            _this.$store.state.accountObj = {
              companyId: 0
            };
            _this.$alert('账户已强行登出，请重新登入', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push("/login");
              }
            });
          }
        })
      },

      handleGetMenuList() {
        this.$axios({
          method: "post",
          url: "/menu/get"
        })
          .then(function (res) {
            this.menuList = res.data.data;
            console.log("menuList", this.menuList);
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      //menu事件
      handleSelect(key, keyPath) {
        let _this = this;
        _this.activeIndex = key;
        _this.$store.state.activeIndex = _this.activeIndex;
        sessionStorage.setItem('activeIndex', _this.$store.state.activeIndex)
      },

      handleGoToProcess() {
        let _this = this;
        _this.$router.push({
          path: '/iconsDetail',
          query: {
            tradingState: 'chargeStandard'
          }
        });
      },
    }
  };
</script>

<style>
  .el-menu--horizontal > .el-menu-item {
    height: 50px;
    line-height: 50px;
  }

  .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
</style>

<style lang="less" scoped>
  .header {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    font-size: 16px;
    border-bottom: 1px solid #e1e1e1;
    .container {

      height: 50px;
      width: 1200px;
      margin: 0 auto;
      font-weight: bold;
      .left-nav {
        font-size: 16px;
        float: left;
        width: 220px;
        height: 50px;
        line-height: 50px;
        background: #208dd6;
        color: #fff;
        font-weight: bold;
        img {
          margin-left: 15px;
        }
        span {
          margin-left: 25px;
        }
      }
      .user {
        float: left;
        line-height: 50px;
        font-size: 16px;
      }
      .display {
        display: inline-block;
        height: 50px;
        color: #fff;
        margin-right: 20px;
      }
    }
  }

  .el-menu-item, .el-submenu {
    margin-left: 30px;

  }

  .el-menu--horizontal {
    border: 0px solid #ccc;
  }
</style>
