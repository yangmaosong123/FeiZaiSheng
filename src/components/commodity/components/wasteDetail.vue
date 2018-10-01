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
                <el-button type="primary" @click="handleCollectionEnterprise">收藏企业</el-button>
                <el-button type="primary" @click="handleProductEnterprise(detail.productId)">收藏商品
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
                <h2 class="h-normal">【{{detail.daType=='1'?'不可回收':detail.daType=='2'?'可回收':''}}】{{detail.daName}}</h2>
                <p>
                  主要成分：
                  {{detail.daCategory}}/{{detail.daCode}}
                </p>
                <p>发布日期：{{detail.createTime}}</p>
                <p>
                  数&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp量：{{detail.number}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
                <div class="describe">
                  <p class="price">价格：{{!detail.price||detail.price=='0'?'价格面议':'￥'+detail.price}}</p>
                </div>
                <el-button
                  v-show="$store.state.accountObj.companyId!=0 && $store.state.accountObj.companyId!=detail.companyId&&detail.tradeType=='buy'"
                  @click="handleShowMySell(detail.minTradeQuantity)">我要出售
                </el-button>
                <el-button
                  v-show="$store.state.accountObj.companyId!=0 && $store.state.accountObj.companyId!=detail.companyId&&detail.tradeType=='sell'"
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
              <Demand @handleGetDetailData="handleGetDetailData"></Demand>
            </div>
          </el-col>
          <el-col :span="18" class="details">
            <div class="transaction">
              <h3>交易信息</h3>

              <p> 主要成分：{{detail.daCategory}}/{{detail.daCode}}</p>
              <p>发布日期：{{detail.createTime}}</p>
              <p>危废地址：{{detail.province+detail.city+detail.region+detail.address}}</p>
              <p>行业来源：{{findConfigItem(detail.industrySource,$store.state.dictionary.hyly).title}}</p>
              <p>危废来源：{{detail.dangerousWasteSource}}</p>
              <p>发布数量：{{detail.number}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
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
              <p>所在地区：{{detail.province+detail.city+detail.region}}</p>
              <p>详细地址：{{detail. address}}</p>
            </div>
          </el-col>
        </el-row>
      </section>
    </div>
  </div>
</template>
<script>
  import CommonTitle from "../../common/commonTitle";
  import BabyByCarousel from "../../common/carousel/babyByCarousel";
  import Demand from '../../common/demand'

  export default {
    name: "wasteDetail", //详情
    data() {
      let checkBuy = (rule, value, callback) => {
        let _this = this;
        if (!value) {
          callback(new Error("交易数量不能为空，请返回修改"));
        } else if (isNaN(value)) {
          callback(new Error("交易数量必须为数字，请返回修改"));
        } else if (value < 1) {
          callback(new Error("交易数量大于等于1，请返回修改"));
        } else if (_this.sellForm.minTradeQuantity > value || _this.buyForm.minTradeQuantity > value) callback(new Error("交易数量不能小于最小成交量，请返回修改"));
        else callback();
      };

      return {
        detail: {}, //详情数据
        lastUpdates: [], //相关资讯
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
        buyForm: {},
        buyBtn: false,
        buyFormRules: {
          tradeQuantity: [{validator: checkBuy, trigger: "blur"}]
        },
        sellDialogVisible: false,
        sellForm: {},
        sellBtn: false,
        sellFormRules: {
          tradeQuantity: [{validator: checkBuy, trigger: "blur"}]
        }
      };
    },

    components: {
      CommonTitle, //公共标题
      BabyByCarousel, //宝贝轮播图
      Demand//企业发布过的需求
    },
    created() {
      let _this = this;
      _this.handleGetDetailData(); //获取详情数据
      _this.getInformation(); //显示资讯数据
    },
    methods: {

      //获取详情数据
      handleGetDetailData() {
        let _this = this;
        _this.id = _this.$route.query.id;
        _this.$axios({
          method: "post",
          url: "/product/productionCommodityDetails",
          data: {
            id: _this.$route.query.id
          }
        }).then(res => {
          if (res.data.status == 200) {
            _this.detail = res.data.data;
            _this.smallImages = res.data.data.uploadFileAttId;
          }
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
            _this.lastUpdates = res.data.data.slice(0,7);
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
        _this.$axios({
          method: "post",
          url: "/base/isCollection",
          data: {
            id: _this.detail.productId
          }
        }).then(res => {
          if (res.data.status == 1) _this.$confirm("确定收藏该商品吗?", "提示", {
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
                    otherId: "2"
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
          else if (res.data.status == 2) _this.$message({
            type: 'warning',
            message: '该商品已收藏!'
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
      height: 120px;
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
