<template>
  <div class="recommend">
    <div class="title-button clearfix">
      <img src="../../../assets/img/index-icon/enterprise.png">
      <el-button type="text" class="button" @click="handleClickMore">更多<i class="el-icon-d-arrow-right"></i></el-button>
    </div>
    <ul class="enterprise">
      <li v-for="item in recommend" :key="item.id" class="clearfix">
        <div class="item">
          <img
            class="img"
            style="width:36px;height:36px;"
            @click="handleClickEnterToDetail(item.id)"
            :src="$store.state.outputImgByIdUrl+item.attachmentId"
            :alt="item.attachmentId">
        </div>
        <div class="item right">
          <div class="item-title" @click="handleClickEnterToDetail(item.id)">{{item.enterpriseName}}</div>
          <div>
            <span> 主营：{{findConfigItem(item.industry,$store.state.dictionary.sshy).title}}</span>
            <span style="float:right;"><img src="../../../assets/img/index-icon/star.png" alt=""></span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "recommend",//企业推荐
    data() {
      return {
        recommend: [],//企业推荐数据
      };
    },
    created() {
      let _this = this;
      _this.handleGetRecommendData(); //获取企业推荐数据
    },
    methods: {

      //获取企业推荐数据
      handleGetRecommendData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/getEnterpriseRecommend",
          data: {
            enterpriseType: 'hs',//类型
          }
        }).then((res) => {
          if (res.data.status === 200)
            _this.recommend = res.data.data;
        });
      },

      //点击进入
      handleClickEnterToDetail(id) {
        let _this = this;
        _this.$router.push({path: '/clickToEnter', query: {id: id}});
      },

      //点击更多
      handleClickMore() {
        let _this = this;
        _this.$router.push('/companiesToRecommend');
      }

    }
  };
</script>
<style lang="less" scoped>
  .recommend {
    .clearfix {
      margin-top: 0px;
    }
    float: left;
    margin-left: 15px;
    width: 300px;
    height: 300px;
    background: #fff;
    padding: 15px;
    border-top: 2px solid #58bf7f;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    img {
      vertical-align: middle;
    }
    .title-button {
      .title {
        float: left;

      }
      .button {
        float: right;
        color: #a5a5a5;
        &:hover {
          color: #58bf7f;
        }
      }

    }
    .item {
      float: left;
      margin-bottom: 0px !important;
      .img {
        border-radius: 50%;
        &:hover {
          cursor: pointer;
        }
      }
      span {
        font-size: 11px;
        color: #b5b5b5;
      }
      .item-title {
        color: #666;
        &:hover {
          cursor: pointer;
          color: #47bf01;
        }

      }
    }
    .right {
      width: 224px;
      margin-left: 10px;
    }
  }
</style>
