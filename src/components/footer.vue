<template>
  <div id="footer" class="footer">
    <div class="footer-container main">
      <div class="contain clearfix">
        <dl class="Fnav">
          <dt>
           <img src="../assets/img/index-icon/1.png" alt=""> <h2>平台优势</h2>
            <i></i>
          </dt>
          <dd>
            <a href="#" title="">智能平台</a>
            <a href="#" title="">云商平台</a>
            <a href="#" title="">行情平台</a>
            <a href="#" title="">金融平台</a>
            <a href="#" title="">物流平台</a>
          </dd>
        </dl>
        <dl class="Fnav">
          <dt>
             <img src="../assets/img/index-icon/2.png" alt=""><h2>交易指导</h2>
            <i></i>
          </dt>
          <dd>
            <router-link :to="{path:'iconsDetail',query:{tradingState:'serviceProcess'}}">服务流程</router-link>
            <router-link :to="{path:'iconsDetail',query:{tradingState:'recycleProcess'}}">回收流程</router-link>
            <router-link :to="{path:'iconsDetail',query:{tradingState:'wasteProcess'}}">危废处理</router-link>
            <router-link :to="{path:'iconsDetail',query:{tradingState:'serviceProduct'}}">服务产品</router-link>
            <router-link :to="{path:'iconsDetail',query:{tradingState:'chargeStandard'}}">收费标准</router-link>
          </dd>
        </dl>
        <dl class="Fnav">
          <dt>
            <img src="../assets/img/index-icon/3.png" alt=""> <h2>新闻中心</h2>
            <i></i>
          </dt>
          <dd>
            <a @click="handleClickNotice" class="notice">系统公告</a>
            <router-link :to="{path:'informationRecommendation',query:{type:'first'}}">行业资讯</router-link>
          </dd>
        </dl>
        <dl class="Fnav">
          <dt>
            <img src="../assets/img/index-icon/4.png" alt=""> <h2>关于我们</h2>
            <i></i>
          </dt>
          <dd>
            <router-link to="companyIntroduction">公司介绍</router-link>
            <router-link to="joinUs">加入我们</router-link>
            <router-link to="commonProblem">常见问题</router-link>
          </dd>
        </dl>

        <dl class="Fct">
          <dt>
             <img src="../assets/img/index-icon/5.png" alt=""><h2>联系我们</h2>
            <i></i>
          </dt>
          <dd>
            <div class="box tel">电 话：
              <span class="con">0755-86565654</span>
            </div>
            <div class="box post">传 真：
              <span class="con">0755-25950235</span>
            </div>
            <div class="box adr">地 址：
              <span class="con">深圳市南山区科技园科园路A8音乐大厦1005</span>
            </div>
          </dd>
        </dl>
        <div class="Fshare">
          <img src="../assets/img/QRCode.jpg" alt="" class="Fshare-ewm">
          <p class="con">扫一扫</p>
          <div class="list">
            <a href="#" class="bds_weixin" title="分享到微信"></a>
            <a href="#" class="bds_sqq" title="分享到QQ好友"></a>
            <a href="#" class="bds_tsina" title="分享到新浪微博"></a>
          </div>
        </div>
      </div>
    </div>
    <div class="record">

      深圳市复美环境科技有限公司 粤ICP备17095466号

    </div>
  </div>
</template>
<script>
  export default {
    name: "footer",
    methods: {
      handleClickNotice() {
        let _this = this;
        _this.$router.push({
          path: 'informationRecommendation', query: {type: 'second'}
        });
      }
    }
  };
</script>
<style lang="less">
  .footer {
    width: 100%;
    height: 425px;
    margin-top: 75px;
    background: #232429;
    .footer-container {
      padding: 35px 0 26px;
      .Fnav {
        width: 15%;
        float: left;
        img{
          vertical-align: middle;
        }
        h2{
          display: inline;
          padding-left: 5px;
        }
        dd a {
          display: block;
          padding: 6px 30px 6px 42px;
          line-height: 18px;
          color: #888888;
        }
        a:hover {
          color: #fff;
        }
      }
      dt h2 {
        line-height: 28px;
        font-weight: normal;
        font-size: 15px;
        color: #fff;
      }
      dt i {
        display: block;
        width: 12px;
        height: 2px;
        background: #232429;
        margin: 5px 0 11px;
      }
      .Fct {
        width: 26%;
        float: left;
        padding-left: 30px;
        position: relative;
        img{
          vertical-align: middle;
        }
        h2{
          display: inline;
          padding-left: 10px;
        }
        ::after {
          content: "";
          display: block;
          width: 1px;
          height: 177px;
          background: #41424a;
          position: absolute;
          left: 0px;
          top: 9px;
        }
        dd .box {
          padding: 3px 0 3px 36px;
          line-height: 24px;
          color: #888888;
          overflow: hidden;
        }
        dd .tel {
          background: url(../assets/img/tel.png) no-repeat left top;
        }
        dd .post {
          background: url(../assets/img/fax.png) no-repeat left top;
        }
        dd .box.adr {
          background: url(../assets/img/address.png) no-repeat left top;
        }
        dd .con {
          width: 70%;
          float: right;
        }
      }
      .Fshare {
        padding: 9px 0 0;
        text-align: center;
        font-size: 0px;
        float: right;
        .Fshare-ewm {
          width: 100px;
          height: 100px;
          object-fit: cover;
          // background: #fff;
        }
        .con {
          line-height: 25px;
          font-size: 12px;
          color: #999999;
          margin: 5px 0 0;
        }
        .list {
          margin: 16px 0 0;
          a {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 27px;
            border: 1px solid #949494;
            border-radius: 100%;
            margin: 0 0 0 5px;
          }
        }
        .bds_weixin {
          background: url(../assets/img/WeChat.png) no-repeat center !important;
        }
        .bds_sqq {
          background: url(../assets/img/QQ.png) no-repeat center !important;
        }
        .bds_tsina {
          background: url(../assets/img/Sina.png) no-repeat center !important;
        }
      }
    }
    .record {
      text-align: center;
      height: 50px;
      line-height: 50px;
      color: #888888;
      border-top: 1px solid #1a1b21;
    }
    .notice:hover {
      cursor: pointer;
    }
  }

  /*@media screen and (max-height: 1080px) {*/
  /*.footer {*/
  /*margin-top: 317px;*/
  /*}*/
  /*}*/
</style>



