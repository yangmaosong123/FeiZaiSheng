<template>
  <div class="waste-list">

    <!-- 公共标题 -->
    <CommonTitle title="危废管理"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="1">不可回收</el-menu-item>
          <el-menu-item index="2">可回收</el-menu-item>
        </el-menu>
      </div>

      <!-- 发布订单按钮 -->
      <el-button type="primary" style="background:#208dd6;" class="search-button"
                 v-show="$store.state.enterpriseTypeStatus == 'cf'"
                 @click="handleShowIssueCommodityDialog">
        发布商品
      </el-button>
    </div>

    <!-- 表格模块 -->
    <div class="order-table-content background-color">
      <el-table @filter-change="handleFilterChg" ref="tableData" default-expand-all :data="tableData"
                highlight-current-row
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img
                    v-if="props.row.orderId && props.row.productStatus!='D'"
                    @click="handleGoToLogisticsDetail(props.row)"
                    :src="$store.state.outputImgUrl+props.row.orderId+'&bizObjName=prod_img'"
                    :alt="'img'+props.row.orderId">


                  <img
                    v-else-if="!props.row.orderId&&(props.row.id&&props.row.productStatus=='D')"
                    :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                    :alt="'img'+props.row.id">

                  <img
                    v-else
                    src="../../assets/img/logo.png">
                </div>
              </el-col>
              <el-col :span="8">
                <el-row class="title">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.daName}}
                      </div>
                      <el-button class="nowrap nowrap-h3" type="text"
                                 v-if="props.row.productStatus!='D'"
                                 @click="handleGoToLogisticsDetail(props.row)">
                        {{props.row.daName}}
                      </el-button>
                      <el-button class="nowrap nowrap-h3" type="text"
                                 v-else="props.row.productStatus=='D'">
                        {{props.row.daName}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row class="address">
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content">
                          {{props.row.daCategory}}/{{props.row.daCode}}
                        </div>
                        <el-button class="nowrap" type="text"
                                   v-if="props.row.productStatus!='D'"
                                   @click="handleGoToLogisticsDetail(props.row)">
                          {{props.row.daCategory}}/{{props.row.daCode}}
                        </el-button>
                        <el-button class="nowrap" type="text"
                                   v-else="props.row.productStatus=='D'">
                          {{props.row.daCategory}}/{{props.row.daCode}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </div>
                        <el-button class="nowrap" type="text"
                                   v-if="props.row.productStatus!='D'"
                                   @click="handleGoToLogisticsDetail(props.row)">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </el-button>
                        <el-button class="nowrap" type="text"
                                   v-else="props.row.productStatus=='D'">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <span style="white-space:normal; word-break:break-all;">地址：{{props.row.province+ props.row.city+props.row.region}}</span>
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="5" class="type">
                <el-row>
                  <span>类型：{{ props.row.daType=='1'?'不可回收': props.row.daType=='2'?'可回收':"" }}</span>
                </el-row>
                <el-row>
                  <span>数量：{{ props.row.number }} {{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row>
                  <span>单价：{{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price }}</span>
                </el-row>
              </el-col>
              <el-col :span="5" class="enterprise">
                <span>{{ props.row.enterpriseName===''?'——':props.row.enterpriseName }}</span>
              </el-col>

              <el-col :span="5" class="details">
                {{props.row.productStatus=='Y'?'已生效':
                (props.row.productStatus=='N'?'已结束':
                (props.row.productStatus=='D'?'草稿':''))}}｜
                <el-button type="text" size="small"
                           v-show="props.row.productStatus!='D'"
                           @click="handleGoToLogisticsDetail(props.row)">商品详情
                </el-button>
              </el-col>
              <el-col :span="2" class="operation">
                <el-button type="text" v-show="props.row.productStatus=='D'"
                           @click="handleShowEditIssueCommodityDialog(props.row.id)">编辑
                </el-button>
                <el-button type="text" size="small"
                           @click="handleDeleteRowData(props.row.id)">删除
                </el-button>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="日期"
          width="180"
          column-key="filter_date"
          :filter-multiple="false"
          :filters="[{text: '半年内', value: 180}, {text: '三个月内', value: 90}, {text: '一个月内', value: 30}]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单详情"
          width="420"
          prop="">
          <template slot-scope="scope">
            <span>商品编号：{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="170"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[{text: '草稿', value: 'D'},{text: '已生效', value: 'Y'},{text: '已结束', value: 'N'}]"
          prop="tag">
        </el-table-column>
        <el-table-column
          label="订单操作"
          prop="">
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

    <!-- 发布订单 -->
    <WasteCommodity ref="WasteCommodity"
                    @handleGetTableData="handleGetTableData"></WasteCommodity>

    <!-- 发布订单--通过编辑 -->
    <WasteEditCommodity ref="WasteEditCommodity"
                        @handleGetTableData="handleGetTableData"></WasteEditCommodity>
  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'
  import WasteCommodity from './components/wasteCommodity'
  import WasteEditCommodity from './components/wasteEditCommodity'

  export default {
    name: "wasteList",//危废管理
    data() {
      return {

        activeIndex: '0',//index--默认全部订单
        tableData: [],//订单表--数据
        publishTime: '0',//发布时间
        productStatus: "0",//商品状态
        tradeType: '0',//发布种类
        orderFilters: [],
        timeFilters: [],
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页

      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle,//公共标题
      WasteCommodity,//发布商品
      WasteEditCommodity,//发布商品--通过编辑
    },


    methods: {

      //表过滤
      handleFilterChg(filters) {
        let _this = this;
        _this.publishTime = "0";
        _this.productStatus = "0";
        for (let index in _this.$refs.tableData.columns) {
          let column = _this.$refs.tableData.columns[index];
          if (!column.filteredValue || column.filteredValue.length == 0) {
            continue;
          }
          if (column.columnKey && column.columnKey == "filter_date") {
            _this.publishTime = column.filteredValue[0];
          }
          else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.productStatus = column.filteredValue[0];
          }
        }
        _this.handleGetTableData();
      },

      //menu切换
      handleSelect(key, keyPath) {
        let _this = this;
        _this.$router.push({
          path: 'wasteList',
          query: {
            productStatus: key//1 2 3
          }
        });//根据订单状态显示路由
        _this.publishTime = "0";
        _this.productStatus = "0";
        _this.tradeType = key;
        _this.$refs.tableData.clearFilter();//清除状态
        _this.handleGetTableData();//获取表数据
      },

      //显示发布商品
      handleShowIssueCommodityDialog(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/isPublishOrder",
          data: {
            account: _this.$store.state.account,
            picCode: "1"
          }
        }).then((res) => {
          if (res.data.status == 200) {
            if (!res.data.data.registrationCapital) {
              _this.$confirm('请先完善企业信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                setTimeout(() => {
                  _this.$router.push("/user/detailedMsg");
                }, 800);
              });
            }
            else
              _this.$refs.WasteCommodity.ShowIssueOrderDialog();
          } else if (res.data.status == 300) {
            _this.$confirm('请先完善地址信息且设置一个默认地址', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              setTimeout(() => {
                _this.$router.push("/user/addressMessage");
              }, 800);
            });
          }
        });

      },

      //通过编辑显示发布商品
      handleShowEditIssueCommodityDialog(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/isPublishOrder",
          data: {
            account: _this.$store.state.account,
            picCode: "1"
          }
        }).then((res) => {
          if (res.data.status === 200) {
            if (!res.data.data.registrationCapital) {
              _this.$confirm('请先完善企业信息', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                setTimeout(() => {
                  _this.$router.push("/user/detailedMsg");
                }, 800);
              });
            } else if (res.data.status === 300) {
              _this.$confirm('请先完善地址信息且设置一个默认地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                setTimeout(() => {
                  _this.$router.push("/user/addressMessage");
                }, 800);
              });
            } else {
              _this.$router.push({
                query: {
                  id: id
                }
              });
              _this.$refs.WasteEditCommodity.ShowIssueOrderDialog();
            }
          }
        });

      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/product/daProductList",
          data: {
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
            orderStatus: _this.productStatus,//发布状态
            selectTime: _this.publishTime,//发布时间
            daType: _this.tradeType//发布种类
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
        let _this = this;
        _this.page.pageSize = val;
        _this.handleGetTableData();//获取表数据
      },

      handleCurrentChange(val) {
        let _this = this;
        _this.page.currentPage = val;
        _this.handleGetTableData();//获取表数据
      },

      handleDeleteRowData(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/product/deleteProduct",
            data: {
              id: id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: "删除成功"
                });
                _this.handleGetTableData(); //获取表数据
                break;
              case 300:
                _this.handleGetTableData(); //获取表数据
                break;
              case -500:
                _this.handleGetTableData(); //获取表数据
                break;
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //商品详情
      handleGoToLogisticsDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/wasteDetail',
          query: {
            id: row.id,
            tradeType: row.daType,
            companyId: row.companyId
          }
        });
      }

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
  .waste-list {
    .form-search {
      height: 60px;
      position: relative;
      .search-button {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
    .pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 33%;
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
      span {
        border-right: 2px solid #909090;
        padding-right: 5px;
      }
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

