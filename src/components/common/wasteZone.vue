<template>
  <div class="waste-zone">
    <div class="title">
      <img src="../../assets/img/index-icon/waste.png"/>
    </div>
    <div class="Broadcast">
      <el-table
        border
        :data="tableData"
        style="width: 100%;font-size: 12px;">
        <el-table-column
          label="需求"
          width="200">
          <template slot-scope="scope">
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                {{scope.row.daName}}
              </div>
              <el-button class="nowrap" type="text">
                {{scope.row.daName}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          width="220">
        </el-table-column>
        <el-table-column
          label="危废类别"
          width="200">
          <template slot-scope="scope">
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                {{scope.row.daCategory}}
              </div>
              <el-button class="nowrap" type="text">
                {{scope.row.daCategory}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="daCode"
          label="代码">
        </el-table-column>
        <el-table-column
          prop="region"
          width="100"
          label="地区">
        </el-table-column>
        <el-table-column
          label="行业"
          width="120">
          <template slot-scope="scope">
            <span>
              {{findConfigItem(scope.row.industrySource,$store.state.dictionary.hyly).title}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="120">
          <template slot-scope="scope">
            <span>{{scope.row.number}}/ {{findConfigItem(scope.row.unit,$store.state.dictionary.unit).title}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'wasteZone',//危废专区
    data() {
      return {
        tableData: [],//表数据
      };
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: '/base/queryProductionRegion',
        }).then((res) => {
          if (res.data.status === 200)
            _this.tableData = res.data.data;
        });
      }
    }
  }
</script>
<style lang="less">
  .waste-zone .el-table th {
    background: #58bf7f;
    color: #fff;
    font-size: 14px;
  }

  .waste-zone {
    margin-top: 50px;
    .title {

      margin-bottom: 20px;
      text-align: center;
    }
    .Broadcast {
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    h2 {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #636363;
      span {
        border-left: 3px solid #208dd6;
        padding-left: 10px;

      }
    }

  }

</style>
