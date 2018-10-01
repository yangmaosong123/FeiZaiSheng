<template>
  <div class="order-common-attack">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        label="企业名称">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGoToDetail(scope.row.extField2)">{{scope.row.extField}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="企业信誉"
        width="120">
        <template slot-scope="scope">
          <span>优秀</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="收藏时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDeleteEnterprise(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
    name: 'enterpriseCollection',//企业收藏
    data() {
      return {
        tableData: [],//企业收藏--数据
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
      };
    },
    created() {
      this.handleGetTableData();//获取表数据
    },
    methods: {

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/enterpriseCollectionList",
          data: {
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
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

      //删除
      handleDeleteEnterprise(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/deleteEnterpriseCollection",
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
      //查看企业详情
      handleGoToDetail(extField2) {
        let _this = this;
        _this.$router.push({
          path: '/clickToEnter',
          query: {id: extField2}
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .order-common-attack {
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
      padding-left: 40%;
    }
  }
</style>
