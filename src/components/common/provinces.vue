<template>
  <div class="provinces">
    <el-form :model="ruleForm" ref="ruleForm">
      <el-form-item>
        <el-select v-model="ruleForm.wasteProvinceValue"
                   placeholder="请选择一个省份"
                   @focus="handleGetWasteProvince"
                   @change="handleChoseProvince">
          <el-option
            v-for="item in ruleForm.wasteProvinces"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="ruleForm.wasteCityValue"
                   placeholder="请选择一个市"
                   @change="handleChoseCity">
          <el-option
            v-for="item in ruleForm.wasteCites"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="ruleForm.wasteRegionsValue"
                   placeholder="请选择一个区"
                   @change="handleChoseBlock">
          <el-option
            v-for="item in ruleForm.wasteRegions"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top:8px;">
        <el-input v-model="ruleForm.detailedAddress"
                  placeholder="请输入详细地址信息"
                  style="width:396px;"
                  @blur="handleChildTransmitDataGiveFather"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: "provinces",//省市区
    data() {
      return {
        ruleForm: {
          wasteProvinceValue: '',//危废区域--省份值
          wasteProvinces: [],//危废区域--省份
          wasteCityValue: '',//危废区域--市值
          wasteCites: [],//危废区域--市
          wasteRegionsValue: '',//危废区域--区值
          wasteRegions: [],//危废区域--区
          detailedAddress: "",//详细地址
          longitude: "",//经度
          latitude: "",//纬度
        },
      };
    },
    created() {
      // this.getProvinceData(); //省-市-区
    },
    methods: {

      //省-市-区
      handleGetWasteProvince() {
        let that = this;
        that
          .$axios({
            method: "post",
            url: "/base/getProvinceList",
            data: {
              moduleCode: "qy",
              parentId: 0
            }
          })
          .then(function (res) {
            if (res.data.status === 200) {
              that.ruleForm.wasteProvinces = res.data.data;
            }
          })
          .catch(function (err) {
            alert(err);
          });
      },

      // 选择市
      handleChoseProvince(e) {
        let that = this;
        for (let i in that.ruleForm.wasteProvinces) {
          if (e === that.ruleForm.wasteProvinces[i].id) {
            that
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: that.ruleForm.wasteProvinces[i].id
                }
              })
              .then(function (res) {
                if (res.data.status === 200) {
                  that.ruleForm.wasteCites = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区
      handleChoseCity(e) {
        let that = this;
        for (let i in that.ruleForm.wasteCites) {
          if (e === that.ruleForm.wasteCites[i].id) {
            that
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: that.ruleForm.wasteCites[i].id
                }
              })
              .then(function (res) {
                if (res.data.status === 200) {
                  that.ruleForm.wasteRegions = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区县
      handleChoseBlock(e) {
        this.E = e;
        console.log(this.E);
      },

      //将子组件数据传递给你组件
      handleChildTransmitDataGiveFather() {
        let _this = this;
        if (
          _this.ruleForm.wasteProvinceValue &&
          _this.ruleForm.wasteCityValue &&
          _this.ruleForm.wasteRegionsValue &&
          _this.ruleForm.detailedAddress
        ) {
          let myGeo = new BMap.Geocoder();
          myGeo.getPoint(_this.ruleForm.wasteCityValue + _this.ruleForm.wasteRegionsValue + _this.ruleForm.detailedAddress, function (point) {
            if (point) {
              // alert("坐标获取成功:经度:" + point.lng + "//纬度:" + point.lat)
              _this.ruleForm.longitude = point.lng;
              _this.ruleForm.latitude = point.lat;
              _this.$emit("handleGetChildData", _this.ruleForm);
            } else _this.$message({
              type: "warning",
              message: "没有获取到你的地理信息"
            });
          }, _this.ruleForm.wasteProvinceValue);
        }
        else _this.$message({
          type: "warning",
          message: "地址信息必须填写完整，请返回修改！"
        });
      },
    }
  };
</script>
<style>

</style>
