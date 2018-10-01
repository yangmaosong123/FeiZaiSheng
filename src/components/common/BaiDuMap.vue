<template>
  <!--<div id="allmap" style="width: 100%; height: {{mapHeight}}px"></div>-->
  <!--<div id="allmap":style="{width: '100%', height: mapHeight + 'px'}"></div>-->
  <div>
    <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>
    <el-dialog title="百度地图" :visible.sync="dialogTableVisible">
      <button @click="showMap">登录</button>
      <div id="allmap" v-bind:style="mapStyle"></div>
    </el-dialog>

  </div>


</template>
<script>


  export default {
    methods: {
      showMap: function () {

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint("北京市海淀区上地10街", function (point) {
          if (point) {
            //map.centerAndZoom(point, 16);
            ///map.addOverlay(new BMap.Marker(point));
            alert("坐标获取成功:经度:" + point.lng + "//纬度:" + point.lat)
          } else {
            alert("您选择地址没有解析到结果!");
          }
        }, "北京市");


      }
    },
    data: function () {
      return {
        mapStyle: {
          width: '100%',
          height: this.mapHeight + 'px'
        },
        dialogTableVisible: false
      }
    },
    props: {
      // 地图在该视图上的高度
      mapHeight: {
        type: Number,
        default: 500
      },
      // 经度
      longitude: {
        type: Number,
        default: 116.404
      },
      // 纬度
      latitude: {
        type: Number,
        default: 39.915
      },
      description: {
        type: String,
        default: '天安门'
      }
    },

  }
</script>
