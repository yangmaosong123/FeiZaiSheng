<template>
  <div class="trading-zone">
    <img src="../../../assets/img/index-icon/transaction.png">
    <div class="broadcast clearfix">
      <div class="sell">
        <ul>
          <li v-for="item in busySelling" :key="item.id" class="item-li">
            <div>
              <span style="color:#47bf01;float:left;">[需]</span>
              <span class="item nowrap-trading-zone"
                    @click="handleGoToProductDetail(item)">
                {{item.productTitle}}
              </span>
              <div class="price">
                <span style="color:#f55959;">
                {{!item.price||item.price=='0.00'?'面议':item.price}}
              </span>
                <span style="color:#f55959;"
                      v-show="item.price&&item.price!='0.00'">
                  /{{findConfigItem(item.unit,$store.state.dictionary.unit).title}}
                </span>
              </div>
            </div>
            <div>
              <span style="font-size:13px;color:#b5b5b5;">{{item.enterpriseName}}</span>
              <span @click="handleGoToProductDetail(item)" class="look"> 查看</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="buy">
        <ul>
          <li v-for="item in hotBuy" :key="item.id" class="item-li">
            <div>
              <span style="color:#f08900;float:left;">[供]</span>
              <span class="item nowrap-trading-zone" @click="handleGoToProductDetail(item)">{{item.productTitle}}</span>
              <div class="price">
                <span style="color:#f55959;">
                {{!item.price||item.price=='0.00'?'面议':item.price}}
              </span>
                <span v-show="item.price&&item.price!='0.00'">
                  /{{findConfigItem(item.unit,$store.state.dictionary.unit).title}}
                </span>
              </div>
            </div>
            <div>
              <span style="font-size:13px;color:#b5b5b5;">{{item.enterpriseName}}</span>
              <span @click="handleGoToProductDetail(item)" class="look"> 查看</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "tradingZone",//交易专区
    data() {
      return {
        busySelling: [],//热闹出售
        hotBuy: [],//热闹求购
      };
    },
    created() {
      let _this = this;
      _this.handleGetTradingData(); //获取交易数据
      _this.handleGetHotBuyData(); //热门求购数据
    },
    methods: {

      //获取热门出售数据
      handleGetTradingData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + '/recProduct/list',
          data: {
            difference: '0',//默认传0
            pageIndex: 1,
            pageSize: 5,
            productStatus: 'Y',//发布状态
            publishTime: '0',//发布时间
            tradeType: 'sell',//发布种类
          }
        }).then((res) => {
          if (res.data.status === 200)
            _this.busySelling = res.data.data.list.slice(0, 4);
        });
      },

      //热门求购数据
      handleGetHotBuyData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + '/recProduct/list',
          data: {
            difference: '0',//默认传0
            pageIndex: 1,
            pageSize: 5,
            productStatus: 'Y',//发布状态
            publishTime: '0',//发布时间
            tradeType: 'buy',//发布种类
          }
        }).then((res) => {
          if (res.data.status === 200)
            _this.hotBuy = res.data.data.list.slice(0, 4);
        });
      },

      //跳转到详情页面
      handleGoToProductDetail(item) {
        let _this = this;
        _this.$router.push({
          path: '/sellAndBuyDetail',
          query: {
            id: item.id,
            companyId: item.companyId,
            tradeType: item.tradeType
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .trading-zone {
    float: left;
    margin-left: 15px;
    width: 570px;
    height: 300px;
    background: #fff;
    padding: 15px;
    border-top: 2px solid #2fa2eb;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    .item {
      margin-bottom: 0px !important;
    }
    .title {
      color: #208dd6;
    }
    .broadcast {
      .sell, .buy {
        width: 262px;
        span {
          display: inline-block;
        }
        .item:hover {
          cursor: pointer;
        }
        .price, .look {
          float: right;
        }
        .look {
          color: #fff;
          background: #208dd6;
          padding: 0 12px;
          font-size: 11px;
        }
        .look:hover {
          cursor: pointer;
          background: #389ff9;
        }

        .item-li {
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
        }
      }
      .sell {
        float: left;
        .item:hover {
          color: #f08900;
        }
      }
      .buy {
        float: right;
        margin-left: 16px;
        .item:hover {
          color: #208dd6;
        }
      }
    }
  }
</style>
