<template>
  <div class="baby-by-carousel">
    <slot>
      <div :style="contentBoxDiv" class="baby-by-content">
        <img class="big-img" :src="$store.state.outputImgByIdUrl+bigImage" :alt="bigImage+'bigImg'"
             :style="bigImgStyle">
        <div class="baby-by-carousel-content">
          <img class="el-icon-arrow-left btn" @click="handleClickBtnPrev" src="../../../assets/img/last.png">
          
          <ul class="btn-ul">
            <li @click="handleSetBigImageShow(item,index)" class="item-small-img" :class="{'border':index==itemIndex}" v-for="(item,index) in smallImages" :key="index">
              <img :src="$store.state.outputImgByIdUrl+item" :alt="item+'smallImg'" :style="smallImgStyle">
            </li>
          </ul>
          <img class="el-icon-arrow-right btn" @click="handleClickBtnNext" src="../../../assets/img/next.png">
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
  export default {
    name: 'babyByCarousel',//宝贝轮播
    props: {
      contentBoxDiv: {
        type: Object
      },
      smallImages: {
        type: Array
      },
      bigImgStyle: {
        type: Object
      },
      smallImgStyle: {
        type: Object
      }
    },
    created() {
       this.bigImage=this.smallImages[0];
    },
    watch: {
      smallImages() {
        let _this = this;
        _this.bigImage = _this.smallImages[0];//默认显示第一张图片
      }
    },
    data() {
      return {
        bigImage: 0,//大图
        itemIndex: 0,//当前点击图片index
      };
    },
    methods: {
      handleSetBigImageShow(item, index) {       
        this.itemIndex = index;
        this.bigImage = this.smallImages[this.itemIndex];
      },

      //左箭头事件
      handleClickBtnPrev() {
        this.itemIndex=Math.max(0,this.itemIndex-1);
        this.bigImage = this.smallImages[this.itemIndex];
      },

      //右箭头事件
      handleClickBtnNext() {
        this.itemIndex=Math.min(this.smallImages.length-1,this.itemIndex+1);
        this.bigImage = this.smallImages[this.itemIndex];
      }
    }
  }
</script>

<style lang="less" scoped>
  .baby-by-carousel {
    .baby-by-content {
      .baby-by-carousel-content {
        position: relative;
        .btn, .btn-ul {
          display: inline-block;
          img{
           width: 70px!important;
           height: 60px!important; 
          }
        }
        .btn{
          font-size:24px;
          margin-bottom:16px;
        }
        .item-small-img {
          display: inline-block;
          &:nth-child(2) {
            margin: 0 10px;
          }
          &:nth-child(3) {
            margin-right: 10px;
          }
        }
        .border{
           border: 2px solid #208dd6;
        }
      }
    }
  }
</style>
