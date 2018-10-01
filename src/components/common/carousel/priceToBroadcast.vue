<template>
  <div class="price-to-broadcast" :style="carouselBoxStyle">
    <transition name="outFade">
      <div class="carousel-box" @mouseover="handleStopAutoPlay"
           v-show="outIndex==currentIndex"
           @mouseout="handleStartAutoPlay">
        <transition-group class="carousel" tag="ul" name="fade"
                          :style="carouselStyle"
                          v-for="(items,index) in btnCarousels"
                          :key="index"
                          v-show="index==currentIndex">
          <li class="item-carousel" v-for="smallItem in items"
              :key="smallItem.id"
              :style="itemStyle">
            <img
              :style="imgStyle"
              :src="$store.state.outputImgUrl+smallItem.id+'&bizObjName=upload_img&t='+(new Date()).getTime()"
              alt="fjjs">
            <h3>
              {{findConfigItem(smallItem.daCategory,$store.state.dictionary.hszl).title}}
            </h3>
            <h3 style="color: #f77211;">￥{{smallItem.price}}</h3>
          </li>
        </transition-group>
      </div>
    </transition>
  </div>
</template>
<script>

  export default {
    name: 'priceToBroadcast',//轮播
    props: {
      carouselBoxStyle: {
        type: Object
      },
      carouselStyle: {
        type: Object
      },
      itemStyle: {
        type: Object
      },
      imgStyle: {
        type: Object
      }
    },
    data() {
      return {
        outIndex: 0,
        currentIndex: 0,//当前项
        timer: 0,//计时标记
        btnCarousels: []
      };
    },
    mounted() {
      let _this = this;
      _this.getCarousel(); //初始化轮播图数据
      _this.handleStartAutoPlay();//自动轮播
    },
    methods: {

      //初始化轮播图数据
      getCarousel() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/priceAnnounction"
        }).then((res) => {
          for (let i = 0; i < res.data.data.length; i += 5) {
            _this.btnCarousels.push(res.data.data.slice(i, i + 5));
          }
        });
      },

      //自动轮播
      handleAutoPlay() {
        let _this = this;
        if (_this.currentIndex < _this.btnCarousels.length - 1) {
          _this.outIndex++;
          _this.currentIndex++;
        }
        else {
          _this.outIndex = 0;
          _this.currentIndex = 0;
        }
      },

      //停止自动轮播
      handleStopAutoPlay() {
        let _this = this;
        clearInterval(_this.timer);
        _this.timer = 0;
      },

      //开始自动轮播
      handleStartAutoPlay() {
        let _this = this;
        _this.timer = setInterval(() => {
          _this.handleAutoPlay();//自动轮播
        }, 4000);
      },

    }
  };
</script>
<style lang="less" scoped>
  .price-to-broadcast {
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    .carousel-box {
      height: 240px;
      text-align: center;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      .item-carousel {
        box-shadow: 2px 5px 20px rgba(36, 37, 38, 0.13);
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        vertical-align: middle;
        background: #fff;
        border-top: 2px solid #fda24c;
        padding: 6px;
        h3 {
          font-size: 14px;
          padding-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:first-child {
          margin-left: 0 !important;
        }
      }
    }
    .btn-box {
      position: absolute;
      bottom: 40px;
      left: 44%;
      .btn {
        display: inline-block;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ddd;
      }
      .diamonds-background {
        z-index: 10;
        background: #208dd6;
      }
    }
  }

  /* 轮播效果 */

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(0);
    -webkit-transform: translateX(0)
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all linear .5s;
    -webkit-transition: all linear .5s;
  }

  .fade-leave-to {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%)
  }

  .fade-enter {
    transform: translateX(100%);
    -webkit-transform: translateX(100%)
  }

  /**/
  .outFade-enter,
  .outFade-leave-to {
    opacity: 0;
    transform: translateX(0);
    -webkit-transform: translateX(0)
  }

  .outFade-enter-active,
  .outFade-leave-active {
    transition: all linear .8s;
    -webkit-transition: all linear .8s;
  }

  .outFade-leave-to {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%)
  }

  .outFade-enter {
    transform: translateX(100%);
    -webkit-transform: translateX(100%)
  }

</style>
