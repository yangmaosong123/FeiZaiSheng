/**
*@file 交易明细
*@author 周毖强
*/
<template>
  <div class="disposal-transaction-detail">

    <!-- 公共标题 -->
    <CommonTitle title="交易明细"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="1"> 不可回收</el-menu-item>
          <el-menu-item index="2">可回收</el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 表格模块 -->
    <div class="order-table-content background-color">
      <el-table @filter-change="handleFilterChg" ref="tableData" :data="tableData"
                highlight-current-row
                :default-expand-all="true"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img
                    :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                    alt="img">
                </div>
              </el-col>
              <el-col :span="6">
                <el-row class="title">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.daName}}
                      </div>
                      <el-button class="nowrap nowrap-h3" type="text"
                      >
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
                          {{ props.row.daCategory }}/{{ props.row.daCode}}
                        </div>
                        <el-button class="nowrap" type="text">
                          {{props.row.daCategory }}/{{props.row.daCode}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content" class="content-style">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </div>
                        <el-button class="nowrap" type="text">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <span style="white-space:normal; word-break:break-all;">
                      地址：{{props.row.province+ props.row.city+props.row.region}}
                    </span>
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="3" class="type">
                <el-row>
                  <span>
                    类型：{{ props.row.daType=='1'?'不可回收': props.row.daType=='2'?'可回收':"" }}
                  </span>
                </el-row>
                <el-row>
                  <span>
                    数量：{{ props.row.number }}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}
                  </span>
                </el-row>
                <el-row>
                  <span>
                    单价：{{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price }}
                  </span>
                </el-row>
              </el-col>
              <el-col :span="5" class="enterprise">
                <span>
                  {{props.row.enterpriseName===''?'——':props.row.enterpriseName  }}
                </span>
              </el-col>

              <el-col :span="4" class="details">
                总额 ：{{'￥'+props.row.payAmount}}
                |
                平台监管
              </el-col>
              <el-col :span="2" class="operation">
                <span>
                  {{props.row.payDirection=='Add'?"收入":props.row.payDirection=='Less'?"支出":""}}
                </span>
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
          :filters="[{text: '半年内', value: 180}, {text: '3个月内', value: 90}, {text: '1个月内', value: 30}]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="危废详情详情"
          width="295"
          prop="">
          <template slot-scope="scope">
            <span>订单编号：{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="产废企业"
          width="200"
          prop="">
        </el-table-column>
        <el-table-column
          label="金额"
          width="180"
          prop="tag">
        </el-table-column>
        <el-table-column
          label="说明"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[
          {text: '收入', value: 'Add'},
          {text: '支出', value: 'Less'}
          ]"
          prop="tag">
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
  import CommonTitle from '../common/commonTitle'

  export default {
    name: "disposalTransactionDetail",//交易明细
    data() {
      return {

        activeIndex: '0',//index--默认全部订单
        tableData: [],//订单表--数据
        selectTime: '0',//订单时间
        orderStatus: "0",//订单状态
        daType: '0',//危废种类

        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页

      };
    },
    created() {
      this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle,//公共标题
    },


    methods: {

      //表过滤
      handleFilterChg(filters) {
        let _this = this;
        _this.selectTime = "0";
        _this.orderStatus = "0";
        for (let index in this.$refs.tableData.columns) {
          let column = this.$refs.tableData.columns[index];
          if (!column.filteredValue || column.filteredValue.length == 0) {
            continue;
          }
          if (column.columnKey && column.columnKey == "filter_date") {
            _this.selectTime = column.filteredValue[0];
          }
          else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.orderStatus = column.filteredValue[0];
          }
        }
        this.handleGetTableData();
      },

      //menu切换
      handleSelect(key, keyPath) {
        this.$router.push({
          path: 'disposalTransactionDetail',//交易明细
          query: {
            orderStatus: key//1 2 3
          }
        });//根据订单状态显示路由
        this.selectTime = "0";
        this.orderStatus = "0";
        this.daType = key;
        this.$refs.tableData.clearFilter();
        this.handleGetTableData();//获取表数据
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/daOrderPayment/list",
          data: {
            daType: _this.daType,//危废种类
            orderStatus: _this.orderStatus, //数据状态(必填)
            selectTime: _this.selectTime,//订单时间
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
          }
        }).then((res) => {
          switch (res.data.status) {
            case  -500:
              _this.tableData = [];
              break;
            case  200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case  300:
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
      }

    }
  };
</script>
<style>
  .order-table-content .el-table__expanded-cell {
    background: #f9f9f9;
    font-size: 12px;
    padding: 20px 20px;
  }

  .el-col {
    padding: 0px;
  }
</style>
<style lang="less" scoped>
  .disposal-transaction-detail {
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
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .enterprise {
      line-height: 90px;
      margin-left: 30px;
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
      padding-left: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :hover {
      overflow: visible;
    }
  }
</style>

