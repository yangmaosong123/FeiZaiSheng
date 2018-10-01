/**
*@file 产废_危废管理_发布-选择处置企业
*@author 周毖强
*/
<template>
  <div class="selective-disposal-enterprise">
    <!-- 搜索表单 -->
    <el-form :model="searchRuleForm"
             ref="searchRuleForm"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="企业搜索：" class="form-item" style="display:inline-block;">
        <el-input v-model="searchRuleForm.keyword"
                  placeholder="请输入搜索关键字"
                  @keyup.enter.native="handleKeyUpEnter($event)"></el-input>
      </el-form-item>
      <el-form-item class="form-item" style="display:inline-block;">
        <el-button type="primary" @click="handleQueryKeyword()">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="enterpriseName"
        label="企业名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop=""
        label="企业信誉"
        width="120">
      </el-table-column>
      <el-table-column
        prop="registrationTime"
        label="注册时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="companyProperties"
        label="公司性质"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="registrationCapital"
        label="企业规模"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: "SelectiveDisposalEnterprise",//产废_危废管理_选择处置企业
    data() {
      return {

        searchRuleForm: {//搜索表单--数据
          keyword: "",//搜索关键字
          multipleSelection: [],//公司id集合
        },

        tableData: [],//表格

        page: {//分页
          total: 0,//总数
          pageNum: 5,//每页条数
          currentPage: 1,//当前页
        },
      };
    },
    components: {},
    created() {
      this.handleLoadingTableData();//加载表数据
    },
    methods: {

      //加载表数据
      handleLoadingTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/selectCompanyEnter",
          data: {
            enterpriseName: this.searchRuleForm.keyword,//搜索关键字
            pageIndex: this.page.currentPage,//当前页
            pageSize: this.page.pageNum,//每页条数
            latitude: "",
            longitude: ""
          }
        })
          .then((res) => {
            if (res.data.status === 200) {
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              console.log("表格数据", _this.tableData);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      ,

      //搜索
      handleQueryKeyword() {
        this.handleLoadingTableData();//加载表数据
      }
      ,
      //键盘搜索
      handleKeyUpEnter(event) {
        if (event.keyCode === 13)
          this.handleLoadingTableData();//加载表数据
      }
      ,

      //表格事件
      handleSelectionChange(val) {
        this.searchRuleForm.multipleSelection = val.map((item, index) => item.id);
        console.log("你已经选择了：" + this.searchRuleForm.multipleSelection);
      }
      ,

      //分页事件
      handleSizeChange(val) {
        this.page.pageNum = val;
        this.handleLoadingTableData();//加载表数据
      }
      ,
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.handleLoadingTableData();//加载表数据
      }
    }
  };
</script>
<style lang="less" scoped>
  .selective-disposal-enterprise {
  }
</style>
