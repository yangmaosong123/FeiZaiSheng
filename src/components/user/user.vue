<template>
  <div class="main">
    <div class="user clearfix">
      <div class="leftList fl">
        <h3 class="user-title">
          用户中心</h3>
        <el-menu
          :default-active="activeIndex"
          background-color="#fff"
          text-color="#383838"
          active-text-color="#ffd04b"
          @select="handleSelect"
          class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <router-link to="/user/noticeOfTheSystem">
              <el-badge :value="total" class="item tips">系统消息</el-badge>
            </router-link>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <span>企业资料</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <router-link to="/user/basicMsg">基本信息</router-link>
              </el-menu-item>
              <el-menu-item index="2-2">
                <router-link to="/user/detailedMsg">企业信息</router-link>
              </el-menu-item>
              <el-menu-item index="2-3">
                <router-link to="/user/addressMessage">地址信息</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3"
                      v-show="$store.state.enterpriseTypeStatus=='cf'||$store.state.enterpriseTypeStatus=='cz'">
            <template slot="title">
              <span v-show="$store.state.enterpriseTypeStatus=='cf'">产废企业</span>
              <span v-show="$store.state.enterpriseTypeStatus=='cz'">处置企业</span>
            </template>
            <el-menu-item-group v-show="$store.state.enterpriseTypeStatus=='cf'">
              <el-menu-item index="3-1">
                <router-link to="/user/orderCommonAttack">订单处理</router-link>
              </el-menu-item>
              <el-menu-item index="3-2">
                <router-link to="/user/wasteList">商品管理</router-link>
              </el-menu-item>
              <el-menu-item index="3-3">
                <router-link to="/user/theOfferSystemRecommended">报价管理</router-link>
              </el-menu-item>
              <el-menu-item index="3-4">
                <router-link to="/user/contractDisposalOfEnterprise">合同管理</router-link>
              </el-menu-item>
              <el-menu-item index="3-5">
                <router-link to="/user/wasteTransactionDetail">交易明细</router-link>
              </el-menu-item>
              <el-menu-item index="3-6">
                <router-link to="/user/viewDisposalResults">处置结果</router-link>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group v-show="$store.state.enterpriseTypeStatus=='cz'">
              <el-menu-item index="3-1">
                <router-link to="/user/theSystemRecommended">系统推荐</router-link>
              </el-menu-item>
              <el-menu-item index="3-3">
                <router-link to="/user/orderProcessing">订单处理</router-link>
              </el-menu-item>
              <el-menu-item index="3-4">
                <router-link to="/user/contractWasteProductionEnterprise">合同管理</router-link>
              </el-menu-item>
              <el-menu-item index="3-5">
                <router-link to="/user/disposalTransactionDetail">交易明细</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu
            v-show="$store.state.enterpriseTypeStatus=='cf'||$store.state.enterpriseTypeStatus=='cz'||$store.state.enterpriseTypeStatus=='hs'"
            index="4">
            <template slot="title">
              <span>回收管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <router-link to="/user/recycleOrder">回收订单推荐</router-link>
              </el-menu-item>
              <el-menu-item index="4-2">
                <router-link to="/user/commodityList">回收商品管理</router-link>
              </el-menu-item>
              <el-menu-item index="4-3">
                <router-link to="/user/myTrading">回收订单处理</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><span>我的收藏</span></template>
            <el-menu-item-group>
              <el-menu-item index="5-1">
                <router-link to="/user/enterpriseCollection">企业收藏</router-link>
              </el-menu-item>
              <el-menu-item index="5-2">
                <router-link to="/user/dealCollection">商品收藏</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <span>合作伙伴</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="6-1">
                <router-link to="/user/partner">合作伙伴</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="rightContent fr">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script>
  import Event from '../../assets/js/event'

  export default {
    data() {
      return {
        activeIndex: "",
        total: "",//通知总数
      };
    },
    methods: {
      handleSelect(key, keyPath, e) {
        if (e.index === key) e.itemStyle.color = "red";
      },
    },
    created() {
      let _this = this;

      Event.$on("getTotal", (totals) => {
        if (totals.length >= 1)
          _this.total = totals.length;
        else
          _this.total = ""
      });

      _this.$axios({
        method: "post",
        url: "/company/registerInfo"
      }).then(res => {
        switch (res.data.status) {
          case 200:
            _this.$store.state.enterpriseTypeStatus = res.data.data.enterpriseTypeStatus;
        }
      });

      _this.$axios({
        method: "post",
        url: "/notice/systemNotification",
        data: {
          notificationFlag: '1',//通知状态
          currentPage: 1,//页码
          pageSize: 10,//页条数
        }
      }).then((res) => {
        switch (res.data.status) {
          case  200:

            let totals = [];
            res.data.data.list.map(item => {
              if (item.notificationFlag == '1')
                totals.push(item);
            });
            _this.total = totals.length >= 1 ? totals.length : '';
            break;
        }
      });

    },

  };
</script>

<style lang="less" scoped>
  .el-menu {
    border: none !important;
  }

  .el-menu-item {
    padding: 0 !important;
    min-width: 100px !important;
    a {
      display: block !important;
      text-align: center !important;
    }
  }

  .el-menu-item.is-active {
    background-color: #208dd6 !important;
    a {
      color: #f3f3f3;
    }
  }

  .leftList {
    width: 15%;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    .user-title {
      background: #fff;
      text-align: center;
      padding: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f3f3f3;
    }
    span {
      color: #565656;
      margin-left: 20px;
      font-size: 15px;
      font-weight: bold;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

  }

  .rightContent {
    background-color: #fff;
    width: 84%;
    // border: 1px solid #666;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
  }

  .background {
    background: #000;
  }


</style>
<style>
  .el-badge__content.is-fixed {
    position: absolute !important;
    top: 28px !important;
    right: -10px !important;
  }
</style>




