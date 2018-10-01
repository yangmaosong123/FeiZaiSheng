<template>
  <div class="sell-and-buy-detail main">
    <div class="container">
      <CommonTitle
        :title="this.$route.query.tradeType=='buy'?'求购详情':
      this.$route.query.tradeType=='sell'?'出售详情':''"></CommonTitle>

      <section>
        <el-row>
          <el-col :span="5" class="enterprise">
            <!-- <h3>搜索栏目</h3> -->
            <div>
              <img
                :src="$store.state.outputImgByIdUrl+detail.unitLogoAttId"
                :alt="detail.unitLogoAttId+'img'">
              <h4>{{detail.enterpriseName}}</h4>
              <p>企业信誉:优</p>
              <div class="collection">
                <el-button type="primary" v-show="showRemarkCompanyBtn" @click="handleCollectionEnterprise">收藏企业
                </el-button>
                <el-button type="primary" v-show="showRemarkGoodsBtn" @click="handleProductEnterprise(detail.id)">收藏商品
                </el-button>
              </div>
              <el-button class="click" type="primary" @click="handleGoToCompaniesToRecommend(detail)">进入企业
              </el-button>
            </div>
          </el-col>
          <el-col :span="18" class="commodity">
            <el-col :span="11">
              <div>
                <BabyByCarousel :smallImages="smallImages"
                                :contentBoxDiv="contentBoxDiv"
                                :bigImgStyle="bigImgStyle"
                                :smallImgStyle="smallImgStyle"></BabyByCarousel> <!--宝贝轮播图 -->
              </div>
            </el-col>
            <el-col :span="12">
              <div class="introduce">
                <h2>[{{detail.tradeType=='sell'?'出售':detail.tradeType=='buy'?'求购':''}}] {{detail.productTitle}}</h2>
                <p>
                  交易种类：{{findConfigItem(detail.source,$store.state.dictionary.hsly).title}}/
                  {{findConfigItem(detail.category,$store.state.dictionary.hszl).title}}/
                  {{findConfigItem(detail.subCategory,$store.state.dictionary.hslb).title}}
                </p>
                <p>发布日期：{{dateToStrMinue(detail.creationTime)}}</p>

                <p>数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：{{detail.quantity}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}
                  <span>&nbsp;&nbsp;({{calTradeQuantity}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}})

                 </span>
                </p>
                <p>
                  物&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流：{{detail.logisticsIncluded=='Y'?'卖家送货上门':detail.logisticsIncluded=='N'?'买家上门取货':''}}</p>
                <div class="describe">
                  <p class="price">
                    价格：{{!detail.price||detail.price=='0'?'价格面议':'￥'+detail.price+'/'+findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
                </div>
                <el-button
                  v-show="showSellBtn"
                  @click="handleShowMySell(detail.minTradeQuantity)">我要出售
                </el-button>
                <el-button
                  v-show="showBuyBtn"
                  @click="handleShowMyBuy(detail.minTradeQuantity)">我要购买
                </el-button>
              </div>
            </el-col>
          </el-col>
        </el-row>
      </section>
      <section>
        <el-row>
          <el-col :span="5" class="information">
            <div class="about">
              <h3>相关资讯</h3>
              <ul>
                <li v-for="item in lastUpdates" @click="handleGoToNotice(item.id)" :key="item.id"><a
                  href="#">{{'• '+item.title}}</a></li>
              </ul>
            </div>
            <div class="demand">
              <h3>该企业发布过的需求</h3>
              <div v-for="item in demands" :key="item.id" @click="gotoGoodsDetailPage(item)">
                <img
                  :src="$store.state.outputImgByIdUrl+item.productFile"
                  :alt="item.productFile+'img'">
                <h4>{{item.productTitle}}</h4>
              </div>
            </div>
          </el-col>
          <el-col :span="18" class="details">
            <div class="transaction">
              <h3>交易信息</h3>
              <el-row>
                <el-col :span="10">
                  <p>交易类型：<span>{{detail.tradeType=='sell'?'出售':detail.tradeType=='buy'?'求购':''}}</span></p>
                  <p>发布日期：{{dateToStrMinue(detail.creationTime)}}</p>
                  <p>行业种类：{{findConfigItem(detail.source,$store.state.dictionary.hsly).title}}/
                    {{findConfigItem(detail.category,$store.state.dictionary.hszl).title}}/
                    {{findConfigItem(detail.subCategory,$store.state.dictionary.hslb).title}}</p>
                  <p>发布数量：{{detail.quantity}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
                </el-col>
                <el-col :span="12">
                  <p>发布时效：{{findConfigItem(detail.deadline,$store.state.dictionary.cxsj).title}}</p>
                  <p>详细地址：{{ makeAddr(detail.province,detail.city,detail.region)}}{{detail.address}}</p>
                  <p>物流承运：{{detail.logisticsIncluded=='Y'?'卖家送货上门':detail.logisticsIncluded=='N'?'买家上门取货':''}}</p>
                  <p>
                    最小成交：{{detail.minTradeQuantity}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
                </el-col>
              </el-row>
            </div>

            <div class="product">
              <h3>产品介绍</h3>
              <p>{{detail.remark}}</p>
              <ul>
                <li v-for="item in detail.uploadTradeAttId" :key="item">
                  <img
                    :src="$store.state.outputImgByIdUrl+item"
                    :alt="item+'img'">
                </li>
              </ul>
            </div>

            <div class="contact">
              <h3>联系信息</h3>
              <p>联系人：{{detail.contacts}}</p>
              <p>联系电话：{{detail.phone}}</p>
              <p>所在地区： {{ makeAddr(detail.province,detail.city,detail.region)}}</p>
              <p>详细地址：{{detail. address}}</p>
            </div>

          </el-col>
        </el-row>
      </section>
    </div>

    <!-- 我要购买 -->
    <el-dialog
      title="我要购买"
      :visible.sync="buyDialogVisible"
      width="30%" @open='openBuyWin'>
      <el-form class="demo-ruleForm" :rules="buyFormRules" ref="buyForm" :model="buyForm" label-width="100px">
        <el-form-item label="数量" prop="tradeQuantity">
          <el-input-number v-model="buyForm.tradeQuantity" :min="minTradeQuantity"
                           :max="buyForm.maxTradeQuantity"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="buyDialogVisible = false">取 消</el-button>
       <el-button type="primary" :disabled="buyBtn" @click="handleSubmitBuy('buyForm')">确 定</el-button>
     </span>
    </el-dialog>

    <!-- 我要出售 -->
    <el-dialog
      title="我要出售"
      :visible.sync="sellDialogVisible"
      width="30%" @close='openSellWin'>
      <el-form class="demo-ruleForm" :rules="sellFormRules" ref="sellForm" :model="sellForm" label-width="100px">
        <el-form-item label="数量" prop="tradeQuantity">
          <el-input-number v-model="sellForm.tradeQuantity" :min="minTradeQuantity" :max="buyForm.maxTradeQuantity"
                           @change='chgSellQuantity'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="sellDialogVisible = false">取 消</el-button>
       <el-button type="primary" :disabled="sellBtn" @click="handleSubmitSell('sellForm')">确 定</el-button>
     </span>
    </el-dialog>

  </div>
</template>
<script>
  import CommonTitle from "../../common/commonTitle";
  import BabyByCarousel from "../../common/carousel/babyByCarousel.vue";

  export default {
    name: "sellAndBuyDetail", //出售求购详情
    data() {
      let checkBuy = (rule, value, callback) => {
        let _this = this;
        if (!value) {
          return callback(new Error('出售数量必填'));
        }
        callback();
      };

      let checkSell = (rule, value, callback) => {
        let _this = this;
        if (!value) {

          return callback(new Error('购买数量必填'));
        }
        callback();
      };

      return {
        showProduct1: false, //收藏商品
        showProduct2: false, //取消收藏商品
        detail: {}, //详情数据
        lastUpdates: [], //相关资讯
        demands: [], //需求
        smallImages: [], //宝贝ids
        contentBoxDiv: {
          width: "400px",
          height: "480"
        },
        bigImgStyle: {
          width: "350px",
          height: "250px"
        },
        smallImgStyle: {
          width: "75px",
          height: "75px"
        },
        buyDialogVisible: false,
        buyForm: {
          maxTradeQuantity: 0,
          tradeQuantity: 0
        },
        minTradeQuantity: 0,
        buyBtn: false,
        buyFormRules: {
          tradeQuantity: [{validator: checkBuy, trigger: "blur"}]
        },
        sellDialogVisible: false,
        sellForm: {
          tradeQuantity: 1
        },
        sellBtn: false,
        sellFormRules: {
          tradeQuantity: [{validator: checkSell, trigger: "blur"}]
        }
      };
    },

    components: {
      CommonTitle, //公共标题
      BabyByCarousel //宝贝轮播图
    },

    created() {
      let _this = this;
      _this.handleGetDetailData(); //获取详情数据
      _this.getInformation(); //显示资讯数据
      _this.handleGetHavePublishedData(); //该企业发布过的需求
    },
    computed: {
      calTradeQuantity: function () {
        var sz = [];
        sz.push(this.detail.tradeType == "buy" ? "已成交" : "剩余");
        var tradeQuantity = this.detail.tradeQuantity;
        if (tradeQuantity == null) {
          tradeQuantity = 0;
        }
        sz.push(
          this.detail.tradeType == "buy"
            ? tradeQuantity
            : this.detail.quantity - tradeQuantity
        );
        return sz.join("");
      },

      showBuyBtn: function () {
        if (this.$store.state.accountObj.companyId == 0) {
          return this.detail.tradeType == "sell";
        } else {
          return (
            this.$store.state.accountObj.companyId != 0 &&
            this.$store.state.accountObj.companyId != this.detail.companyId &&
            this.detail.tradeType == "sell"
          );
        }
      },

      showSellBtn: function () {
        if (this.$store.state.accountObj.companyId == 0) {
          return this.detail.tradeType == "buy";
        } else {
          return (
            this.$store.state.accountObj.companyId != 0 &&
            this.$store.state.accountObj.companyId != this.detail.companyId &&
            this.detail.tradeType == "buy"
          );
        }
      },
      showRemarkGoodsBtn: function () {
        if (this.$store.state.accountObj.companyId == this.detail.companyId) {
          return false;
        }
        return this.showProduct1;
      },

      showRemarkCompanyBtn: function () {
        if (this.$store.state.accountObj.companyId == this.detail.companyId) {
          return false;
        }
        return true;
      },


    },

    watch: {
      '$route': function (to, from) {
        this.handleGetDetailData();
      }
    },

    methods: {
      openSellWin: function () {
        var _this = this;
        _this.$refs["sellForm"].clearValidate();
      },


      openBuyWin: function () {
        var _this = this;
        _this.$refs["buyForm"].clearValidate();
      },
      chgSellQuantity: function () {

      },


      gotoGoodsDetailPage: function (item) {

        this.$router.push({
          path: '/sellAndBuyDetail',
          query: {
            id: item.id,
            tradeType: item.tradeType,
            companyId: item.companyId
          }
        });

      },
      //获取详情数据
      handleGetDetailData() {
        let _this = this;
        _this.id = _this.$route.query.id;
        _this
          .$axios({
            method: "post",
            url:
            _this.$store.state.recycleAddr + "/recProduct/buyCommodityDetails",
            //url: 'http://192.168.5.133:8090/recProduct/buyCommodityDetails',
            data: {
              id: _this.$route.query.id
            }
          })
          .then(res => {
            if (res.data.status == 200) {
              _this.detail = res.data.data;
              _this.smallImages = res.data.data.uploadFileAttId;


              var tradeQuantity = _this.detail.tradeQuantity;
              if (tradeQuantity == null) {
                tradeQuantity = 0;
              }
              //计算剩余数量
              _this.buyForm.maxTradeQuantity = Math.max(0, _this.detail.quantity - tradeQuantity);
              _this.minTradeQuantity = Math.min(_this.buyForm.maxTradeQuantity, _this.detail.minTradeQuantity);
              //_this.minTradeQuantity=_this.buyForm.tradeQuantity;

            }
          }).then(function () {
          _this.showProduct1 = _this.showProduct2 = false;
          _this
            .$axios({
              method: "post",
              url: "/base/isCollection",
              data: {
                id: _this.detail.id
              }
            })
            .then(res => {
              if (res.data.status === 1) _this.showProduct1 = true;
              else if (res.data.status === 2) _this.showProduct2 = true;
            });
        });
      },

      //该企业发布过的需求
      handleGetHavePublishedData() {
        let _this = this;
        _this
          .$axios({
            method: "post",
            url: _this.$store.state.recycleAddr + "/recProduct/openDemand",
            data: {
              id: _this.$route.query.id,
              companyId: _this.$route.query.companyId
            }
          })
          .then(res => {
            if (res.data.status === 200) _this.demands = res.data.data;
            console.log("_this.detail", _this.detail);
          });
      },

      // 显示资讯数据
      getInformation() {
        let _this = this;
        _this
          .$axios({
            method: "post",
            url: "/base/infoList"
          })
          .then(res => {
            _this.lastUpdates = res.data.data.slice(0, 7);
          });
      },

      //查看公告详情
      handleGoToNotice(id) {
        let _this = this;
        _this.$router.push({
          path: "/informationDetail",
          query: {
            id: id
          }
        });
      },

      //收藏企业
      handleCollectionEnterprise() {
        if (this.checkLogin() == false) {
          return;
        }

        let _this = this;
        _this
          .$confirm("确定收藏该企业吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            _this
              .$axios({
                method: "post",
                url: "/base/enterpriseCollection",
                data: {
                  id: _this.$route.query.companyId
                }
              })
              .then(res => {
                switch (res.data.status) {
                  case 200:
                    _this.$message({
                      type: "success",
                      message: "成功收藏该企业!"
                    });
                    _this.handleGetDetailData(); //获取详情数据
                    break;
                  case 300:
                    _this.$message({
                      type: "warning",
                      message: "该企业已被收藏!"
                    });
                    break;
                }
              });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消收藏"
            });
          });
      },

      //收藏商品
      handleProductEnterprise(id) {
        let _this = this;
        _this
          .$confirm("确定收藏该商品吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            _this
              .$axios({
                method: "post",
                url: "/base/productCollection",
                data: {
                  id: id, //当前企业id
                  otherId: "1"
                }
              })
              .then(res => {
                switch (res.data.status) {
                  case 200:
                    _this.$message({
                      type: "success",
                      message: "成功收藏该商品!"
                    });
                    _this.showProduct1 = false;
                    _this.handleGetDetailData(); //获取详情数据
                    break;
                  case 300:
                    _this.$message({
                      type: "warning",
                      message: res.data.text
                    });
                    _this.handleGetDetailData(); //获取详情数据
                    break;
                }
              });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消收藏"
            });
          });
      },

      //进入企业
      handleGoToCompaniesToRecommend(detail) {
        let _this = this;
        _this.$router.push({
          path: "/clickToEnter",
          query: {
            id: detail.companyId
          }
        });
      },

      //显示购买弹框
      handleShowMyBuy(minTradeQuantity) {
        if (this.checkLogin() == false) {
          return;
        }
        if (this.checkValidQuantity() == false) {
          return false;
        }

        let _this = this;
        this.checkAddr(function (res) {
          if (res.data.status == 200 && res.data.data.list.length > 0) {
            _this.buyForm.tradeQuantity = minTradeQuantity;
            _this.buyForm.minTradeQuantity = minTradeQuantity;
            _this.buyDialogVisible = true;
          } else {
            _this.$alert("操作不能继续，请先完善地址信息", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                _this.$router.push("/user/addressMessage");
              }
            });
          }
        });
      },

      //确定购买
      handleSubmitBuy(buyForm) {
        let _this = this;
        _this.$refs[buyForm].validate(valid => {
          if (valid) {
            _this.buyBtn = true;
            _this
              .$axios({
                method: "post",
                // url: "/recOrder/createSellOrder",
                url: _this.$store.state.recycleAddr + "/recOrder/createSellOrder",
                data: {
                  productId: _this.$route.query.id, //商品id
                  tradeQuantity: _this.buyForm.tradeQuantity //数量
                }
              })
              .then(res => {
                _this.buyBtn = false;
                switch (res.data.status) {
                  case -500:
                    _this.buyBtn = false;
                    break;
                  case 200:
                    _this.$message({
                      type: "success",
                      message: "购买成功!"
                    });
                    _this.buyDialogVisible = false;
                    _this.$router.push("/user/myTrading");
                    break;
                  case 300:
                    _this.handleGetDetailData(); //获取详情数据
                    break;
                }
              });
          } else {
            return false;
          }
        });
      },

      checkValidQuantity: function () {
        if (this.buyForm.maxTradeQuantity == this.minTradeQuantity && this.buyForm.maxTradeQuantity <= 0) {
          this.$alert("操作不能继续，已无可交易的需求", "提示", {
            confirmButtonText: "确定",
          });
          return false;
        }
        return true;
      },

      //显示出售弹框
      handleShowMySell(minTradeQuantity) {
        if (this.checkLogin() == false) {
          return;
        }
        if (this.checkValidQuantity() == false) {
          return false;
        }

        let _this = this;
        this.checkAddr(function (res) {
          if (res.data.status == 200 && res.data.data.list.length > 0) {
            _this.sellForm.tradeQuantity = minTradeQuantity;
            _this.sellForm.minTradeQuantity = minTradeQuantity;
            _this.sellDialogVisible = true;
          } else {
            _this.$alert("操作不能继续，请先完善地址信息", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                _this.$router.push("/user/addressMessage");
              }
            });
          }
        });
      },

      //确定出售
      handleSubmitSell(sellForm) {
        let _this = this;
        _this.$refs[sellForm].validate(valid => {
          if (valid) {
            _this.buyBtn = true;
            _this
              .$axios({
                method: "post",
                // url: "/recOrder/createSellOrder",
                url: _this.$store.state.recycleAddr + "/recOrder/createSellOrder",
                data: {
                  productId: _this.$route.query.id, //商品id
                  tradeQuantity: _this.sellForm.tradeQuantity //数量
                }
              })
              .then(res => {
                _this.sellBtn = false;
                switch (res.data.status) {
                  case -500:
                    break;
                  case 200:
                    _this.$message({
                      type: "success",
                      message: "出售成功!"
                    });
                    _this.sellDialogVisible = false;
                    _this.$router.push("/user/myTrading");
                    break;
                  case 300:
                    _this.handleGetDetailData(); //获取详情数据
                    break;
                }
              });
          } else {
            return false;
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .common-title {
    margin: 10px 0;
  }

  //企业
  .enterprise {
    background: #fff;
    text-align: center;
    border: 1px solid #ccc;
    height: 360px;
    margin-right: 10px;
    img {
      width: 200px;
      height: 100px;
      margin-top: 20px;
    }
    .click {
      width: 160px;
      padding: 10px;
      margin: 20px 0 0 10px;
    }
    //收藏按钮
    .collection {
      width: 250px;
      height: 30px;
      margin-top: 10px;
      text-align: center;
      .el-button {
        padding: 10px;
      }
    }
  }

  //商品
  .commodity {
    // background: blue;
    border: 1px solid #ccc;
    background: #fff;
    height: 360px;
    width: 940px;
    //轮播
    .broadcast {
      width: 150px;
    }
    //购买信息
    .introduce {
      margin-top: 20px;
      h2 {
        width: 454px;
        height: 60px;
        font-size: 18px;
        color: #2c2c2c;
        border-bottom: 2px dotted #ccc;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      p {
        font-size: 13px;
        // font-weight: bold;
        color: #666;
        line-height: 10px;
        span {
          font-size: 13px;
        }
      }
      .describe {
        border-top: 2px dotted #ccc;
        border-bottom: 2px dotted #ccc;
      }
      .price {
        color: #ff4120;
        font-size: 20px;
      }
      span {
        font-size: 14px;
        color: #ff4120;
      }
      .el-button {
        background: #ff4120;
        color: #fff;
        width: 150px;
        margin: 20px 0 0 0;
        padding: 10px 20px;
      }
    }
  }

  //信息
  .information {
    background: #fff;
    border: 1px solid #ccc;
    margin-top: 10px;
    padding: 10px;
    .about {
      height: 230px;
      ul li {
        margin-top: 10px;
        line-height: 20px;
        list-style: disc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a:hover {
        color: #208dd6;
      }
    }
    .demand {
      margin-top: 20px;
      h3 {
        padding-top: 10px;
        border-top: 1px solid #ccc;
      }
      h4 {
        color: #636363;
      }
    }
    img {
      margin-top: 10px;
      width: 160px;
    }
  }

  //详情
  .details {
    background: #fff;
    border: 1px solid #ccc;
    margin: 10px 0 0 10px;
    width: 940px;
    p {
      font-size: 14px;
      color: #333;
      margin-left: 20px;
    }

    .transaction {
      h3 {
        font-size: 18px;
        background: #ecebeb;
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
      }
    }
    .product {
      h3 {
        font-size: 18px;
        background: #ecebeb;
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        padding-left: 10px;
      }
      li {
        display: inline-block;
        margin-left: 12px;
        &first-child {
          margin-left: 0;
        }
        img {
          width: 200px;
          height: 120px;
        }
      }
    }
    .contact {
      h3 {
        font-size: 18px;
        background: #ecebeb;
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
      }
    }
  }
</style>
