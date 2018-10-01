<template>
  <div class="join-us">
    <img src="../../../assets/img/introduction.jpg" alt="" style="width: 100%; min-width: 1366px;">
    <div class="main">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class=""><p v-html="props.row.content"></p></div>
              </template>
            </el-table-column>
            <el-table-column
              label="招聘职位"
              prop="postName">
            </el-table-column>
            <el-table-column
              label="部门名称"
              prop="departmentName">
            </el-table-column>
            <el-table-column
              label="工作地址"
              prop="workingPlace">
            </el-table-column>
            <el-table-column
              label="地区">
              <template slot-scope="scope">
                <span>{{scope.row.provinceId}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="招聘人数"
              prop="recruitsNum">
            </el-table-column>
            <el-table-column
              label="发布日期"
              prop="createTime">
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

        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'joinUs',//关于我们--加入我们
    data() {
      return {
        tableData: [],//表数据
        provinceIds: [],
        activeNames: ['1'],//
        page: {//分页
          total: "",//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页
      };
    },
    created() {
      let _this = this;
      _this.handleGetJoinUsData();//获取加入我们数据
      _this.handleGetProvinceIdData();//获取地区数据
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },

      //获取地区数据
      handleGetProvinceIdData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: 'qy',
            parentId: 0
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.provinceIds = res.data.data;
              for (let i = 0; i < _this.provinceIds.length; i++) {
                for (let j = 0; j < _this.tableData.length; j++) {
                  if (_this.provinceIds[i].id == _this.tableData[j].provinceId)
                    _this.tableData[j].provinceId = _this.provinceIds[i].title;
                }
              }
              break;
          }
        })
      },

      //获取企业推荐数据
      handleGetJoinUsData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/joinOur",
          data: {
            pageNum: _this.page.currentPage,
            pageSize: _this.page.pageSize
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.page.total = res.data.data.total;
            _this.tableData = res.data.data.list;
          }
        });
      },

      //分页事件
      handleSizeChange(val) {
        let _this = this;
        _this.page.pageSize = val;
        _this.handleGetJoinUsData();//获取企业推荐数据
      },
      handleCurrentChange(val) {
        let _this = this;
        _this.page.currentPage = val;
        _this.handleGetJoinUsData();//获取企业推荐数据
      },
    }
  };
</script>
<style>
  .pagination {
    padding-top: 11px;
    height: 50px;
    line-height: 50px;
    padding-left: 30%;
  }
</style>


<style>
  .join-us {
  }
</style>
