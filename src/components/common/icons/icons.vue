<template>
  <div class="icons">
    <!-- <div class="title"><img src="../../../assets/img/icon2.png"/>
      <div class="line"></div>
    </div> -->
    <el-row>

      <!-- 服务流程 -->
      <el-col span="6" class="service-one" @click="handleGoToProcess('serviceProcess')">
        <div class="tupian1" @click="handleGoToProcess('serviceProcess')">
          <div class="icon1"></div>
        </div>
        <span @click="handleGoToProcess('serviceProcess')">
            服务流程
          </span>
        <!-- <p>明确服务组织使命、宗旨战略规划、目标要求</p> -->
      </el-col>

      <!-- 回收流程 -->
      <el-col span="6" class="service-one" style="margin-left:50px; " @click="handleGoToProcess('recycleProcess')">
        <div class="tupian2" @click="handleGoToProcess('recycleProcess')">
          <div class="icon2"></div>
        </div>
        <span @click="handleGoToProcess('recycleProcess')">
            回收流程
          </span>
        <!-- <p>明确服务组织使命、宗旨战略规划、目标要求</p> -->
      </el-col>


      <!-- 危废处理 -->
      <el-col span="6" class="service-one" style="margin-left:50px; " @click="handleGoToProcess('wasteProcess')">
        <div class="tupian3" @click="handleGoToProcess('wasteProcess')">
          <div class="icon3"></div>
        </div>
        <span @click="handleGoToProcess('wasteProcess')">
            危废流程
          </span>
        <!-- <p>废物的再循环利用回收能源和资源</p> -->
      </el-col>


      <!-- 服务产品 -->
      <el-col span="6" class="service-one" style="margin-left:50px; " @click="handleGoToProcess('serviceProduct')">
        <div class="tupian4" @click="handleGoToProcess('serviceProduct')">
          <div class="icon4"></div>
        </div>
        <span @click="handleGoToProcess('serviceProduct')">
            服务产品
          </span>
        <!-- <p>形成特定的使用价值达到一定的结果</p> -->
      </el-col>

      <!-- 收费标准 -->
      <el-col span="6" class="service-one" style="margin-left:50px; " @click="handleGoToProcess('chargeStandard')">
        <div class="tupian5" @click="handleGoToProcess('chargeStandard')">
          <div class="icon5"></div>
        </div>
        <span @click="handleGoToProcess('chargeStandard')">
            收费标准
          </span>
        <!-- <p>行业统一的收费规格保证客户权益</p> -->
      </el-col>

    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'icons',//流程
    data() {
      return {
        flowData: [],//表数据
      };
    },
    created() {
      // this.handleGetTableData();//获取流程数据
    },
    methods: {

      //获取流程数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: '/base/serviceInfoList',
        }).then((res) => {
          if (res.data.status === 200)
            _this.flowData = res.data.data;
        });
      },

      //跳转到服务流程页面
      handleGoToProcess(type) {
        let _this = this;
        _this.$router.push({
          path: '/iconsDetail',
          query: {
            tradingState: type
          }
        });
      },
    }
  }
</script>
<style lang="less">
  .icons {
    width: 100%;
    margin-top: 50px;

    .title {
      margin-bottom: 5px;
      // background: red;
      .line {
        margin-left: 30px;
        display: inline-block;
        width: 980px;
        height: 50px;
        background: url(../../../assets/img/line.png);
      }
    }

    .service-one {
      width: 200px;
      height: 200px;
      background: #fff;
      box-shadow: 2px 5px 20px rgba(36, 37, 38, 0.1);
      text-align: center;
      .tupian1 {
        border-radius: 50%;
        margin: 30px auto;
        padding-bottom: 12px;
        .icon1 {
          width: 55px;
          height: 55px;
          margin: 0 auto;
          margin-top: 10px;
          background: url(../../../assets/img/index-icon/one.png) no-repeat;
        }
      }

      .tupian2 {
        border-radius: 50%;
        margin: 30px auto;
        padding-bottom: 12px;
        .icon2 {
          width: 55px;
          height: 55px;
          margin: 0 auto;
          margin-top: 10px;
          background: url(../../../assets/img/index-icon/two.png) no-repeat;
        }
      }

      .tupian3 {
        border-radius: 50%;
        margin: 30px auto;
        padding-bottom: 12px;
        .icon3 {
          width: 55px;
          height: 55px;
          margin: 0 auto;
          margin-top: 10px;
          background: url(../../../assets/img/index-icon/three.png) no-repeat;
        }
      }

      .tupian4 {
        border-radius: 50%;
        margin: 30px auto;
        padding-bottom: 12px;
        .icon4 {
          width: 55px;
          height: 55px;
          margin: 0 auto;
          margin-top: 10px;
          background: url(../../../assets/img/index-icon/four.png) no-repeat;
        }
      }

      .tupian5 {
        border-radius: 50%;
        margin: 30px auto;
        padding-bottom: 12px;
        .icon5 {
          width: 55px;
          height: 55px;
          margin: 0 auto;
          margin-top: 10px;
          background: url(../../../assets/img/index-icon/five.png) no-repeat;
        }
      }

      span {
        font-size: 17px;
        color: #666;
        padding-top: 10px;
        margin-top: 20px;
        border-top: 2px solid #b4dc9c;
      }
      p {
        margin-top: 20px;
        font-size: 12px;
        padding: 0 20px;
        color: #999999;
      }
    }

    .service-one:hover {
      cursor: pointer;
      // border: 2px solid #dcdcdc;
      background: linear-gradient(-45deg, #6b98ff 0%, #44b7ff 100%);
      color: #fff;
      box-shadow: 2px 5px 20px rgba(36, 37, 38, 0.13);
      p {
        color: #fff;
      }
      span {
        border-top: 2px solid #fff;
        color: #fff;
      }
      .icon1 {
        background: url(../../../assets/img/index-icon/one1.png) no-repeat;
      }
      .icon2 {
        background: url(../../../assets/img/index-icon/two1.png) no-repeat;
      }
      .icon3 {
        background: url(../../../assets/img/index-icon/three1.png) no-repeat;
      }
      .icon4 {
        background: url(../../../assets/img/index-icon/four1.png) no-repeat;
      }
      .icon5 {
        background: url(../../../assets/img/index-icon/five1.png) no-repeat;
      }

    }

    li {
      float: left;
      width: 25%;
      text-align: center;
      margin: 30px 0px 20px 0px;
      span {
        display: block;
        color: #404040;
        margin-top: 16px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
</style>
