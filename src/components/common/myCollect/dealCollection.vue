<template>
  <div class="deal-collection">

    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="1">回收商品</el-menu-item>
      <el-menu-item index="2">危废商品</el-menu-item>
    </el-menu>

    <div class="order-table">
      <el-table
        :data="tableData"
        default-expand-all
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <img v-show="props.row.tradeType=='sell'||props.row.tradeType=='buy'"
                     @click="handleGoToRecDetail(props.row)"
                     :src="$store.state.outputImgUrl+props.row.fileId+'&bizObjName=upload_img'"
                     :alt="props.row.fileId+'img'">
                <img v-show="props.row.tradeType=='1'||props.row.tradeType=='2'"
                     @click="handleGoToDetail(props.row)"
                     :src="$store.state.outputImgUrl+props.row.fileId+'&bizObjName=prod_img'"
                     :alt="props.row.fileId+'img'">
              </el-col>
              <el-col :span="6">
                <el-row class="title" v-show="activeIndex=='1'">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.tradeType=='buy'?'[求购]'+props.row.productTitle:props.row.tradeType=='sell'?'[出售]'+props.row.productTitle:''}}
                      </div>
                      <el-button class="nowrap nowrap-h3" type="text" @click="handleGoToRecDetail(props.row)">
                        {{props.row.tradeType=='buy'?'[求购]'+props.row.productTitle:props.row.tradeType=='sell'?'[出售]'+props.row.productTitle:''}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row class="title" v-show="activeIndex=='2'">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.tradeType=='1'?'[不可回收]'+props.row.productTitle:props.row.tradeType=='2'?'[可回收]'+props.row.productTitle:''}}
                      </div>
                      <el-button class="nowrap nowrap-h3" type="text" @click="handleGoToDetail(props.row)">
                        {{props.row.tradeType=='1'?'[不可回收]'+props.row.productTitle:props.row.tradeType=='2'?'[可回收]'+props.row.productTitle:''}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row class="address">
                  <el-row v-show="activeIndex=='1'">
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{findConfigItem(props.row.source,$store.state.dictionary.hyly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hyzl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hylb).title}}
                      </div>
                      <el-button class="nowrap" type="text">
                        {{findConfigItem(props.row.source,$store.state.dictionary.hyly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hyzl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hylb).title}}
                      </el-button>
                    </el-tooltip>
                  </el-row>
                  <el-row v-show="activeIndex=='1'">
                    <span>最少交易量{{props.row.minTradeQuantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                  </el-row>
                  <el-row v-show="activeIndex=='2'">
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.category}}/{{props.row.subCategory}}
                      </div>
                      <el-button class="nowrap" type="text">
                        {{props.row.category}}/{{props.row.subCategory}}
                      </el-button>
                    </el-tooltip>
                  </el-row>
                  <el-row v-show="activeIndex=='2'">
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </div>
                      <el-button class="nowrap" type="text">
                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </el-button>
                    </el-tooltip>
                  </el-row>

                  <el-row>
                    <span>地址：{{props.row.province}}/{{props.row.city}}/{{props.row.region}}</span>
                  </el-row>
                </el-row>

              </el-col>
              <el-col :span="3" class="type">
                <el-row v-show="activeIndex=='1'">
                  <span>数量： {{props.row.quantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row v-show="activeIndex=='2'">
                  <span>数量：  {{props.row.quantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row>
                  <soan>单价：{{!props.row.price||props.row.price=='0.00'?'价格面议':props.row.price}}</soan>
                </el-row>
              </el-col>
              <el-col :span="5" class="enterprise">
                <span>{{props.row.enterpriseName}}</span>
              </el-col>
              <el-col :span="4" class="details">
                <span>{{props.row.creationTime}}</span>
              </el-col>
              <el-col :span="2" class="operation">
                <el-button type="text" @click="handleDeleteDeal(props.row.id)">删除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="商品详情"
          width="700">
        </el-table-column>
        <el-table-column
          label="收藏时间">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
    </div>

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
</template>
<script>
  export default {
    name: 'dealCollection',//交易收藏
    data() {
      return {
        tableData: [],//企业收藏--数据
        activeIndex: "1",//
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页

      };
    },
    created() {

      let _this = this;
      _this.handleGetTableData();//获取表数据

    },
    methods: {

      //类型事件
      handleSelect(key) {
        let _this = this;
        _this.activeIndex = key;
        _this.$router.push({
          path: 'dealCollection',
          query: {
            buinessType: key//1 2 3
          }
        });//根据订单状态显示路由
        _this.handleGetTableData();//
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/productCollectionList",
          data: {
            buinessType: _this.activeIndex,
            pageNum: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case 300:
              _this.tableData = [];
              break;
            case -500:
              _this.tableData = [];
              break;
          }
        })
      },

      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetTableData();//获取表数据
      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.handleGetTableData();//获取表数据
      },

      //删除
      handleDeleteDeal(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/deleteProductCollection",
            data: {
              id: id//当前企业id
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.handleGetTableData();//获取表数据
                break;
            }
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //跳转去详情页
      handleGoToDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/wasteDetail',
          query: {
            id: row.fileId,
            tradeType: row.tradeType,
            companyId: row.companyId
          }
        });
      },

      //跳转去详情页
      handleGoToRecDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/sellAndBuyDetail',
          query: {
            id: row.fileId,
            tradeType: row.tradeType,
            companyId: row.companyId
          }
        });
      },
    }
  };
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .order-table-self.el-table th {
    background: rgba(242, 242, 242, 1);
  }

  .order-table .el-table__expanded-cell {
    background: #f9f9f9;
    font-size: 12px;
    padding: 20px 20px;
  }

  .el-col {
    padding: 0px;
  }
</style>

<style lang="less" scoped>
  .deal-collection {
    .form-search {
      height: 80px;
      line-height: 80px;
      .search-left-content {
        margin-top: 4px;
      }
      .search-right-content {
        margin-top: 10px;
        margin-left: 120px;
        .form-item-display {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    .pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 40%;
    }
  }
</style>

<style lang="less" scoped>
  #content {
    img {
      width: 100px;
      height: 80px;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title:hover {
      cursor: pointer;
      color: #208dd6;
    }
    .address {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .type {
      font-size: 12px;
      padding-top: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .enterprise {
      line-height: 90px;
      margin-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .details {
      line-height: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .operation {
      line-height: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :hover {
      overflow: visible;
    }

  }
</style>
