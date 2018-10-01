/**
*@file  产废_报价管理_合作
*@author 周毖强
*/
<template>
  <div class="order-common-attack">

    <!-- 公共标题 -->
    <CommonTitle title="危险废品"></CommonTitle>

    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="">全部</el-menu-item>
      <el-menu-item index="1">不可回收</el-menu-item>
      <el-menu-item index="2">可回收</el-menu-item>
    </el-menu>

    <!-- 表格模块 -->
    <div class="time-order-table background-color">
      <el-table
        @filter-change="handleFilterChg"
        ref="tableData"
        highlight-current-row
        :default-expand-all="true"
        style="width: 100%"
        :data="tableData">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img @click="handleGoToWasteDetail(props.row)"
                       :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                       :alt="'img'+props.row.id">
                </div>
              </el-col>
              <el-col :span="5">
                <el-row class="title">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.daName}}
                      </div>
                      <el-button @click="handleGoToWasteDetail(props.row)" class="nowrap nowrap-h3" type="text">
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
                        <el-button @click="handleGoToWasteDetail(props.row)" class="nowrap" type="text">
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
                        <el-button @click="handleGoToWasteDetail(props.row)" class="nowrap" type="text">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <span style="white-space:normal; word-break:break-all;">
                      地址：{{ props.row.province+ props.row.city+props.row.region}}
                    </span>
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="4" class="type">
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
                    单价：{{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price}}
                  </span>
                </el-row>

              </el-col>
              <el-col :span="6" class="enterprise">
                <span>{{props.row.enterpriseName===''?'——':props.row.enterpriseName  }}</span>
              </el-col>

              <el-col :span="2" class="details">
                {{findConfigItem(props.row.selected,$store.state.dictionary.qdzt).title}}
              </el-col>
              <el-col :span="4" class="operation">
                <el-button type="text" size="small"
                           v-show="props.row.state=='0'"
                           @click="handleCooperationShowDialog(props.row)">
                  确定报价
                </el-button>
                <el-button type="text" size="small"
                           disabled
                           v-show="props.row.state=='1'">
                  已报价
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.state=='1' &&  props.row.selected=='Y'"
                           @click="handleShowDialog(props.row)">报价详情
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="220"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[{text: '半年内', value: 180}, {text: '3个月内', value: 90}, {text: '1个月内', value: 30}]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="危废详情" width="280">
          <template slot-scope="scope">
            <span>订单编号:{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="处置企业" width="220">
        </el-table-column>
        <el-table-column
          label="状态"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[{text: '待确定', value: 'N'}, {text: '已确定', value: 'Y'}]"
          prop="tag"
        >
        </el-table-column>
        <el-table-column prop="" width="150" label="操作">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-box">
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

    <!-- 订单报价 -->
    <el-dialog title="订单报价" :visible.sync="dialogFormVisible" width="30%" v-if="dialogFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="报价说明：">
          <el-input type="textarea" v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="附件1：">
          <a :href="$store.state.fileDownloadUrl+form.attachmentId">{{form.attachmentName}}</a>
          <!--<img width="100%"-->
          <!--:src="$store.state.outputImgByIdUrl+form.attachmentId "-->
          <!--class="avatar">-->
        </el-form-item>
        <el-form-item label="单价：">
          <el-input v-model="'￥'+form.count" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 确定合作 -->
    <el-dialog title="订单报价" :visible.sync="cooperationDialogFormVisible" width="50%"
               v-if="cooperationDialogFormVisible">
      <el-table
        :data="cooperationTableData"
        style="width: 100%">
        <el-table-column
          label="处置企业"
          width="180">
          <template slot-scope="scope">
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">{{scope.row.enterpriseName}}</div>
              <el-button class="nowrap" type="text">
                {{scope.row.enterpriseName}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="offerTime"
          label="报价时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="单价">
          <template slot-scope="scope">
            <span>{{scope.row.status=='1'?'已报价：'+"￥"+scope.row.extField:scope.row.status=='0'?"未报价":""}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.dataStatus=='2'" type="text">已中标
            </el-button>
            <el-button v-else v-show="scope.row.extField" type="text"
                       @click="handleNotarizeOrder(scope.row)">确认合作
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box1">
        <el-pagination
          class="pagination1"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="page1.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page1.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'

  export default {
    name: "theOfferSystemRecommended",//危险废品
    data() {
      return {
        activeIndex: "",//
        tableData: [],//表数据--外
        cooperationTableData: [],//弹表数据
        daType: "",//危废类型
        selectTime: '',//订单时间
        orderStatus: "",//订单状态
        page: {
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
        page1: {
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
        url: this.$store.state.fileDownloadUrl,//下载地址
        dialogFormVisible: false,//报价弹框--false
        cooperationDialogFormVisible: false,//确定合作--false
        form: {
          name: "",//报价说明
          attachmentName: "",//附件名称
          attachmentId: "",//附件id
          count: "",//报价总额
        },//form数据

      };
    },
    created() {
      this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle,//公共标题
    },
    methods: {

      //表数据过滤
      handleFilterChg(filters) {
        let _this = this;
        _this.selectTime = "";
        _this.orderStatus = "";
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
        _this.handleGetTableData();
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/get",
          data: {
            companyId: 0,
            daType: _this.daType,//危废类型
            quotationPeriod: _this.selectTime,//报价时段
            pageNum: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
            selected: _this.orderStatus//是否选中
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
        });
      },

      //menu切换
      handleSelect(key, keyPath) {
        console.log("index", key);
        this.$router.push({
          path: 'theOfferSystemRecommended',
          query: {
            orderStatus: key//1 2 3
          }
        });//根据订单状态显示路由
        this.daType = key;
        this.selectTime = "";
        this.orderStatus = "";
        this.$refs.tableData.clearFilter();
        this.handleGetTableData()
      },

      // 分页
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.handleGetTableData(); //获取表数据
      },

      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.handleGetTableData(); //获取表数据
      },

      //显示报价弹框
      handleShowDialog(row) {
        let _this = this;
        _this.form.name = "";
        _this.form.attachmentName = "";
        _this.form.attachmentId = "";
        _this.form.count = "";
        _this.dialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/order/orderOfferView",
          data: {
            id: row.id
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.form.name = res.data.data[0].offerExplain;
            _this.form.attachmentName = res.data.data[0].attachmentName;
            _this.form.attachmentId = res.data.data[0].id;
            _this.form.count = res.data.data[0].extField;
          }
        })
      },

      //显示确定合作弹框
      handleCooperationShowDialog(row) {
        let _this = this;
        _this.cooperationDialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/order/establishCooperation",
          data: {
            id: row.id,
            pageNum: _this.page1.currentPage,//页码
            pageSize: _this.page1.pageSize,//页条数
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.page1.total = res.data.data.total;
            _this.cooperationTableData = res.data.data.list;
          }
        })
      },

      // 分页
      handleSizeChange1(val) {
        this.page1.pageSize = val;
        this.handleCooperationShowDialog(); //获取表数据
      },

      handleCurrentChange1(val) {
        this.page1.currentPage = val;
        this.handleCooperationShowDialog(); //获取表数据
      },

      //确认合同
      handleNotarizeOrder(row) {
        let _this = this;
        _this.$confirm("确定与该企业合作吗？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: "取消"
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/order/orderOfferRealy",
            data: {
              id: row.id
            }
          }).then((res) => {
            if (res.data.status === 200) {
              _this.$message({
                type: "success",
                message: "确认成功！"
              });
              _this.cooperationDialogFormVisible = false;
              this.handleGetTableData(); //获取表数据
            }
          })
        });
      },

      //报价时段
      handleTimeChange(value) {
        let _this = this;
        _this.quotationPeriod = value;
        _this.handleGetTableData();//获取table数据
      },

      //报价状态
      handleStatusChange(value) {
        let _this = this;
        _this.orderStatus = value;
        _this.handleGetTableData();//获取table数据
      },

      //查看商品详情
      handleGoToWasteDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/wasteDetail',
          query: {
            id: row.productId,
            tradeType: row.daType,
            companyId: row.productCompanyId
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

  .order-table-self.el-table td {
    padding: 0;
  }

  .time-order-table .el-table__expanded-cell {
    background: #f9f9f9;
    font-size: 12px;
    padding: 20px 20px;
  }

  .time-order-table .el-col {
    padding: 0;
  }
</style>
<style lang="less" scoped>
  .order-common-attack {
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
    .time-order-table {
      margin-top: 10px;
      position: relative;
      .time-select {
        width: 160px;
        position: absolute;
        top: 1px;
        left: 120px;
        z-index: 100;
      }
      .status-select {
        width: 100px;
        position: absolute;
        top: 2px;
        right: 250px;
        z-index: 100;
      }
    }
    .pagination-box {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 33%;
    }
    .pagination-box1 {
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
    }
    .type {
      padding-top: 25px;
      display: inline-block;
      width: 100px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .enterprise {
      line-height: 90px;
      padding-left: 20px;
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
      padding-left: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :hover {
      overflow: visible;
    }

  }
</style>
