<template>
  <div class="certificate-broadcast" :style="carouselBoxStyle">
    <transition-group class="carousel" tag="ul" name="fade"
                      :style="carouselStyle">
      <li class="item-carousel"
          v-for="(item,index) in carousels"
          :key="index"
          v-show="index==currentIndex"
          @mouseover="handleStopAutoPlay"
          @mouseout="handleStartAutoPlay"
          :style="itemStyle">
        <img
          :style="imgStyle"
          :src="$store.state.outputImgByIdUrl+item.id"
          :alt="'img'+item.id">
      </li>
    </transition-group>
    <div class="btn-box">
      <div class="btn" v-for="(item,index) in carousels"
           :key="index"
           @click="handleItemCarouselClick(item,index)"
           :class="{'diamonds-background':index==currentIndex}"></div>
    </div>
  </div>
</template>
<script>

  export default {
    name: 'certificateBroadcast',//证书轮播
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
        currentIndex: '0',//当前项
        timer: '',//计时标记
        carousels: [],//轮播图
      };
    },
    created() {
      let _this = this;
      _this.getCarousel(_this.$route.query.id); //初始化轮播图数据
      _this.handleStartAutoPlay();//自动轮播
    },
    methods: {

      //初始化轮播图数据
      getCarousel(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/priseLibraryEnter",
          data: {
            id: id
          }
        }).then((res) => {
          _this.carousels = res.data.data.lstMapId
        });
      },

      //圆点事件
      handleItemCarouselClick(item, index) {
        let _this = this;
        setTimeout(() => {
          _this.currentIndex = index;
        }, 500);
      },

      //自动轮播
      handleAutoPlay() {
        let _this = this;
        _this.currentIndex++;
        if (_this.currentIndex > _this.carousels.length - 1)
          _this.currentIndex = 0;
      },

      //停止自动轮播
      handleStopAutoPlay() {
        let _this = this;
        clearInterval(_this.timer);
        _this.timer = "";
      },

      //开始自动轮播
      handleStartAutoPlay() {
        let _this = this;
        _this.$nextTick(() => {
          _this.timer = setInterval(() => {
            _this.handleAutoPlay();//自动轮播
          }, 4000);
        });
      },

    }
  };
</script>
<style lang="less" scoped>
  .certificate-broadcast {
    .carousel {
      overflow: hidden;
      .item-carousel {
        display: inline-block;
        vertical-align: middle;
        background: #fff;
        h3 {
          font-size: 14px;
          padding-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .btn-box {
      position: absolute;
      bottom: 40px;
      left: 44%;
      .btn {
        z-index: 10;
        display: inline-block;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ddd;
        &:hover {
          cursor: pointer;
        }
      }
      .diamonds-background {
        z-index: 10;
        background: #208dd6;
      }
    }
  }

  /* 轮播效果 */

  .fade-enter-to, .fade-leave {
    transform: translateX(0)
  }

  .fade-enter-to, .fade-leave-active {
    transition: all .3s ease;
  }

  .fade-leave-active {
    transform: translateX(-100%)
  }

  .fade-enter {
    transform: translateX(100%)
  }

</style>
