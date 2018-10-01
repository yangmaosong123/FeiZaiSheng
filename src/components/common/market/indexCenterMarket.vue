<template>
  <div class="index-center-market">
    <div class="title clearfix">
      <img src="../../../assets/img/index-icon/market.png">
      <el-button type="text" class="button" @click="handleGoToMore">更多<i class="el-icon-d-arrow-right"></i></el-button>
    </div>
    <div class="content clearfix">
      <ul class="plastic-data">
        <li class="nowrap-detail item"
            v-for="item in plasticMarketCenter"
            :key="item.id"
            @click="handleLookDetail(item)">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{item.title}}</div>
            <el-button class="nowrap-detail-index nowrap-h3"
                       type="text"
                       @click="handleLookDetail(item)"
                       style="color:#606266;font-weight:normal;">
              {{item.title}}
            </el-button>
          </el-tooltip>
        </li>
      </ul>
      <ul class="spare-data">
        <li class="nowrap-detail item"
            v-for="item in spareMarketCenter"
            :key="item.id"
            @click="handleLookDetail(item)">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{item.title}}</div>
            <el-button class="nowrap-detail-index nowrap-h3"
                       type="text" @click="handleLookDetail(item)"
                       style="color:#606266;font-weight:normal;">
              {{item.title}}
            </el-button>
          </el-tooltip>
        </li>
      </ul>

    </div>
  </div>
</template>
<script>
  export default {
    name: "indexCenterMarket",//首页行情
    data() {
      return {
        plasticMarketCenter: [],//塑料行情数据
        spareMarketCenter: [],//零配件行情数据
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取行情数据
    },
    methods: {

      //获取行情数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/marketCenter"
        }).then((res) => {
          if (res.data.status === 200) {
            console.log("首页");
            res.data.data.map(item => {
              if (item.itemCode == 'fg')
                _this.plasticMarketCenter = item.list.slice(0, 6);
            });
            res.data.data.map(item => {
              if (item.itemCode == 'fjdc')
                _this.spareMarketCenter = item.list.slice(0, 6);
            });
          }
        });
      },

      //查看详情
      handleLookDetail(item) {
        let _this = this;
        _this.$router.push({
          path: 'marketCenterDetails',
          query: {
            id: item.id
          }
        });
      },

      //查看更多
      handleGoToMore(itemCode) {
        let _this = this;
        _this.$router.push({path: '/marketCenter'});
      },

    }
  };
</script>
<style lang="less" scoped>
  .index-center-market {
    background: #fff;
    float: right;
    width: 510px;
    height: 293px;
    border-top: 2px solid #4c67ea;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    .title {
      height: 30px;
      line-height: 30px;
      img {
        float: left;
        padding: 10px 0 0 20px;
      }
      .button {
        float: right;
        color: #666;
        margin-right: 20px;
      }
      .button:hover {
        cursor: pointer;
        color: #208dd6;
      }
    }
    .plastic-data, .spare-data {
      width: 255px;
      padding: 20px 15px;
      .item {
        margin-top: 10px !important;
        margin-bottom: 13px;
        &:first-child {
          margin-top: 0;
        }
        &:hover {
          cursor: pointer;
          color: #208dd6;
        }
      }
    }
    .plastic-data {
      float: left;
    }
    .spare-data {
      float: right;

    }
  }
</style>
