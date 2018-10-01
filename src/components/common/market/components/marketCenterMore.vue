<template>
  <div class="market-center-more">
    <div class="main">
      <div class="content" v-for="item in details" :key="item.id">
        <el-row>
          <el-col :span="20">
            <h3 @click="handleLookDetail(item.id)">{{item.title}}</h3>

          </el-col>
          <el-col :span="4">
            <p>发布日期：{{item.createDate}}</p>
            <p>所属分类：
              {{findConfigItem(item.itemCode,$store.state.dictionary.hszl).title}}
            </p>
          </el-col>
        </el-row>
        <!--<div v-html="item.content" class="text"></div>-->
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
  </div>
</template>
<script>
  export default {
    name: 'marketCenterMore',//行情详情
    data() {
      return {
        details: [], //资讯详情--数据
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
      };
    },
    created() {
      this.handleGetDetailInfo(); //获取详情信息
    },

    methods: {

      //获取详情信息
      handleGetDetailInfo() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/moreMarketCenter",
          data: {
            moduleCode: _this.$route.query.moduleCode,
            pageNum: _this.page.currentPage,
            pageSize: _this.page.pageSize
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.page.total = res.data.data.total;
            _this.details = res.data.data.list;
          }
        });
      },
      //查看详情
      handleLookDetail(id) {
        let _this = this;
        _this.$router.push({
          path: 'marketCenterDetails',
          query: {
            id: id
          }
        });
      },

      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetDetailInfo();//获取表数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.handleGetDetailInfo();//获取表数据
      },
    }
  }
  ;
</script>
<style lang="less" scoped>
  .market-center-more {
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
      padding-top: 30px;
      height: 80px;
      line-height: 80px;
      padding-left: 60%;
    }
  }
</style>
<style lang="less" scoped>
  .content {
    border-bottom: 2px dashed #d8d8d8;
    h3 {
      font-size: 16px;
      color: #333;
      padding-top: 28px;

    }
    h3:hover {
      cursor: pointer;
      color: #208dd6;
    }
    p {
      font-size: 14px;
      color: #666;
    }

    .date {
      color: #999;
    }
  }

</style>
