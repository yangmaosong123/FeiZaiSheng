<template>
  <div class="disposition-enterprise-dialog">
    <el-dialog
      title="选择处置企业"
      :visible.sync="dialogVisible"
      width="50%">

      <!-- 搜索表单 -->
      <el-form :model="searchRuleForm"
               :rules="searchRuleFormRules"
               ref="searchRuleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="企业搜索：" prop="keyword" class="form-item">
          <el-input v-model="searchRuleForm.keyword"
                    placeholder="请输入搜索关键字"
                    style="width:600px;"
                    @keyup.enter.native="handleKeyUpEnter($event)"></el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="handleQueryKeyword()">搜索
          </el-button>
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

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "dispositionEnterpriseDialog",//处置企业--弹框
    data() {
      return {
        dialogVisible: false,//发布订单弹框--默认隐藏
        searchRuleForm: {//搜索表单--数据
          keyword: "",//搜索关键字
        },
        searchRuleFormRules: {//搜索表单--验证规则
          keyword: [
            {
              required: true,
              message: '请输入搜索关键字',
              trigger: 'blur'
            }
          ]
        },
        tableData: [],//表格
        multipleSelection: [],
        page: {
          total: 0,//总数
          pageNum: 10,//每页条数
          currentPage: 1,//当前页
        }
      };
    },
    methods: {

      //显示弹框
      handlerShowDialog() {
        this.dialogVisible = true;
        this.handleLoadingTableData();//加载表数据
      },

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
      },

      //搜索
      handleQueryKeyword() {
        this.handleLoadingTableData();//加载表数据
      },
      //键盘搜索
      handleKeyUpEnter(event) {
        if (event.keyCode === 13)
          this.handleLoadingTableData();//加载表数据
      },

      //表格事件
      handleSelectionChange(val) {
        this.multipleSelection = val.map((item, index) => item.id);

        console.log("你已经选择了：" + this.multipleSelection);
      },

      //分页事件
      handleSizeChange(val) {
        this.page.pageNum = val;
        this.handleLoadingTableData();//加载表数据
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.handleLoadingTableData();//加载表数据
      }
    }
  };
</script>
<style lang="less" scoped>
  .disposition-enterprise-dialog {
    .form-item {
      display: inline-block;
    }
    .pagination-box {
      height: 50px;
      margin: 20px;
      position: relative;
      .pagination {
        position: absolute;
        right: 0;
        bottom: 10px;
      }
    }
  }
</style>
