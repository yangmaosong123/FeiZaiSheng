/**
*@file 联系地址
*@author 周毖强
*/
<template>
  <div class="contact-address">

    <!-- 选择联系地址 -->
    <div class="select">
      <el-select v-model="value"
                 placeholder="请选择一个联系地址"
                
                 @change="handleAssignmentData"
                 @blur="handleTransmitDataToFather"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.contacts"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    <!-- 联系地址--表单 -->
    <div class="form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item class="item-display" label="联系人" prop="name">
          <el-input v-model="ruleForm.name" style="width:280px;" disabled></el-input>
        </el-form-item>
        <el-form-item class="item-display" label="联系电话" prop="phone">
          <el-input v-model="ruleForm.phone" style="width:280px;" disabled></el-input>
        </el-form-item>
        <el-form-item class="item-display" label="所在地区" prop="area">
          <el-input v-model="ruleForm.area" style="width:280px;" disabled></el-input>
        </el-form-item>
        <el-form-item class="item-display" label="详细地址" prop="address">
          <el-input v-model="ruleForm.address" style="width:280px;" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  export default {
    name: "contactAddress",//联系地址
    data() {
      return {
        value: "",////联系地址--值
        defaultValue: "",//默认地址--值
        options: [],//联系地址--数据
        ruleForm: {
          name: "",//联系人
          phone: "",//联系电话
          area: "",//所在地区
          address: "",//联系地址
        },//联系地址--表单
        rules: {
          name: [{required: true, message: '请输入联系人', trigger: 'blur'}],
          phone: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
          area: [{required: true, message: '请输入所在地区', trigger: 'blur'}],
          address: [{required: true, message: '请输入联系地址', trigger: 'blur'}],
        }//联系地址--规则
      };
    },
    created() {
      //this.handleGetDefaultAddressInfo(); //获取默认地址信息
      this.handleGetAddress();
      
    },
    watch: {
      value(val) {
        this.value = val;
        console.log("当前value的值为：", this.value);
        this.handleTransmitDataToFather();
        this.handleAssignmentData()
      }
    },

    methods: {

      //获取默认地址信息
      handleGetDefaultAddressInfo() {
        let _this = this;
        _this.$axios({
          method: "post",
          // url: "/addressManage/selectOne",
          // url: _this.$store.state.recycleAddr + "/addressManage/selectOne",
          url: "/addressManage/selectOne",
        })
          .then((res) => {
            if (res.data.status === 200) {
              _this.value = res.data.data[0].id;
              _this.defaultValue = res.data.data[0].id;
              console.log('_this.defaultValue', _this.defaultValue);
              _this.ruleForm.name = res.data.data[0].contacts;
              _this.ruleForm.phone = (res.data.data[0].phone && res.data.data[0].fixedLine) ?
                res.data.data.phone + " / " + res.data.data[0].fixedLine :
                (res.data.data.phone ? res.data.data[0].phone : (res.data.data[0].fixedLine ? res.data.data[0].fixedLine : ""));
              _this.ruleForm.area = res.data.data[0].provinceName + " " + res.data.data[0].cityName + " " + res.data.data[0].regionName + " ";
              _this.ruleForm.address = res.data.data[0].address;
            }           
          });
      },

      //获取地址详情
      handleGetAddress() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/addressManage/contactList",
          data: ""
        })
          .then((res) => {
            if (res.data.status === 200) {
              _this.options = res.data.data;
              _this.$store.state.rec.addr=res.data.data;
              _this.handleGetDefaultAddressInfo();
            }
          });
      },

      //根据id赋值地址信息
      handleAssignmentData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/addressManage/get",
          data: {
            id: /^[\u3220-\uFA29]+$/.test(_this.value) ? _this.defaultValue : _this.value
          }
        })
          .then((res) => {
            console.log("_this.defaultValue", _this.defaultValue);
            // console.log('_this.value', _this.value);
            if (res.data.status === 200) {
              _this.ruleForm.name = res.data.data[0].contacts;
              _this.ruleForm.phone = (res.data.data[0].phone && res.data.data[0].fixedLine) ?
                res.data.data[0].phone + " / " + res.data.data[0].fixedLine :
                (res.data.data[0].phone ? res.data.data[0].phone : (res.data.data[0].fixedLine ? res.data.data[0].fixedLine : ""));
              _this.ruleForm.area = res.data.data[0].provinceName + " " + res.data.data[0].cityName + " " + res.data.data[0].regionName + " ";
              _this.ruleForm.address = res.data.data[0].address;
            }
          });
      },

      //将值传递给父组件
      handleTransmitDataToFather() {
        let _this = this;
        _this.$emit("getChildData", _this.defaultValue, _this.value);
      },
    }
  };
</script>
<style lang="less" scoped>
  .contact-address {
    padding-top: 30px;
    .select {
      margin: 10px 0 10px 0;
    }
    .form {
      overflow: hidden;
      .item-display {
        display: inline-block;
        margin-top: 10px;
      }
    }
  }
</style>
