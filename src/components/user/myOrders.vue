<template>
  <div class="order-details">

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: "myOrders",//订单
    data() {
      return {
        tableData: [],//表数据
        //分页数据
        page: {
          pageNum: 1,//当前页
          pageSize: 10,//每页条数
          total: 10,//总条数
        },
        multipleSelection: []
      }
    },
    created() {
      this.handlerGetLoadingTableData(); //产废收到报价列表查询
    }
    ,
    methods: {

      //产废收到报价列表查询
      handlerGetLoadingTableData() {
        this.$axios({
          method: "post",
          url: "/order/orderList",
          data: {
            pageNum: this.page.pageNum,
            pageSize: this.page.pageNum,
          }
        }).then((res) => {
          if (res.data.status === 200) {
            this.page.total = res.data.data.total;
            this.tableData = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        });
      },

      //全选--半选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  };
</script>
<style lang="less" scoped>
  .order-details {

  }
</style>
