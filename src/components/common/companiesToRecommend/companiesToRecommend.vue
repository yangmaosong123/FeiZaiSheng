<template>
  <div class="market-center">
    <div class="main">
      <el-row id="clearfix">
        <el-col :span="24">
          <el-card class="boxcard" v-for="item in cards" :key="item.id" style="background-color:#e6f0f7;width: 580px; ">
            <div slot="header">
              <span style="font-size: 18px;font-weight: bold;">{{item.title}}</span>
              <el-button style="float: right; padding: 3px 0;" type="text"
                         @click="handleLoadingMore(item.enterpriseType)">更多>
              </el-button>
            </div>
            <div v-for="current in (item.lst)" :key="current.id" class="textitem">
              <el-row class="content">
                <el-col :span="24">
                  <el-row>
                    <el-col class="title" :span="21">
                      <h3 @click="handleClickEnterToDetail(current.id)">{{current.enterpriseName}}</h3>
                    </el-col>
                    <el-col :span="3">
                      <el-button type="text" @click="handleClickEnterToDetail(current.id)">点击进入</el-button>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="7">
                      <img
                        @click="handleClickEnterToDetail(current.id)"
                        :src="$store.state.outputImgByIdUrl+current.enterpriseDisplay"
                        :alt="current.id">
                    </el-col>
                    <el-col :span="15">
                      <p><span style="color:#4e7998;">所属行业：</span>{{findConfigItem(current.industry,$store.state.dictionary.sshy).title}}
                      </p>
                      <p><span style="color:#4e7998;">公司介绍：</span>{{current.companyIntroduction}}</p>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'companiesToRecommend',//企业推荐
    data() {
      return {
        cards: [],//企业推荐
      };
    },
    created() {
      this.handleGetCompaniesData();  //获取企业推荐数据
    },
    methods: {

      //获取企业推荐数据
      handleGetCompaniesData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/enterpriseLibrary",
        }).then((res) => {
          if (res.data.status === 200) {
            _this.cards = res.data.data;
          }
        });
      },

      //加载更多
      handleLoadingMore(enterpriseType) {
        let _this = this;
        _this.$router.push({
          path: "/moreCompanies",
          query: {
            enterpriseType: enterpriseType
          }
        });
      },

      //点击进入
      handleClickEnterToDetail(id) {
        let _this = this;
        _this.$router.push({path: '/clickToEnter', query: {id: id}});
      },
    }
  };
</script>

<style lang="less" scoped>
  .el-card {
    margin-top: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0);
    border-radius: 0px;
  }

  .box-card .el-table__expanded-cell {
    background: #cccccc;
    font-size: 12px;
    padding: 0px;
  }

  .el-col {
    padding: 0px;
  }
</style>

<style>
  .text {
    font-size: 14px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-card__header {
    background: #fff;
  }

  .boxcard {
    float: left;
    margin-left: 22px;
    min-height: 670px;
  }

  .boxcard:nth-child(odd) {
    margin-left: 0;
  }

</style>

<style lang="less" scoped>
  .textitem {
    margin-top: 10px;
  }

  .content {
    background: #ffffff;
    height: 128px;
    border: 1px solid #e3e3e3;
    padding: 10px;
    img {
      width: 120px;
      height: 60px;
    }
    img:hover {
      cursor: pointer;
    }
    p {
      color: #989898;
      margin: 5px 0 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title {
      color: #666;
      font-size: 14px;
      font-weight: bold;
      margin-top: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title:hover {
      cursor: pointer;
      color: #208dd6;
    }
  }
</style>
