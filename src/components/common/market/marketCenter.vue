<template>
  <div class="market-center">
    <div class="main">
      <el-row id="content">
        <el-col :span="7">
          <a :href="advertising.extField" target="_blank">
            <img v-if="!advertising.extField2" src="../../../assets/img/spareparts.jpg">
            <img
              v-else
              style="width:342px;height:433px;"
              :src="$store.state.outputImgByIdUrl+advertising.extField2"
              :alt="'img'+advertising.extField2">
          </a>
        </el-col>

        <el-col :span="15">
          <div class="exhibition">
            <el-card class="box-card" v-for="item in types">
              <div slot="header" class="clearfix">
                <span
                  style="width:100px;font-size: 16px;font-weight: bold;color: #208dd6;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.title}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleGoToMore(item.itemCode)">更多
                </el-button>
              </div>
              <ul type="">
                <li v-for="current in item.list" :key="current.id" class="text item">
                  <span @click="handleLookDetail(current.id)" v-html="'•'+current.title"></span>
                </li>
              </ul>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>


  </div>
</template>
<script>
  export default {
    name: 'marketCenter',//行情中心
    data() {
      return {
        advertising: {},//广告图片
        imgData: [],//图片
        tableData: [],
        types: [],
      };
    },
    created() {
      let _this = this;
      _this.getCarousel(); //初始化轮播图数据
      _this.handleGetPhoneData(); //获取左侧图片数据
      _this.handleGetTableData(); //获取数据
    },
    methods: {

      //初始化轮播图数据
      getCarousel() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/advertisment"
        }).then((res) => {
          res.data.data.map(item => {
            if (item.itemCode == "mark1") _this.advertising = item;
          });
        });
      },

      //获取左侧图片数据
      handleGetPhoneData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/marketCenterMap",
        }).then((res) => {
          if (res.data.status === 200) {
            _this.imgData = res.data.data;
          }
        });
      },

      //获取数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/marketCenter",
          data: ""
        }).then((res) => {
          if (res.data.status === 200) {
            _this.types = res.data.data;
          }
        });
      },

      //查看更多
      handleGoToMore(itemCode) {
        let _this = this;
        _this.$router.push({
          path: '/marketCenterMore',
          query: {
            moduleCode: itemCode
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
      }

    }
  };
</script>


<style lang="less" scoped>
  #content {
    background: #ffffff;
    padding: 10px;
    img {
      width: 342px;
      height: 433px;
      margin-top: 25px;
    }
    .box-card {
      width: 320px !important;
      box-shadow: none;
      border: none;
      height: 440px;
      display: block;
      li {
        padding-top: 5px;
        margin-bottom: 0px !important;
        list-style: disc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        width: 320px !important;
        font-size: 14px;
        color: #666;

      }
      span:hover {
        cursor: pointer;
        color: #208dd6;
      }
    }
    .el-card__body {
      padding: 20px;
    }

    .textitem {
      font-size: 12px;
    }
    .exhibition {

      margin-left: 20px;
      overflow: hidden;
    }
    .exhibition .box-card:nth-child(odd) {
      float: left;
    }
    .exhibition .box-card:nth-child(even) {
      float: right;
    }
  }
</style>
