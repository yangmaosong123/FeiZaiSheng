<template>
  <div class="trading-center">
    <div class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs" :key="item.value"></el-tab-pane>
      </el-tabs>

      <!--交易数据-->
      <el-table class="order-table"
                :data="tradingTableData"
                default-expand-all
                style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-row id="content">
              <el-col :span="5">
                <div>
                  <img
                    :src="$store.state.outputImgUrl+scope.row.id+'&bizObjName=upload_img'"
                    :alt="'img'+scope.row.id">
                </div>
              </el-col>
              <el-col :span="14" class="Detailsbar">
                <div>
                  <h3 class="title" @click="handleGoToRowInformationDetail(scope.row.id)">
                    {{scope.row.productTitle}}</h3>
                  <p>供应商：{{scope.row.enterpriseName}}</p>
                  <p>供货地：{{scope.row.province+scope.row.city+scope.row.region}}</p>
                  <p class="Detailed">商品清单</p>
                  <p>
                    <span>{{findConfigItem(scope.row.subCategory,$store.state.dictionary.zycp).title}}</span>
                    <span>{{scope.row.quantity}}/{{scope.row.unit}}</span>
                  </p>
                  <p class="Totalprice">￥{{(scope.row.price*scope.row.quantity).toFixed(2)}}</p>
                </div>
              </el-col>
              <el-col :span="4" class="operation">
                <!--<span class="Bond">保证金：{{}}</span>-->
                <span class="state" v-show="activeName=='first'">已成交</span>
                <el-button class="purchase" v-show="activeName=='second'" @click="handleGoToProductDetail(scope.row)">
                  我要购买
                </el-button>
                <el-button class="Sell" v-show="activeName=='three'">我要出售</el-button>
                <el-button class="Collection" type="primary" @click="handleProductEnterprise(scope.row.id)">收藏商品
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column></el-table-column> -->
      </el-table>

    </div>
  </div>
</template>
<script>
  export default {
    name: '',//交易中心
    data() {
      return {
        activeName: 'first',
        tradingTableData: [],//资讯--数据
        newResData: [],
        tabs: [
          {
            label: '交易公示',
            value: 'first'
          },
          {
            label: '在线交易',
            value: 'second'
          },
          {
            label: '热门求购',
            value: 'three'
          },]
      };
    },
    created() {
      this.handleGetInformationTableData();  //获取交易数据
    },
    methods: {

      //获取交易数据
      handleGetInformationTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/tradingCenter",
          data: {
            tradingState: _this.activeName
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.tradingTableData = res.data.data;
              break;
            case 300:
              _this.tradingTableData = [];
              break;
          }
        });
      },


      //tab切换
      handleClick(tab, event) {
        console.log(tab, event);
        let _this = this;
        _this.activeName = tab.name;
        _this.$router.push({
          query: {
            type: tab.label
          },
        });
        _this.handleGetInformationTableData();
      },

      //收藏商品
      handleProductEnterprise(id) {
        let _this = this;
        _this.$confirm('确定收藏该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/productCollection",
            data: {
              id: id,//当前企业id
              otherId: '1'
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: 'success',
                  message: '成功收藏该商品!'
                });
                _this.handleGetInformationTableData(); //获取详情数据
                break;
            }
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消收藏'
          });
        });
      },

      //我要购买
      handleGoToProductDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/sellAndBuyDetail',
          query: {
            id: row.id,
            tradeType: row.tradeType,
            companyId: row.companyId
          }
        });
      }
    }
  };
</script>

<style>
  .order-table .el-table th {
    background: rgba(242, 242, 242, 1);
  }

  .order-table .el-table__expanded-cell {
    background: #ffffff;
    font-size: 12px;
    padding: 0px;
  }

  .el-col {
    padding: 0px;
  }
</style>

<style lang="less" scoped>
  #content {
    border: 1px solid #ddd;
    .Detailsbar {
      height: 220px;
      border-right: 1px solid #ddd;
    }
    img {
      width: 220px;
      height: 220px;
    }
    p {
      margin: 5px 0 0 0;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .Detailed {
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .Totalprice {
      font-size: 22px;
      color: #f77211;
      font-weight: bold;
      margin: 10px 10px 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .operation {
      margin-top: 75px;
      width: 240px;
      text-align: center;
      .Bond {
        display: block;
        font-size: 18px;
        color: #f77211;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .purchase {
        display: block;
        width: 100px;
        height: 30px;
        line-height: 0.5;
        color: #ffffff;
        background: #208dd6;
        margin-left: 30%;

      }
      .state {
        font-size: 16px;
        font-weight: bold;
      }
      .Sell {
        display: block;
        width: 100px;
        height: 30px;
        line-height: 0.5;
        color: #ffffff;
        background: #208dd6;
        margin-left: 30%;
      }
      .Collection {
        display: block;
        width: 100px;
        height: 30px;
        line-height: 0.5;
        background: #208dd6;
        margin-top: 10px;
        margin-left: 30%;
      }

    }
  }
</style>
