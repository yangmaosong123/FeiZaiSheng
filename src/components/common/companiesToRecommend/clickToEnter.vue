<template>
  <div class="click-to-enter">
    <div class="main">
      <img
        style="width:1200px;height:250px;"
        :src="$store.state.outputImgByIdUrl+detail.companyProfileId"
        :alt="detail.companyProfileId">
      <el-row>
        <el-col :span="5" class="brief">
          <img
            :src="$store.state.outputImgByIdUrl+detail.enterpriseDisplay"
            :alt="detail.id">
          <p>{{detail.enterpriseName}}</p>
          <p>
            电话 ：{{detail.fixedTelephone}}
          </p>
          <p>
            邮箱 ：{{detail.email}}
          </p>
        </el-col>
        <el-col :span="18">
          <div class="content">
            <h2>企业介绍</h2>
            <h4>{{detail.enterpriseName}}</h4>
            <div class="introduce">{{detail.companyIntroduction}}</div>
            <div class="certificate">
              <el-row>
                <el-col :span="8">
                  <p>注册时间:{{detail.registrationTime}}</p>
                  <p>注册资金:{{detail.registrationCapital}}</p>
                  <p>公司性质:{{findConfigItem(detail.companyProperties,$store.state.dictionary.gsxz).title}}</p>
                </el-col>
                <el-col :span="12">
                  <p>所属行业:{{findConfigItem(detail.industry,$store.state.dictionary.sshy).title}}</p>
                  <p>主要产品:{{mainProducts}}</p>
                </el-col>
              </el-row>
            </div>
            <!--<h3>资历证书</h3>-->
            <!--<CertificateBroadcast :carouselBoxStyle="carouselBoxStyle"-->
                                  <!--:carouselStyle="carouselStyle"-->
                                  <!--:itemStyle="itemStyle"-->
                                  <!--:imgStyle="imgStyle"></CertificateBroadcast>-->
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import CertificateBroadcast from '../../common/carousel/certificateBroadcast'

  export default {
    name: 'clickToEnter',//点击进入
    data() {
      return {
        detail: {},//详情
        mainProducts: [],
        carouselBoxStyle: {
          width: "880px",
          height: "340px"
        },
        carouselStyle: {
          width: "880px",
          height: "240px"
        },
        itemStyle: {
          width: "880px",
          height: "240px"
        },
        imgStyle: {
          width: "880px",
          height: "240px"
        }
      };
    },
    watch: {
      id() {
        this.handleGetBrotherData();
      }
    },
    components: {
      CertificateBroadcast,//证书轮播
    },
    created() {
      let _this = this;
      _this.handleGetBrotherData(_this.$route.query.id);//展示数据
    },
    methods: {

      //展示数据
      handleGetBrotherData(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/priseLibraryEnter",
          data: {
            id: id
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.detail = res.data.data;
            _this.mainProducts = res.data.data.mainProducts.split(',');
            _this.$axios({
              method: "post",
              url: "/base/findDictionary",
              data: {
                moduleCode: "zycp"
              }
            }).then(res => {
              if (res.data.status === 200) {
                let result = [];
                for (let i = 0; i < res.data.data.zycp.length; i++) {
                  for (let j = 0; j < _this.mainProducts.length; j++) {
                    if (_this.mainProducts[j] == res.data.data.zycp[i].itemCode) {
                      if (_this.mainProducts[j] != "")
                        result.push(res.data.data.zycp[i].title);
                    }
                  }
                }
                _this.mainProducts = result.join(',');
              }
            });

            _this.swiperSlides = res.data.data.lstMapId;
          }
        });
      },


    }
  };
</script>

<style lang="less" scoped>
  .click-to-enter {
    margin-top: 20px;
    img {
      width: 240px;
      height: 120px;
      margin-bottom: 30px;
    }
    .brief {
      height: 300px;
      background: #fff;
      color: #717171;
      p {
        font-weight: bold;
        text-align: center;
      }
    }
  }

  .content {
    margin-left: 10px;
    background: #fff;
    h2 {
      border-bottom: 1px solid #ccc;
      padding: 10px 20px;
      color: #666;
    }
    h4 {
      padding: 10px 20px;
      color: #717171;
      font-size: 16px;
      margin: 10px 10px 10px 0;
    }
    h3 {
      color: #666;
      padding: 10px 20px;
      border-bottom: 1px solid #ccc;
    }
    .introduce {
      color: #717171;
      padding: 10px 20px;
      margin-bottom: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;

    }
    .certificate {
      border-top: 1px solid #ccc;
    }
    span {
      color: #717171;
      padding: 10px 20px;
      width: 200px;
    }
    p {
      color: #717171;
      padding: 10px 20px;
      line-height: 10px;
    }
    .Broadcast {
      margin-top: 20px;
    }
  }

</style>
