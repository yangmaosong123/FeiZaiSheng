<template>
  <div class="market-index">
    <div class="charts" :style="bigStyle">
      <img src="../../../assets/img/index-icon/quotation.png" style="margin:21px 0 0 20px;">
      <ul class="tags">
        <li class="item" v-for="(item,index) in tags"
            :class="{'item-border':index==currentIndex}"
            :key="item.id"
            @click="handleClickTag(item.itemCode,index)">
          {{item.title}}
        </li>
      </ul>
      <div id="myChart" class="item-chart chart"></div>
      <div class="item-chart statistics " style="padding-top: 45px;">
        <div>今日成交量：<p>{{todayVolume}}<span style="margin-left:10px;">单</span></p></div>
        <div>今日平均单价：<p><span style="margin-right:10px;">￥</span>{{average}}.00</p></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "marketIndex",//行情指数
    data() {
      return {
        bigStyle: {
          background: "#fff"
        },

        currentIndex: 0,//当前项
        tags: [],//页签

        categoryType: "",

        todayVolume: "",//今日成交总数
        average: "",//今日成交单价
      };
    },
    created() {
      let _this = this;
      _this.getLoadingTagsList();//加载页签数据
    },
    mounted() {
      let _this = this;
      _this.handleClickTag(_this.categoryType, _this.currentIndex);//加载页签数据
    },
    methods: {

      //加载页签数据
      getLoadingTagsList() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionaryByRecycl",
          data: {
            moduleCode: "hslb"
          }
        }).then((res) => {
          _this.tags = res.data.data;
          _this.tags.map((item, index) => {
            if (index === 0) {
              _this.currentIndex = index;
              _this.categoryType = item.itemCode;
              _this.$axios({
                method: "post",
                url: _this.$store.state.recycleAddr + "/recOrder/marketIndex",
                data: {categoryType: item.itemCode}
              }).then((res) => {
                if (res.data.status === 200) {
                  let myChart = _this.$echarts.init(document.getElementById('myChart')),
                    option = {
                      tooltip: {
                        trigger: 'axis'
                      },
                      legend: {
                        data: ['平均单价', '成交订单']
                      },
                      grid: {
                        left: '3%',
                        right: '6%',
                        bottom: '5%',
                        containLabel: true
                      },
                      toolbox: {
                        feature: {
                          // saveAsImage: {}
                        }
                      },
                      xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: res.data.data[0].datetime,
                        axisLabel: {
                          interval: 0,
                          rotate: -30,
                        }
                      },
                      yAxis: {
                        type: 'value'
                      },
                      series: [
                        {
                          name: '平均单价',
                          type: 'line',
                          stack: '总量',
                          data: res.data.data[0].price
                        },
                        {
                          name: '成交订单',
                          type: 'line',
                          stack: '总量',
                          data: res.data.data[0].volume
                        }
                      ]
                    };
                  myChart.setOption(option);

                  _this.todayVolume = res.data.data[0].volume[res.data.data[0].volume.length - 1];
                  _this.average = res.data.data[0].price[res.data.data[0].price.length - 1];
                }
              });
            }
          });
        });
      },

      //tag事件
      handleClickTag(itemCode, index) {
        let _this = this;
        _this.categoryType = itemCode;
        _this.currentIndex = index;

        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + "/recOrder/marketIndex",
          data: {categoryType: _this.categoryType}
        }).then((res) => {
          if (res.data.status === 200) {
            let myChart = _this.$echarts.init(document.getElementById('myChart')),
              option = {
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['平均单价', '成交订单']
                },
                grid: {
                  left: '3%',
                  right: '6%',
                  bottom: '5%',
                  containLabel: true
                },
                toolbox: {
                  feature: {
                    // saveAsImage: {}
                  }
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: res.data.data[0].datetime,
                  axisLabel: {
                    interval: 0,
                    rotate: -30,
                  }
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '平均单价',
                    type: 'line',
                    stack: '总量',
                    data: res.data.data[0].price
                  },
                  {
                    name: '成交订单',
                    type: 'line',
                    stack: '总量',
                    data: res.data.data[0].volume
                  }
                ]
              };
            myChart.setOption(option);

            _this.todayVolume = res.data.data[0].volume[res.data.data[0].volume.length - 1];
            _this.average = res.data.data[0].price[res.data.data[0].price.length - 1];
          }
        });

      }

    }
  };
</script>
<style lang="less" scoped>
  .market-index {
    float: left;
    width: 685px;
    height: 300px;
    border-top: 2px solid #47bf01;
    .title {
      margin-bottom: 5px;
      // background: red;
      .line {
        margin-left: 30px;
        display: inline-block;
        width: 484px;
        height: 50px;
        background: url(../../../assets/img/line.png);
      }
    }
    .charts {
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      overflow: hidden;
      width: 685px;
      .tags {
        padding: 20px 20px 0 20px;
        float: right;
        img {
          vertical-align: middle;
        }
        .item {
          display: inline-block;
          color: #b8b8b8;
          font-size: 14px;
          margin-left: 20px;
          &:first-child {
            margin-left: 0;
          }
          &.item-border {
            border-bottom: 1px solid #676767;
            color: #676767;
          }
          &:hover {
            cursor: pointer;
            color: #797979;
          }
        }
      }
      .item-chart {
        height: 220px;
        color: #989898;
        font-weight: bold;
        margin-bottom: 10px;
        p {
          font-size: 20px;
          color: #47bf01;
          span {
            font-size: 18px;
            color: #888888;

          }
        }
      }
      .chart {
        float: left;
        width: 485px;
        height: 220px;
      }
      .statistics {
        padding-left: 35px;
        float: right;
        padding-top: 4px;
        width: 200px;
        height: 220px;
      }
    }
  }
</style>
