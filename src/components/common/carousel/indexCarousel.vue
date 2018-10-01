<template>
  <div class="index-carousel">
    <!-- 轮播 -->
    <transition-group class="carousel" tag="ul" name="fade">
      <li v-for="(item,index) in carousels"
          class="item-carousel"
          @mouseout="handleStartAutoPlay"
          @mouseover="handleStopAutoPlay"
          v-show="index==currentIndex"
          :key="index">
        <img :src="$store.state.outputImgByIdUrl+item.extField2"
             class="item-img"
             :alt="item.id">
      </li>
    </transition-group>

    <!-- 按钮 -->
    <div class="btn-box">
      <div class="btn" v-for="(item,index) in carousels"
           :key="index"
           @mouseout="handleStartAutoPlay"
           @mouseover="handleStopAutoPlay"
           @click="handleItemCarouselClick(item,index)"
           :class="{'diamonds-background':index==currentIndex}"></div>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'indexCarousel',//首页轮播
    data() {
      return {
        currentIndex: '0',//当前项
        timer: 0,//计时标记
        carousels: [],//轮播图
      };
    },
    created() {
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
          url: "/base/broadcastList"
        }).then((res) => {
          _this.carousels = res.data.data;
          console.log("_this.carousel", _this.carousels);
        });
      },

      //圆点事件
      handleItemCarouselClick(item, index) {
        let _this = this;
        _this.currentIndex = index;
      },

      //自动轮播
      handleAutoPlay() {
        let _this = this;

        if (_this.currentIndex < _this.carousels.length - 1) _this.currentIndex++;
        else _this.currentIndex = 0;
      },

      //开始自动轮播
      handleStartAutoPlay() {
        let _this = this;
        _this.timer = setInterval(() => {
          _this.handleAutoPlay();//自动轮播
        }, 5000);
      },

      //停止自动轮播
      handleStopAutoPlay() {
        let _this = this;
        clearInterval(_this.timer);
        _this.timer = 0;
      }
    }
  };
</script>

<style lang="less" scoped>
  .index-carousel {
    position: relative;
    height: 450px;
    .carousel {
      width: 100%;
      height: 450px;
      overflow: hidden;
      .item-carousel {
        display: block;
        @media screen and (max-width: 1366px) {
          .item-img {
            width: 100%;
            height: 450px;
            position: absolute;
            right: 0;
            margin-left: -960px;
          }
        }
        .item-img {
          width: 100%;
          height: 450px;
        }
      }
    }
    .btn-box {
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 45%;
      .btn {
        display: inline-block;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
        width: 26px;
        height: 5px;
        background: rgba(0, 0, 0, 0.3);
      }
      .diamonds-background {
        z-index: 10;
        background: #fff;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(0);
    -webkit-transform: translateX(0)
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all linear .3s;
    -webkit-transition: all linear .3s;
  }

  .fade-leave-to {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%)
  }

  .fade-enter {
    transform: translateX(100%);
    -webkit-transform: translateX(100%)
  }

</style>
