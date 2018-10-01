<template>
  <div class="more-companies">
    <div class="main">
      <el-row>
        <el-col :span="24" class="screen">
          <div class="enterprise">
            类型: <span v-for="(item,index) in typeOfEnterprise"
                      v-show="$route.query.enterpriseType==item.itemCode"
                      :class="{'category-background':$route.query.enterpriseType==item.itemCode}">
            {{item.title}}
          </span>
          </div>
          <div class="industry">
            行业:<span v-for="(item,index) in industrys"
                     :class="{'source-background':index==sourceCurrent}"
                     @click="handleClickSource(item.itemCode,index)">
            {{item.title}}
          </span>
          </div>

          <div class="product">
            产品:<span v-for="(item,index) in product"
                     :class="{'tradeType-background':index==categoryCurrent}"
                     @click="handleClickTradeType(item.itemCode,index)">
            {{item.title}}
          </span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-card class="box-card" v-for="item in cards" :key="item.id"
                   style=" width: 1150px !important;">
            <div class="text item" style=" margin-bottom:0px ;">
              <el-row class="content">
                <el-col :span="24">
                  <el-row>
                    <el-col :span="24">
                      <h3 class="title"
                          @click="handleClickEnterToDetail(item.id)">
                        {{item.enterpriseName}}
                      </h3>
                    </el-col>

                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="4">
                      <img
                        @click="handleClickEnterToDetail(item.id)"
                        :src="$store.state.outputImgByIdUrl+item.enterpriseDisplay"
                        :alt="item.enterpriseDisplay">
                    </el-col>
                    <el-col :span="16">
                      <p>所属行业：{{findConfigItem(item.industry,$store.state.dictionary.sshy).title}}</p>
                      <p>公司介绍:{{item.companyIntroduction}}</p>
                    </el-col>
                    <el-col :span="4">
                      <span>{{item.province+item.city+item.region}}</span>
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
    name: 'moreCompanies',//更多企业
    data() {
      return {
        typeOfEnterprise: [],//企业类型
        industrys: [],//行业
        product: [],//产品
        tradeTypeCurrent: '0',//当前项--类型
        sourceCurrent: '0',//当前项--行业
        categoryCurrent: '0',//当前项--产品
        enterpriseType: '',//类型
        industry: '',//行业
        mainProducts: '',//产品
        cards: [],//
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
      };
    },
    created() {
      let _this = this;
      _this.handleGetRoutingDictionary(); //路由词典
      _this.handleGetMoreData();//获取更多企业数据
    },
    watch: {
      industry(value) {
        let _this = this;
        _this.industry = value;
        _this.handleGetMoreData();//获取更多企业数据
      },
      mainProducts(value) {
        let _this = this;
        _this.mainProducts = value;
        _this.handleGetMoreData();//获取更多企业数据
      },
    },
    methods: {

      //路由词典
      handleGetRoutingDictionary() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findOneType",
          data: {
            moduleCode: "qylx,sshy,zycp"
          }
        }).then(res => {
          _this.typeOfEnterprise = res.data.data.qylx;
          res.data.data.sshy.unshift({title: "不限", itemCode: ''});
          _this.industrys = res.data.data.sshy;
          res.data.data.zycp.unshift({title: "不限", itemCode: ''});
          _this.product = res.data.data.zycp;
        })
      },

      //获取更多企业数据
      handleGetMoreData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/moreEnterpriseLibrary",
          data: {
            enterpriseType: _this.$route.query.enterpriseType ? _this.$route.query.enterpriseType : _this.enterpriseType == "bx" ? "" : _this.enterpriseType,//类型
            industry: _this.industry == 'bx' ? '' : _this.industry,//行业
            mainProducts: _this.mainProducts == 'bx' ? '' : _this.mainProducts,//产品
            pageIndex: _this.page.currentPage,
            pageSize: _this.page.pageSize
          }
        }).then((res) => {

          if (res.data.status === 200) {
            _this.page.total = res.data.data.total;
            _this.cards = res.data.data.list;
          }
        });
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

      //类型
      handleClickCategory(itemCode, index) {
        let _this = this;
        _this.tradeTypeCurrent = index;
      },

      //行业
      handleClickSource(itemCode, index) {
        let _this = this;
        _this.industry = itemCode;
        console.log("_this.industry", _this.industry);
        _this.sourceCurrent = index;
      },

      //产品
      handleClickTradeType(itemCode, index) {
        let _this = this;
        _this.mainProducts = itemCode;
        _this.categoryCurrent = index;
      },


      //点击进入
      handleClickEnterToDetail(id) {
        let _this = this;
        _this.$router.push({path: '/clickToEnter', query: {id: id}});
      },
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
    .enterprise, .industry, .product {
      span {
        padding: 3px 10px;
        text-align: center;
        &:first-child {
          margin-left: 0;
        }
      }
    }
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
    span:hover {
      cursor: pointer;
    }
  }

  .content {
    background: #ffffff;

    // height: 128px;
    border: 1px solid #e3e3e3;
    padding: 10px;
    img {
      width: 144px;
      height: 80px;
    }
    img:hover {
      cursor: pointer;
    }
    p {
      &:last-child {
        margin: 10px 0 0 0;
        height: 64px;
        color: #656565;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #565656;
      padding-bottom: 10px;
    }
    .title:hover {
      cursor: pointer;
      color: #208dd6;
    }
  }

  .category-background,
  .source-background,
  .tradeType-background {
    background: #208dd6;
    color: #fff;
  }
</style>
