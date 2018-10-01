<template>
  <div class="main-box">
    <IndexCarousel></IndexCarousel>
    <div class="main">
      <div class="box clearfix">

        <!-- 用户中心 -->
        <PositionModule></PositionModule>

        <!-- 行情指数+行情中心 -->
        <div>
          <marketIndex></marketIndex>
          <IndexCenterMarket></IndexCenterMarket><!-- 行情中心 -->
        </div>

        <!-- 广告位 -->
        <AdvertisingPositionTop></AdvertisingPositionTop>

        <!-- 交易商城 -->
        <div class="trade-mall">
          <div class="img"><img src="../assets/img/index-icon/Trading-mall.png" alt=""></div>

          <!-- 价格播报 -->
          <PriceToBroadcastTitle></PriceToBroadcastTitle>
          <PriceToBroadcast
            :carouselBoxStyle="carouselBoxStyle"
            :carouselStyle="carouselStyle"
            :itemStyle="itemStyle"
            :imgStyle="imgStyle"></PriceToBroadcast>

          <!-- 公告+交易专区+企业推荐 -->
          <div class="notice-and-information-and-recommend clearfix">
            <NoticeAndInformation></NoticeAndInformation><!-- 公告+资讯 -->
            <TradingZone></TradingZone> <!-- 交易专区 -->
            <Recommend></Recommend><!--企业推荐 -->
          </div>
        </div>
      </div>

      <!-- 广告位 -->
      <AdvertisingPositionBottom></AdvertisingPositionBottom>

      <!-- 平台优势 -->
      <AdvantageOfPlatform></AdvantageOfPlatform>

      <!-- 流程 -->
      <Icons></Icons>

      <!-- 危废专区 -->
      <WasteZone></WasteZone>
    </div>
  </div>
</template>

<script>
  import marketIndex from './common/market/marketIndex'
  import IndexCenterMarket from './common/market/indexCenterMarket'
  import AdvertisingPositionTop from './common/advertising/advertisingPositionTop'
  import IndexCarousel from './common/carousel/indexCarousel'
  import PositionModule from './common/positionModule'
  import AdvantageOfPlatform from './common/advantageOfPlatform'
  import Icons from './common/icons/icons'
  import PriceToBroadcastTitle from './common/carousel/priceToBroadcastTitle'
  import PriceToBroadcast from './common/carousel/priceToBroadcast'
  import NoticeAndInformation from './common/noticeInformationRecommend/noticeAndInformation'
  import TradingZone from './common/noticeInformationRecommend/tradingZone'
  import Recommend from './common/noticeInformationRecommend/recommend'
  import AdvertisingPositionBottom from './common/advertising/advertisingPositionBottom'

  import WasteZone from './common/wasteZone'

  export default {
    data() {
      return {
        name: "",
        carouselBoxStyle: {
          width: "1200px",
          height: "200px"
        },
        carouselStyle: {
          width: "1200px",
          height: "200px"
        },
        itemStyle: {
          width: "200px",
          height: "200px",
          marginLeft: "50px",
        },
        imgStyle: {
          width: "180px",
          height: "120px"
        }
      };
    },
    components: {
      marketIndex,//行情指数
      IndexCenterMarket,//行情中心
      IndexCarousel,//
      PositionModule,//轮播
      Icons,//流程
      PriceToBroadcastTitle,//价格播报
      PriceToBroadcast,//价格播报
      NoticeAndInformation,//公告资讯
      AdvantageOfPlatform,//平台优势
      AdvertisingPositionTop,//广告位
      TradingZone,//交易专区
      WasteZone,//危废专区
      Recommend,//企业推荐
      AdvertisingPositionBottom
    }
  };
</script>

<style lang="less">
  .main-box {
    position: relative;
    .main {
      margin-top: 15px;
    }
    .box {
      .left {
        width: 220px;
        height: 450px;
        /*box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);*/
      }
      .center {
        width: 780px;
        margin-left: 8px;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
      }
      .right {
        width: 230px;
        // height: 300px;
      }
      .trade-mall {
        margin-top: 20px;
        .img {
          text-align: center;
        }
        .notice-and-information-and-recommend {

        }
      }
      .advantage {
        margin-top: 15px;
        .img {
          text-align: center;
        }
      }
    }

    .service {
      width: 100%;
      margin-top: 8px;
      background-color: #fff;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
      li {
        float: left;
        width: 25%;
        text-align: center;
        margin: 30px 0px 20px 0px;
        span {
          display: block;
          margin-top: 16px;
          font-size: 14px;
        }
      }
    }

    .el-carousel__item h3 {
      color: #475669;
      font-size: 18px;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
    }

    .el-carousel__container img {
      width: 100%;
      height: 100%;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
    }
  }
</style>




