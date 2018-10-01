<template>
  <div class="information-recommendation">
    <img src="../../assets/img/news.jpg" alt="" style="width: 100%; min-width: 1366px;">
    <div class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="资讯" name="first">

          <!--资讯-->

          <article class="news" v-for="item in newsList" :key="item.id">
            <el-row>
              <el-col :span="20">
                <h3 @click="handleGoToRowInformationDetail(item.id)">{{item.title}}</h3>
              </el-col>
              <el-col :span="4">
                <p class="date">{{item.createDate}}</p>
              </el-col>
            </el-row>
          </article>


          <!-- 分页 -->
          <el-pagination
            class="pagination"
            @size-change="handleInformationSizeChange"
            @current-change="handleInformationCurrentChange"
            :current-page="informationPage.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="informationPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="informationPage.total">
          </el-pagination>

        </el-tab-pane>
        <el-tab-pane label="公告" name="second">

          <article class="news" v-for="item in noticeList" :key="item.id">
            <el-row>
              <el-col :span="20">
                <h3 @click="handleGoToRowInformationDetail(item.id)">{{item.title}}</h3>
              </el-col>
              <el-col :span="4">
                <p class="date">{{item.createDate}}</p>
              </el-col>
            </el-row>
          </article>

          <!-- 分页 -->
          <el-pagination
            class="pagination"
            @size-change="handleInformationSizeChange"
            @current-change="handleInformationCurrentChange"
            :current-page="noticePage.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="noticePage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="noticePage.total">
          </el-pagination>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'informationRecommendation',//资讯
    data() {
      return {
        activeName: 'first',
        newsList: [],//资讯--数据
        informationPage: {//资讯--分页
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10//页条数
        },
        noticeList: [],//公告--数据
        noticePage: {//公告--数据
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10//页条数
        },
      };
    },
    watch: {
      activeName(val) {
        if (val == 'first') {
          this.activeName = val;
          this.handleGetInformationTableData(); //获取资讯数据
        } else {
          this.activeName = val;
          this.handleGetNoticeTableData(); //获取资讯数据
        }
      }
    },
    created() {
      let _this = this;
      _this.handleGetInformationTableData(); //获取资讯数据
      if (_this.$route.query.type == 'second') {
        _this.activeName = 'second';
        _this.handleGetNoticeTableData();
      } else {
        _this.activeName = 'first';
        _this.handleGetInformationTableData(); //获取资讯数据
      }
    },
    methods: {

      //获取资讯数据
      handleGetInformationTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/homePageRecomList",
          data: {
            moduleCode: "info",//资讯
            pageNum: _this.informationPage.pageNum,
            pageSize: _this.informationPage.pageSize
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.informationPage.total = res.data.data.total;
              _this.newsList = res.data.data.list;
              console.log("_thios.newsList", _this.newsList);
              break;
            case 300:
              _this.newsList = [];
              break;
          }
        });
      },

      //资讯--分页
      handleInformationSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.informationPage.pageSize = val;
        this.handleGetInformationTableData(); //获取资讯数据
      },

      handleInformationCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.informationPage.currentPage = val;
        this.handleGetInformationTableData(); //获取资讯数据
      },

      //资讯标题点击
      handleGoToRowInformationDetail(id) {
        let _this = this;
        _this.$router.push({
          path: '/informationDetail',
          query: {
            id: id
          }
        });
      },

      //获取公告数据
      handleGetNoticeTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/homePageRecomList",
          data: {
            moduleCode: "notice",//资讯
            pageNum: _this.noticePage.pageNum,
            pageSize: _this.noticePage.pageSize
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.noticePage.total = res.data.data.total;
              _this.noticeList = res.data.data.list;
              break;
            case 300:
              _this.noticeTableData = [];
              break;
          }
        });
      },

      //公告--分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.noticePage.pageSize = val;
        this.handleGetNoticeTableData(); //获取公告数据
      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.noticePage.currentPage = val;
        this.handleGetNoticeTableData(); //获取公告数据
      },

      //tab切换
      handleClick(tab, event) {
        console.log(tab, event);
        let _this = this;
        if (tab.name == 'first') {
          _this.$router.push({
            query: {
              type: tab.name
            }
          });
          _this.handleGetInformationTableData();
        }
        else if (tab.name == 'second') {
          _this.$router.push({
            query: {
              type: tab.name
            }
          });
          _this.handleGetNoticeTableData();
        }
      },
    }
  };
</script>
<style lang="less" scoped>
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

  .el-tabs__item {
    font-size: 16px;
    height: 60px;
    line-height: 60px;

  }

  .el-pagination {
    padding-top: 11px;
    height: 50px;
    line-height: 50px;
    padding-left: 60%;
  }

</style>
<style lang="less" scoped>
  .news {
    border-bottom: 2px dashed #d8d8d8;
    h3 {
      font-size: 14px;
      color: #333;
      padding-top: 10px;
    }
    h3:hover {
      cursor: pointer;
      color: #208dd6;
    }
    p {
      font-size: 14px;
    }
    .date {
      color: #999;
    }
  }

</style>
