/**
*@file 产废_危废管理_表格
*@author 周毖强
*/
<template>
  <div class="order-common-attack">

    <!-- 公共标题 -->
    <CommonTitle title="订单管理"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="1">可回收</el-menu-item>
          <el-menu-item index="2"> 不可回收</el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 表格模块 -->
    <div class="order-table background-color">
      <el-table @filter-change="handleFilterChg" ref="tableData" :data="tableData" highlight-current-row
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="width:300px;padding-right:6px;overflow:hidden;border-right:1px solid #ddd;">
              <div style="float:left;">
                <span style="vertical-align:top;">{{props.row.daName}}</span>
                <img style="width:91px;height:75px;vertical-align:top;"
                     :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                     alt="img">
                <span style="vertical-align:top;">{{props.row.daCategory}}/{{props.row.daCode}}</span>
                <span style="vertical-align:top;">地址：{{props.row.province+"/"+props.row.city+"/"+props.row.region+"/"+props.row.address}}</span>
                <span>{{props.row.industrySource}}/{{props.row.dangerousWasteSource}}</span>
              </div>

              <div style="float:right;">
                    <span
                      style="display:block">类型： {{props.row.daType=='1'?'不可回收':props.row.daType=='2'?'可回收':''}}</span>
                <span style="display:block">数量：{{props.row.number}}</span>
                <span style="display:block">单价：{{props.row.price}}</span>
              </div>
              <div style="float:right;">
                <span style="display:block">{{props.row.enterpriseName}}</span>
              </div>
              <div style="float:right;">
                <span style="display:block">{{props.row.orderState==2?'待签约': (props.row.orderState==3?'已签约':(props.row.orderState==4?'待上传备案':(props.row.orderState==5?'待付款':(props.row.orderState==6?'待处置付款':(props.row.orderState==7?'已付款':(props.row.orderState==8?'资金冻结':(props.row.orderState==9?'已运出':(props.row.orderState==10?'派单中':(props.row.orderState==11?'待收货':(props.row.orderState==12?'待收款':(props.row.orderState==13?'资金解冻':(props.row.orderState==14?'已完成':""))))))))))))}}</span>
                <span style="display:block">物流详情</span>
              </div>
              <div style="float:right;">
                <el-button>收藏企业</el-button>
                <el-button v-show="props.row.orderState=='2'" @click="handleConductOrder(props.row.id)">处理</el-button>
              </div>
            </div>
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
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单详情"
          prop="">
          <template slot-scope="scope">
            <span>订单编号：{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="180"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[
          {text: '待签约', value: '2'},
          {text: '待付款', value: '5'},
          {text: '资金冻结', value: '8'},
          {text: '待收货', value: '11'},
          {text: '资金解冻', value: '13'},
          {text: '已完成', value: '14'}
          ]"
          prop="tag">
        </el-table-column>
        <el-table-column
          label="订单操作"
          prop="">
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

    <!-- 签约弹框 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="signDialogFormVisible" width="30%" v-if="signDialogFormVisible">
        <el-form :model="signForm">
          <el-form-item label="上传附件：">
            <el-upload
              class="upload-demo"
              :action="this.$store.state.fileUploadUrl"
              :on-success="handleSuccessGetId">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="signDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSignContract">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'

  export default {
    name: "orderCommonAttack",//订单管理
    data() {
      return {
        activeIndex: '1',//index--默认全部订单
        tableData: [],//订单表--数据
        selectTime: '0',//订单时间
        orderStatus: "0",//订单状态
        daType: '0',//危废种类
        dataRowCount: 0,
        filterValue: [],
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
        signDialogFormVisible: false,
        signForm: {
          id: '',//订单Id
          fileId: '',//附近id
        }

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
        var _this = this;
        _this.selectTime = "0";
        _this.orderStatus = "0";
        for (var index in this.$refs.tableData.columns) {
          var column = this.$refs.tableData.columns[index];
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

      //附件上传成功获取对应id
      handleSuccessGetId(res) {
        let _this = this;
        _this.signForm.fileId = res.data;
        console.log("上传成功后的附件id", _this.form.fileId);
      },

      //menu切换
      handleSelect(key, keyPath) {
        console.log("index", key);
        this.$router.push({
          path: 'wasteProductionEnterprise',
          query: {
            orderStatus: key//1 2 3
          }
        });//根据订单状态显示路由
        this.selectTime = "0";
        this.orderStatus = "0";
        this.handleGetTableData()
      },

      //显示发布订单
      handleShowIssueOrderDialog() {
        this.$refs.ReleaseTheOrderDialog.ShowIssueOrderDialog();
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/orderList",
          data: {
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
            orderStatus: _this.orderStatus, //数据状态(必填)
            selectTime: _this.selectTime,//订单时间
            daType: _this.daType,//危废种类
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.page.total = res.data.data.total;
            _this.tableData = res.data.data.list;

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

      //订单处理
      handleConductOrder(id) {
        let _this = this;
        _this.signDialogFormVisible = true;
        _this.signForm.id = id;
      },

      handleSignContract() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/orderContract",
          data: {
            id: _this.signForm.id,
            attId: _this.signForm.fileId
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.$message({
              type: 'success',
              message: "签收成功！"
            });
            _this.signDialogFormVisible = false;
            this.handleGetTableData(); //获取表数据
          }
        })
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
</style>
<style lang="less" scoped>
  .order-common-attack {
    .form-search {
      position: relative;
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
      .issue-order {
        margin: 6px 6px 0;
      }
      .search-button {
        position: absolute;
        top: 20px;
        right: 10px;
      }
    }
    .order-table {
      position: relative;
      .time-select {
        position: absolute;
        top: 0px;
        left: 80px;
      }
    }
    .pagination-box {
      width: 100%;
      height: 100px;
      background: #fff;
      padding: 20px 25%;
    }
  }
</style>
