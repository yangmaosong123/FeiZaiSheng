<template>
  <div class="commodity-list">

    <!-- 公共标题 -->
    <CommonTitle title="订单管理"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="sell">出售</el-menu-item>
          <el-menu-item index="buy">求购</el-menu-item>
        </el-menu>
      </div>

      <!-- 发布订单按钮 -->
      <el-button type="primary" style="background:#007cc6;" class="search-button"
                 @click="handleShowIssueCommodityDialog">
        发布商品
      </el-button>
    </div>

    <!-- 表格模块 -->
    <div class="order-table">
      <el-table @filter-change="handleFilterChg" ref="tableData" default-expand-all :data="tableData"
                highlight-current-row style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img onerror='this.src="/static/no_img.png"'
                       :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=upload_img&t='+(new Date()).getTime()"
                       :alt="props.row.id+'img'" @click="handleGoToDetail(props.row)" class="prod_nav">
                </div>
              </el-col>
              <el-col :span="8">
                <el-row class="title">
                  <div @click="handleGoToDetail(props.row)" class="prod_nav">
                    【{{props.row.tradeType=='sell'?'出售':props.row.tradeType=='buy'?'求购':''}}】
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.productTitle}}
                      </div>
                      <el-button class="nowrap4 nowrap-h3" type="text">
                        {{props.row.productTitle}}
                      </el-button>
                    </el-tooltip>
                  </div>

                </el-row>
                <el-row class="address">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                                      
                       {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </div>
                      <el-button class="nowrap4 nowrap-h4"
                                 type="text"
                      >
                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                  <el-col>
                    <span>最少成交量：{{props.row.minTradeQuantity}}/{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                  </el-col>
                  <el-col>
                    <span>地址：{{ makeAddr(props.row.province,props.row.city,props.row.region)}}</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="5" class="type">
                <el-row>
                  <span>类型：{{props.row.tradeType=='sell'?'出售':props.row.tradeType=='buy'?'求购':''}}</span>
                </el-row>
                <el-row>
                                                      
                  <span>数量：{{ props.row.quantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row>
                  <span>单价：{{!props.row.price||props.row.price=='0.00'?'价格面议':'￥'+props.row.price}}</span>
                </el-row>
              </el-col>
              <!-- <el-col :span="5" class="enterprise">
      <span>{{ props.row.enterpriseName===''?'——':props.row.enterpriseName }}</span>
    </el-col> -->
              <el-col :span="5" class="details">
                       
                <span>{{status[props.row.productStatus]}}</span>                             
                <el-button v-if="props.row.productStatus!='D'" type="text" size="small"
                           @click="handleGoToDetail(props.row)">商品详情
                </el-button>
              </el-col>
              <el-col :span="1" class="operation">
                <el-button type="text" size="small" @click="handleDeleteRowData(props.row.id)">删除</el-button>
              </el-col>
              <el-col :span="1" class="operation" v-if="props.row.productStatus=='D'">
                <el-button type="text" size="small" @click="handleUpdateRowData(props.row.id)">修改</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="日期" width="180" column-key="filter_date" :filter-multiple="false"
                         :filters="[{text: '半年内', value: 180}, {text: '三个月内', value: 90}, {text: '一个月内', value: 30}]">
          <template slot-scope="scope">
                 
            <span>{{dateToStrMinue(scope.row.creationTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单详情" width="430" prop="">
          <template slot-scope="scope">
            <span>商品编号：{{scope.row.productSn}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="180" column-key="filter_tag" :filter-multiple="false"
                         :filters="[{text: '已生效', value: 'Y'},{text: '已结束', value: 'N'},{text: '草稿', value: 'D'}]"
                         prop="tag">
        </el-table-column>
        <el-table-column label="订单操作">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="page.total">
    </el-pagination>

    <!-- 发布订单 -->
    <IssueCommodity ref="IssueCommodity"></IssueCommodity>
    <update-prod :showFlag="updateRowId>0" v-if="updateRowId>0" :rowId="updateRowId" @after-save="afterSaveUpdatedProd"
                 @after-close="closeUpdateWin"/>
    <update-prod :showFlag="addProd" v-if="addProd" @after-save="afterCreateProd" @after-close="closeCreateWin"/>

  </div>
</template>

<script>
  import CommonTitle from '../common/commonTitle'
  import IssueCommodity from './components/issueCommodity'
  import UpdateProd from './components/UpdateProd'

  export default {
    name: "commodityList", //商品管理--列表
    data() {
      return {
        addProd: false,
        activeIndex: '0', //index--默认全部订单
        tableData: [], //订单表--数据
        publishTime: '0', //发布时间
        productStatus: "0", //商品状态
        tradeType: '0', //发布种类

        page: { //分页
          total: 0, //总数
          currentPage: 1, //当前页
          pageSize: 10, //每页条数
        }, //分页
        updateRowId: 0,
        status: {
          "Y": "已生效",
          "N": "已结束",
          "D": "草稿",
        }
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle, //公共标题
      IssueCommodity, //发布商品
      "update-prod": UpdateProd,
    },

    methods: {
      goodsStatus(status) {

      },
      afterCreateProd() {
        this.addProd = false;
        this.handleGetTableData();
      },
      closeCreateWin() {
        this.addProd = false;
      },
      afterSaveUpdatedProd() {
        this.updateRowId = 0;
        this.handleGetTableData();
      },
      closeUpdateWin() {
        this.updateRowId = 0;
      },
      handleUpdateRowData(id) {
        this.updateRowId = id;
      },
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
          } else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.productStatus = column.filteredValue[0];
          }
        }
        _this.handleGetTableData();
      },

      //menu切换（点击‘全部’、“出售”、“求购”这3个菜单项后，需要重置表格的过滤条件选择）
      handleSelect(key, keyPath) {
        let _this = this;
        _this.$router.push({
          path: 'commodityList',
          query: {
            productStatus: key //1 2 3
          }
        }); 
        //清空其它的查询条件
        _this.publishTime = "0";
        _this.productStatus = "0";
        _this.tradeType = key;
        _this.$refs.tableData.clearFilter(); //清除表格的过滤条件选择
        _this.handleGetTableData(); //获取表数据
      },

      //显示发布商品
      handleShowIssueCommodityDialog() {
        let _this = this;
        //要发布商品，必须先登录
        if (this.checkLogin() == false) {
          return;
        }
        //发布商品前，必须显示设置好地址，否则不能发布。调用地址接口，取1条地址数据。如果能取到，则表示地址设置好了，否则表示地址没设置好
        _this.$axios({
          method: "post",
          url: "/addressManage/list",
          data: {
            status: "1",
            pageIndex: 1, //页数
            pageSize: 10, //条数
          }
        }).then((res) => {
          //判断是否成功获取1条地址数据
          if (res.data.status == 200 && res.data.data.list.length > 0) {
            //显示发布商品的dialog
            _this.addProd = true;
          } else {
            //未设置好地址数据，自动路由到地址信息页面
            this.$alert('操作不能继续，请先完善地址信息', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push("addressMessage");
              }
            });
          }

        })

      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + "/recProduct/list",
          // url: "http://192.168.5.230:8092/recProduct/list",
          data: {
            difference: "1", // 区别
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize, //条数
            productStatus: _this.productStatus, //发布状态
            publishTime: _this.publishTime, //发布时间
            tradeType: _this.tradeType //发布种类
          }
        }).then((res) => {
          _this.page.total = 0;
          _this.tableData = [];
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
        _this.handleGetTableData(); //获取表数据
      },

      handleCurrentChange(val) {
        let _this = this;
        _this.page.currentPage = val;
        _this.handleGetTableData(); //获取表数据
      },

      handleDeleteRowData(id) {
        let _this = this;
        _this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            // url: "/recProduct/delete",
            url: _this.$store.state.recycleAddr + "/recProduct/delete",
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
      handleGoToDetail(row) {
        if (row.productStatus == "D") {
          return;
        }
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
  .commodity-list {
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
  .prod_nav {
    cursor: pointer;
  }

  #content {
    img {
      width: 100px;
      height: 80px;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
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
