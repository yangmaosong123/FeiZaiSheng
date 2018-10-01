/**
*@file 处置结果 ==>> 处置企业
*@author 周毖强
*/
<template>
  <div class="order-common-attack">

    <!-- 公共标题 -->
    <CommonTitle title="处置企业"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="1">全部合同</el-menu-item>
        </el-menu>
      </div>

      <!-- 搜索表单 -->
      <div class="search-right-content fl">
        <el-form :model="ruleForm">
          <el-form-item prop="name" class="form-item-display">
            <el-input v-model="ruleForm.name" style="width:240px;"></el-input>
          </el-form-item>
          <el-form-item prop="name" class="form-item-display">
            <el-button type="success" placeholder="请输入搜索关键字">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>

    <!-- 表格模块 -->
    <div class="order-table background-color">
      <el-table :data="tableData" highlight-current-row style="width: 100%" class="order-table-self">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item>
                <div class="">
                  <img src="../../assets/img/logo.png" alt="">
                  <span style="width:40px;height:40px;color:red;">此处为标题</span>
                  <span style="width:40px;height:40px;color:red;">数量：  x300 吨</span>
                  <span style="width:40px;height:40px;color:red;">单价：￥150.00~180.00</span>
                  <span style="width:40px;height:40px;color:red;">订单时效：1年</span>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="">
                  <span>湖北三雄科技发展有限公司</span>
                  <img src="" alt="">
                </div>
              </el-form-item>
              <el-form-item>
                <div class="">
                  <span>生效中</span>
                  <span>剩余100吨</span>
                </div>
              </el-form-item>
              <el-form-item>
                <div>
                  <el-button type="danger">查看结果</el-button>
                  <el-button type="danger">删除</el-button>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="近三个月发布的订单"
          prop="">
          <template slot-scope="scope">
            <span>{{scope.row.deadtime}}</span>
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
          prop="">
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

  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'

  export default {
    name: "actionWasteDisposal",//处置企业
    data() {
      return {
        activeIndex: '1',//index--默认全部订单
        ruleForm: {//搜索表单
          name: "",//搜索关键字
        },
        tableData: [],//订单表--数据
        page: {
          total: 1,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        }//分页

      };
    },
    created() {
      this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle,//公共标题
    },
    methods: {

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/orderList",
          data: {
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
            status: "1" //数据状态(必填)
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            _this.page.total = res.data.data.total;
            _this.tableData = res.data.data.list;
          }
        })
      },

      //menu切换
      handleSelect(key, keyPath) {
        console.log("index", key);
        this.handleGetTableData(key)
      },
      //显示发布订单弹框
      handleOpenIssueOrderFormDialog() {
        this.$refs.IssueOrderFormDialog.handleShowDialog();
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
    .order-table {

    }
    .pagination-box {
      width: 100%;
      height: 100px;
      background: #fff;
      padding: 20px 25%;
    }
  }
</style>
