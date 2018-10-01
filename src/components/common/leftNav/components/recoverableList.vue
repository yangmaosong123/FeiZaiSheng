<template>
  <div class="recoverable-list">
    <div class="main">
      <el-row>
        <el-col :span="24" class="screen" v-show="$route.query.type">
          <div class="enterprise">
            交易类型:
            <span v-for="(item,index) in categoryOptions"
                  @click="handleClickCategory(item,index)"
                  :class="{'category-background':index==tradeTypeCurrent}">{{item}}</span>
          </div>
          <div class="industry">

            行 业:
            <span v-for="(item,index) in sourceOptions"
                  v-show="$route.query.type=='汽车零配件'&&item.itemCode=='spjg'"
                  :class="{'source-background':sourceCurrent==0}"
                  @click="handleClickSource(item,index)">{{item.title}}</span>

            <span v-for="(item,index) in sourceOptions"
                  v-show="$route.query.type=='电池专区'&&item.itemCode=='dczq'"
                  :class="{'source-background':sourceCurrent==0}"
                  @click="handleClickSource(item,index)">{{item.title}}</span>

            <span v-for="(item,index) in sourceOptions1"
                  :class="{'source-background':sourceCurrent==index}"
                  @click="handleClickSource(item,index)">{{item.title}}</span>
          </div>

          <div class="product">
            种 类:
            <span v-for="(item,index) in tradeTypeOptions"
                  v-show="$route.query.type=='汽车零配件'"
                  :class="{'tradeType-background':index==categoryCurrent}"
                  @click="handleClickTradeType(item,index)">{{item.title}}</span>

            <span v-for="(item,index) in tradeTypeOptions"
                  :class="{'tradeType-background':index==categoryCurrent}"
                  v-show="$route.query.type=='电池专区'"
                  @click="handleClickTradeType(item,index)">{{item.title}}</span>

            <span v-for="(item,index) in tradeTypeOptions1"
                  :class="{'tradeType-background':index==categoryCurrent}"
                  @click="handleClickTradeType(item,index)">{{item.title}}</span>
          </div>
          <div class="">(共{{total}}个交易)</div>
        </el-col>
        <el-col :span="24">
          <el-card class="box-card" v-for="item in cards" :key="item.id" style=" width: 1150px !important;">
            <div class="text item">
              <el-row class="content">
                <el-col :span="24">
                  <el-row>


                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="5">
                      <img
                        @click="handleGoToDetail(item)"
                        :src="$store.state.outputImgUrl+item.id+'&bizObjName=upload_img'"
                        :alt="item.id">
                    </el-col>
                    <el-col :span="8" class="productname">
                      <h3 @click="handleGoToDetail(item)">
                        [{{item.tradeType=='sell'?'出售':item.tradeType=='buy'?'求购':''}}] {{item.productTitle}}</h3>
                      <p>供货地区：{{makeAddr(item.province,item.city,item.region)}}</p>
                      <p>供应总量：{{item.quantity}}{{findConfigItem(item.unit,$store.state.dictionary.unit).title}}</p>
                      <p>发布日期：{{dateToStrMinue(item.creationTime)}}</p>
                    </el-col>
                    <el-col :span="5" class="enterprisename">
                      <h3 class="title">{{item.enterpriseName}}</h3>
                      <el-badge value="优质企业" class="item"></el-badge>
                    </el-col>
                    <el-col :span="6" class="transactionprice">
                      <span>交易价格：{{!item.price||item.price=='0.00'?'面议':'￥'+item.price}}</span>
                      <el-button type="text" @click="handleGoToDetail(item)">查看详情</el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>

    </div>
  </div>
</template>
<script>
  export default {
    name: 'recoverableList',//可回收产品列表
    data() {
      return {
        total: '',//总交易个数
        category: 'bx',
        source: 'bx',
        tradeType: '不限',
        categoryOptions: ['不限', '出售', '求购'],//种类状态
        sourceOptions: [],//行业
        sourceOptions1: [],//行业
        tradeTypeOptions: [],//发布种类
        tradeTypeOptions1: [],//发布种类
        cards: [],//
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
        categoryCurrent: '0',//当前项
        sourceCurrent: '0',//当前项
        tradeTypeCurrent: '0',//当前项

      };
    },
    watch: {
      '$store.state.searchKey': function () {
        this.handleGetMoreData();//获取更多企业数据

      }
    },
    created() {
      let _this = this;
      _this.handleGetMoreData();//获取更多企业数据
      _this.handleGetRoutingDictionary(); //路由词典
    },
    mounted() {
      let _this = this;
      _this.handleGetMoreData(); //获取更多企业数据
      _this.handleGetRoutingDictionary(); //路由词典
    },
    methods: {

      //获取更多企业数据
      handleGetMoreData() {
        let _this = this;
        if (_this.$route.query.type) {
          _this.$axios({
            method: "post",
            url: _this.$store.state.recycleAddr + "/recProduct/indexRecyclList",
            data: {
              category: _this.category,//种类状态
              source: _this.source,//行业
              tradeType: _this.tradeType,//发布种类
              searchKey: _this.$store.state.searchKey,
              pageIndex: _this.page.currentPage,
              pageSize: _this.page.pageSize
            }
          }).then((res) => {
            _this.page.total = 0;
            _this.cards = [];
            _this.total = 0;

            switch (res.data.status) {
              case 200:
                _this.page.total = res.data.data.total;
                _this.cards = res.data.data.list;
                _this.total = res.data.data.total;
                break;
              case 300:
                _this.cards = [];
                break;
            }
          });
        } else {

          _this.$axios({
            method: "post",
            url: _this.$store.state.recycleAddr + "/recProduct/indexRecyclList",
            data: {
              category: "bx",//种类状态
              source: "",//行业
              tradeType: "不限",//发布种类
              searchKey: _this.$store.state.searchKey,
              pageIndex: _this.page.currentPage,
              pageSize: _this.page.pageSize
            }
          }).then((res) => {
            _this.page.total = 0;
            _this.cards = [];
            _this.total = 0;

            switch (res.data.status) {
              case 200:
                _this.page.total = res.data.data.total;
                _this.cards = res.data.data.list;
                _this.total = res.data.data.total;
                break;
              case 300:
                _this.cards = [];
                break;
            }
          });
        }
      },

      //路由词典
      handleGetRoutingDictionary() {
        let _this = this;
        if (_this.$route.query.type == '汽车零配件') {
          _this.$axios({
            method: "post",
            url: "/base/findOneType",
            data: {
              moduleCode: "hsly"
            }
          }).then(res => {
            if (res.data.status === 200) {
              _this.sourceOptions = res.data.data.hsly;
              res.data.data.hsly.map(item => {
                if (item.itemCode == 'spjg') {
                  _this.source = item.itemCode;
                  _this.handleGetMoreData();//获取更多企业数据
                  _this.$axios({
                    method: "post",
                    url: "/base/getListByProvinceId",
                    data: {
                      id: item.id
                    }
                  }).then(res => {
                    if (res.data.status === 200) {
                      res.data.data.unshift({title: '不限', itemCode: 'bx'});
                      _this.tradeTypeOptions = res.data.data;
                    }
                  });
                }
              });
            }
          });
        }
        else if (_this.$route.query.type == '电池专区') {
          _this.$axios({
            method: "post",
            url: "/base/findOneType",
            data: {
              moduleCode: "hsly"
            }
          }).then(res => {
            if (res.data.status === 200) {
              _this.sourceOptions = res.data.data.hsly;
              res.data.data.hsly.map(item => {
                if (item.itemCode == 'dczq') {
                  _this.source = item.itemCode;
                  _this.handleGetMoreData();//获取更多企业数据
                  _this.$axios({
                    method: "post",
                    url: "/base/getListByProvinceId",
                    data: {
                      id: item.id
                    }
                  }).then(res => {
                    if (res.data.status === 200) {
                      res.data.data.unshift({title: '不限', itemCode: 'bx'});
                      _this.tradeTypeOptions = res.data.data;
                    }
                  });
                }
              });
            }
          });
        } else {
          _this.category = "bx";
          _this.source = "";
          _this.tradeType = "不限";
          // _this.$axios({
          //   method: "post",
          //   url: "/base/findOneType",
          //   data: {
          //     moduleCode: "hsly,hszl"
          //   }
          // }).then(res => {
          //   if (res.data.status === 200) {
          //     res.data.data.hsly.unshift({title: '不限', itemCode: 'bx'});
          //     _this.sourceOptions1 = res.data.data.hsly;
          //
          //     res.data.data.hszl.unshift({title: '不限', itemCode: 'bx'});
          //     _this.tradeTypeOptions1 = res.data.data.hszl;
          //   }
          // });
        }
      },

      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetMoreData();//获取更多企业数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.handleGetMoreData();//获取更多企业数据
      },

      //交易种类
      handleClickCategory(value, index) {
        let _this = this;
        _this.tradeType = value == '出售' ? 'sell' : value == '求购' ? 'buy' : value;
        _this.tradeTypeCurrent = index;
        _this.$store.state.searchKey = "";
        _this.handleGetMoreData();//获取更多企业数据
      },

      //行业
      handleClickSource(value, index) {
        let _this = this;
        _this.source = value.itemCode;
        _this.sourceCurrent = index;
        _this.$store.state.searchKey = "";
        _this.handleGetMoreData();//获取更多企业数据
      },

      //发布种类
      handleClickTradeType(value, index) {
        let _this = this;
        _this.category = value.itemCode;
        _this.categoryCurrent = index;
        _this.$store.state.searchKey = "";
        _this.handleGetMoreData();//获取更多企业数据
      },

      //跳转去详情页
      handleGoToDetail(item) {
        let _this = this;
        _this.$router.push({
          path: '/sellAndBuyDetail',
          query: {
            id: item.id,
            tradeType: item.tradeType,
            companyId: item.companyId
          }
        });
      }
    }
  };
</script>
<style>

  .text {
    font-size: 14px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 10px;
  }

</style>


<style lang="less" scoped>
  .screen {

    font-size: 14px;
    color: #333;
    padding: 20px 0 0 10px;
    .enterprise {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px dotted #ccc;
    }
    .industry {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px dotted #ccc;
    }
    .product {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px dotted #ccc;
    }
    span {
      margin: 0 10px;
      padding: 3px 8px;
    }
    span:hover {
      cursor: pointer;
    }
  }

  .content {
    background: #ffffff;
    border: 1px solid #e3e3e3;
    padding: 10px;
    img {
      width: 160px;
      height: 160px;
    }
    .productname {
      margin-top: 20px;
      h3 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      h3:hover {
        cursor: pointer;
        color: #208dd6;
      }
    }
    .enterprisename {
      .title {
        margin-top: 50px;
        font-size: 16px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #565656;
      }
      .item {
        margin-top: 5px;
      }
    }
    .transactionprice {
      margin-top: 50px;
    }

    p {
      margin: 5px 0;
      color: #656565;
    }

  }

  .category-background,
  .source-background,
  .tradeType-background {
    color: #fff;
    background: #208dd6;
    text-align: center;
  }

</style>
