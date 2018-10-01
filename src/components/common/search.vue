<template>
  <div class="search-box">
    <div class="container">
      <div style="padding: 15px 0 10px 0 ;">
        <el-row :gutter="24">
          <el-col :span="4">
            <img src="../../assets/img/logo.png" alt="logo" style="margin-right:20px;">
          </el-col>
          <el-col :span="3">
            <div class="Label"></div>
            <div>
              <!-- <span style="color: #666">城市:</span> -->
              <img src="../../assets/img/location.png" style="margin-left:30px;">
              <province-menu/>
              <div class="grid-content bg-purple"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <input v-model="searchKey"
                   style="width: 450px; height:38px;background-color: #fefefe;line-height:38px; border: 2px solid #208dd6;padding-left: 10px;"
                   placeholder="请输入">
            <button style="width: 100px;height:38px;background-color: #208dd6; color: #fff;border: 1px solid #208dd6;"
                    @click="search">
              搜索
            </button>
            <div class="grid-content bg-purple" style="margin-top:5px;"><span style="color:#636363">热门搜索：</span>
              <span class="search_key" v-for="item in hotSearchList" :key="item"
                    @click="clickSearchKey(item)">{{item}}</span></div>
          </el-col>
          <el-col :span="4">
            <img src="../../assets/img/number.png"/>
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
  import ProvinceMenu from "../base/ProvinceMenu.vue"
  import Event from '../../assets/js/event'

  export default {
    components: {
      "province-menu": ProvinceMenu
    },

    data() {
      return {
        selectList: "",
        hotSearchList: '',
        province: [],
        curProvince: {title: ""},
        searchKey: "",
      };
    },
    created: function () {

      let that = this;
      that.$axios({
        method: "post",
        url: "/searchKeywords/keywordsList"
      }).then(function (res) {
        that.hotSearchList = res.data.data;
      });

    },
    mounted() {
      Event.$on('emptySearchKey', () => {
        this.$store.state.searchKey = "";
      });
    },
    methods: {
      clickSearchKey: function (key) {
        this.searchKey = key;
      },
      search: function () {
        let _this = this;
        this.$store.state.searchKey = this.searchKey;
        _this.$router.push({
          path: '/recoverableList'
        });
      },
      selectProvince(item) {
        this.curProvince = item;
      },
      sel() {
        let that = this;
        this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "1"
          }
        })
          .then(function (res) {
            that.selectList = res.data.data;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }
  };
</script>

<style lang="less">
  .el-col {
    padding: 5px;
  }

  .Label {
    width: 140px;
    border-radius: 4px;
    // border:1px solid #d7d7d7;
    color: #208dd6;
    // text-align: center;
    // padding: 5px;
  }

  .grid-content {
    /*background-color: none;*/
    span {
      overflow: hidden;
    }
  }

  .search {
    padding: 11px 0;
    position: relative;
    line-height: 36px;
    background: #fff;
    width: 1200px;
    span {
      padding: 0 150px 0 250px;
    }
    select {
      color: #208dd6;
      margin-left: 270px;
      padding: 3px 0px 5px 10px;
      background: no-repeat;
      position: absolute;
      left: 36px;
      border: none;
      width: 100px;
      top: 11px;
      border-radius: 0px;
      height: 36px;
      line-height: 36px;
    }
    input {
      width: 380px;
      height: 36px;
      float: left;
      padding-left: 10px;
      border-radius: 6px 0 0 6px;
      border: 2px solid #208dd6;
      border-radius: 0px;
    }
    button {
      border: 1px solid #208dd6;
      background-color: #208dd6;
      color: #fff;
      width: 70px;
      float: left;
      // border-radius: 0 6px 6px 0;
      height: 36px;
      line-height: 32px;
    }
  }

  .hot {
    height: 30px;
    line-height: 35px;
    bottom: 0;
    margin-left: 210px;
    li {
      float: left;
      text-align: center;
      a {
        color: #ccc;
        padding: 10px;
      }
    }
  }
</style>
<style lang="less" scoped>
  .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 6px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }

  .search-box {
    width: 100%;
    background: #fff;
    .container {
      width: 1200px;
      margin: 0 auto;
    }
  }

  .search_key {
    padding-left: 10px;
    cursor: pointer;
    color: #aaa;
  }
</style>




