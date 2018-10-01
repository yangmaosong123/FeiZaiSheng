<template>
  <div class="notice-and-information">
    <ul class="nav">
      <li :class="{'currentBackground':index==currentIndex}"
          class="item"
          @click="handleClickNoticeAndInformation(item,index)"
          v-for="(item,index) in noticesAndInformation">
        {{item}}
      </li>
    </ul>

    <ul class="content">
      <li class="item-content  clearfix"
          v-if="currentIndex=='0'"
          @click="handleLookNoticeOrInformationDetail(item.id)"
          v-for="item in notices">
        <span class="title nowrap-notice-and-information">{{item.title}}</span>
        <span class="time">{{item.createDate}}</span>
      </li>
      <li class="item-content clearfix "
          v-if="currentIndex=='1'"
          @click="handleLookNoticeOrInformationDetail(item.id)"
          v-for="item in information">
        <span class="title nowrap-notice-and-information">{{item.title}}</span>
        <span class="time">{{item.createDate}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: "noticeAndInformation",//公告+资讯
    data() {
      return {
        noticesAndInformation: ['公告', '资讯'],//公告+资讯
        currentIndex: 0,
        notices: [],//公告
        information: [],//资讯
      };
    },
    created() {
      let _this = this;
      _this.getNotices();  //公告切换事件
    },
    methods: {

      //公告切换事件
      handleClickNoticeAndInformation(item, index) {
        let _this = this;
        _this.currentIndex = index;
        if (index == 0) _this.getNotices();
        else _this.getInformation();
      },

      // 显示公告数据
      getNotices() {
        let _this = this;
        _this.zzHide = false;
        _this.ggHide = true;
        _this.$axios({
          method: "post",
          url: "/base/list",
          data: ""
        }).then((res) => {
          _this.notices = res.data.data;
          console.log("_this.notices", _this.notices);
        });

      },

      // 显示资讯数据
      getInformation() {
        let _this = this;
        _this.ggHide = false;
        _this.zzHide = true;
        _this.$axios({
          method: "post",
          url: "/base/infoList",
          data: ""
        }).then((res) => {
          _this.information = res.data.data;
          console.log("_this.information", _this.information);
        })

      },

      //查看公告+资讯详情
      handleLookNoticeOrInformationDetail(id) {
        let _this = this;
        _this.$router.push({
          path: '/informationDetail',
          query: {
            id: id
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .notice-and-information {
    float: left;
    height: 300px;
    background: #fff;
    padding: 15px;
    width: 300px;
    border-top: 2px solid #f08900;
    box-shadow:0 1px 5px 0 rgba(0,0,0,0.2);
    .nav {
      .item {
        display: inline-block;
        margin-left: 5px;
        padding: 2px 12px;
        margin-bottom: 0px!important; 
        &:first-child {
          margin-left: 0;
        }
        &:hover {
          cursor: pointer;
        }
      }
      .currentBackground {
        background: #f08900;
        color: #fff;
      }
    }
    .content {
      margin-top: 15px;
      .item-content {
        margin-top: 12px;
        &:first-child {
          margin-top: 0;
        }
        .title {
          float: left;
        }
        .time {
          float: right;
          color: #b5b5b5;
        }
      }
    }
  }
</style>
