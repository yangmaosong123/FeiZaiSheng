<template>
  <div class="left-nav">
    <!-- 汽车零配件 -->
    <div class="item-nav recoverable-waste">
      <h3 @click="handleGoToSystemWaste('汽车零配件')"
          class="arrow">
        <a class="ico"></a>
        汽车零配件
        <img class="arrow"
             @click="handleGoToSystemWaste('汽车零配件')"
             src="../../../assets/img/arrow.png"
             style="float:right;margin-right: 5px;"
             alt="img">
      </h3>
      <ul>
        <li type="text"
            v-for="item in tags1"
            class="category arrow"
            @click="handleGoToSystemWaste('汽车零配件')">{{item}}
        </li>
      </ul>
    </div>

    <!-- 电池 -->
    <div class="item-nav other-waste">
      <h3 @click="handleGoToSystemWaste('电池专区')" class="arrow">
        <a class="ico"></a>
        电池专区
        <img class="arrow" src="../../../assets/img/arrow.png"
             style="float:right;margin-right: 5px;"
             @click="handleGoToSystemWaste('电池专区')"
             alt="img">
      </h3>
      <ul>
        <li type="text"
            v-for="item in tags2"
            @click="handleGoToSystemWaste('电池专区')"
            class="category arrow"> {{item}}
        </li>
      </ul>
    </div>

    <!--危险废物 -->
    <div class="item-nav danger-waste">
      <h3 @click="handleGoToWaste" class="arrow">
        <a class="ico"></a>
        危险废物
        <img class="arrow" src="../../../assets/img/arrow.png"
             @click="handleGoToWaste"
             style="float:right;margin-right: 5px;"
             alt="img">
      </h3>
      <ul>
        <li type="text"
            v-for="item in tags3"
            class="category arrow"> {{item}}
        </li>
      </ul>
    </div>

  </div>
</template>
<style lang="less" scoped>
  .left-nav {
    height: 450px;
    background: rgba(49, 49, 49, 0.9);
    color: #b2b2b2;
    .arrow:hover {
      cursor: pointer;
    }
    .category {
      color: #dfdfdf;
      font-size: 14px;
      padding-top: 15px;
    }
    .category:hover {
      color: #208dd6;;
    }

    .danger-waste {
      margin-left: 10px;
      padding-top: 15px;
      height: 33%;
      ul {
        padding-left: 30px;
      }
      h3 {
        font-size: 18px;
        a {
          margin-right: 10px;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 35px;
        }
      }
      h3:hover {
        color: #fff;
      }

      .ico {
        display: inline-block;
        width: 21px;
        height: 19px;
        background: url(../../../assets/img/icon_3.png) no-repeat;
      }

    }

    .recoverable-waste {
      margin-left: 10px;
      padding-top: 15px;
      height: 33%;
      border-bottom: 1px solid #2f2f2f;
      ul {
        padding-left: 30px;
      }
      .ico {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../../assets/img/icon_1.png) no-repeat;
      }
      h3 {
        font-size: 18px;
        a {
          margin-right: 10px;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 15px;
        }
      }
      h3:hover {
        color: #fff;
      }
    }
    .other-waste {
      margin-left: 10px;
      padding-top: 15px;
      height: 30%;
      border-bottom: 1px solid #2f2f2f;
      ul {
        padding-left: 30px;
      }
      .ico {
        display: inline-block;
        width: 12px;
        height: 21px;
        background: url(../../../assets/img/icon_2.png) no-repeat;
      }
      h3 {
        font-size: 18px;
        a {
          margin-right: 10px;
        }
        img {
          width: 20px;
          height: 20px;
          margin-left: 30px;
        }
      }
      h3:hover {
        color: #fff;
      }

    }
  }
</style>
<script>
  import Event from '../../../assets/js/event'

  export default {
    data() {
      return {
        tags1: ['废钢', '电子、电器', '电池', '橡胶', '塑料', '废旧金属'],
        tags2: ["新能源汽车电池"],//可回收废品数据
        tags3: ['废机油', '废渣', ' 废液']
      };
    },
    created() {
      this.getBeginData(); // 初始化企业基本信息数据
      this.handleGetNavData();//获取可回收废品数据
    },
    methods: {

      // 初始化企业基本信息数据
      getBeginData() {
        let _this = this;
        _this.$axios({
          method: "post",
          withCredentials: true,
          url: "/company/registerInfo"
        }).then(res => {
          switch (res.data.status) {
            case 200:
              _this.$store.state.enterpriseTypeStatus = res.data.data.enterpriseTypeStatus;
              break;
          }

        });
      },

      //获取可回收废品数据
      handleGetNavData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionaryByRecycl",
          data: {
            moduleCode: 'hszl'
          }
        }).then((res) => {
          if (res.data.status === 200) {
            console.log(res.data.data);
            // _this.tags2 = res.data.data;
          }
        });
      },

      //跳转到系统推荐页面
      handleGoToWaste() {
        let _this = this;
        _this.$router.push('wasteRubbishList');
      },

      //
      handleGoToSystemWaste(type) {
        let _this = this;
        Event.$emit('emptySearchKey');
        _this.$router.push({
          path: 'recoverableList',
          query: {
            type: type
          }
        });
      },

    }
  }
</script>
<style lang="less" scoped>
  .left-nav {

    ul {
      width: 200px;
      li {
        float: left;
        margin-right: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
</style>

