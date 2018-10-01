/**
*@file  产废企业==>>处置结果
*@author 周毖强
*/
<template class="action-result">
  <div class="action-result">

    <!-- 公共标题 -->
    <CommonTitle title="处置结果"></CommonTitle>

    <!-- 表数据 -->
    <div class="action-result-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="date"
          label="日期"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="250">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="recommended-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[100, 200, 300, 400]"
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
    name: "actionResults",//处置结果
    data() {
      return {
        tableData: [],//表数据
        page: {//分页
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },
      };
    },
    components: {
      CommonTitle,//公共标题
    },
    created() {
    },
    methods: {
      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.pageNum = val;
      }
    }
  };
</script>
<style>
.recommended-pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 55%;
    }
</style>

<style lang="less" scoped>

</style>
