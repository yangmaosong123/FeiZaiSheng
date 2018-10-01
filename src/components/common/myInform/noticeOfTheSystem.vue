<template>
  <div class="notice-of-the-system">
    <!-- 公共标题 -->
    <CommonTitle title="系统通知"></CommonTitle>


    <!-- menu切换 -->
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="">全部通知</el-menu-item>
      <el-menu-item index="2">已读</el-menu-item>
      <el-menu-item index="1"> 未读</el-menu-item>
    </el-menu>

    <!--  表格 -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        width="585"
        label="通知标题">
        <template slot-scope="scope">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{scope.row.title}}</div>
            <el-button class="nowrap-system nowrap-h3"
                       type="text"
                       :class="{'unread':scope.row.notificationFlag=='1','read':scope.row.notificationFlag=='2'}"
                       @click="handleGoToSystemDetail(scope.row.id)">
              {{scope.row.title}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.notificationFlag=='1'?'未读':scope.row.notificationFlag=='2'?'已读':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="发送时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDeleteCurrentRowData(scope.row.id)">删除</el-button>
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
  import CommonTitle from '../commonTitle'
  import Event from '../../../assets/js/event'

  export default {
    name: "noticeOfTheSystem",//系统通知
    data() {
      return {
        activeIndex: '',//
        notificationFlag: '',//通知状态
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          currentPage: 1,//页码
          pageSize: 10,//页条数
        },
      };
    },
    components: {
      CommonTitle,//公共标题
    },
    created() {
      let _this = this;
      _this.handleGetTableData();//获取表数据
    },
    methods: {

      //menu切换
      handleSelect(key) {
        let _this = this;
        this.$router.push({
          path: "noticeOfTheSystem",
          query: {
            notificationFlag: key //1 2 3
          }
        }); //根据订单状态显示路由
        _this.notificationFlag = key;
        _this.handleGetTableData();
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/notice/systemNotification",
          data: {
            notificationFlag: _this.notificationFlag,//通知状态
            currentPage: _this.page.currentPage,//页码
            pageSize: _this.page.pageSize,//页条数
          }
        }).then((res) => {
          switch (res.data.status) {
            case  -500:
              _this.tableData = [];
              break;
            case  200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              let totals = [];
              _this.tableData.map(item => {
                if (item.notificationFlag == '1')
                  totals.push(item);
              });
              Event.$emit("getTotal", totals);
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
      },

      //删除当前系统通知消息
      handleDeleteCurrentRowData(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/notice/deleteSystemNotification",
            data: {
              id: id
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: "success",
                  message: "该条通知已成功删除！"
                });
                _this.handleGetTableData();//获取表数据
                break;
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //查看详情
      handleGoToSystemDetail(id) {
        let _this = this;
        _this.$router.push({
          path: "/user/noticeOfTheSystemDetail",
          query: {
            id: id
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .notice-of-the-system {
    .pagination {
      height: 50px;
      padding-top: 10px;
      padding-left: 33%;
    }
    .unread {
      color: #f04844;
    }
    .read {
      color: #666;
    }
  }
</style>
