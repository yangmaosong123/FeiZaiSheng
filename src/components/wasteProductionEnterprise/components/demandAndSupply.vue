/**
*@file 订单管理==>>发布订单==>>供应/求购
*@author 周毖强
*/
<template>
  <div class="demand-and-supply">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="订单类型" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio label="供应">供应</el-radio>
          <el-radio label="求购"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入订单标题" style="width:302px;" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="种类" prop="kinds">
        <el-cascader
          :options="ruleForm.kinds"
          v-model="ruleForm.selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="发布时效" prop="aging">
        <el-select v-model="ruleForm.aging" placeholder="请选择发布时效" style="width:302px;">
          <el-option v-for="aging in ruleForm.agings"
                     :label="aging.label"
                     :value="aging.value"
                     :key="aging.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流承运" prop="accept">
        <el-radio-group v-model="ruleForm.accept">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="ruleForm.accept=='是'" label="物流公司" prop="logistic">
        <el-select v-model="ruleForm.logistic" placeholder="请选择物流公司" style="width:302px;">
          <el-option v-for="logistic in ruleForm.logistics"
                     :label="logistic.label"
                     :value="logistic.value"
                     :key="logistic.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入订单数量" style="width:302px;" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-select v-model="ruleForm.unit" placeholder="请选择单位" style="width:302px;">
          <el-option v-for="unit in ruleForm.units"
                     :label="unit.label"
                     :value="unit.value"
                     :key="unit.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="ruleForm.price" placeholder="请输入订单单价" style="width:302px;" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="最低限量" prop="limit">
        <el-input v-model="ruleForm.limit" placeholder="请输入订单单价" style="width:302px;" maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="phone">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品介绍" prop="introduce">
        <el-input type="textarea" v-model="ruleForm.introduce" placeholder="请输入商品介绍" style="width:302px;"></el-input>
      </el-form-item>
      <el-form-item label="商品图片" prop="goods">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input v-model="ruleForm.keywords" placeholder="请输入关键字" style="width:302px;"></el-input>
      </el-form-item>
      <el-form-item label="联系信息" prop="address">
        <ContactAddress></ContactAddress><!-- 联系地址 -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ContactAddress from '../../common/contactAddress'

  export default {
    name: "demandAndSupply",//供应+需求
    data() {
      return {
        //表单数据
        ruleForm: {
          type: "",//订单类型
          title: "",////订单标题
          kinds: [],//种类
          selectedOptions: [],//种类--数据
          aging: "",//发布时效
          agings: [
            {
              value: 1,
              label: "一个月"
            },
            {
              value: 2,
              label: "一年"
            },
          ],//发布时效--数据
          accept: "",//物流承运
          logistic: "",//物流公司
          logistics: [
            {
              value: 1,
              label: "圆通"
            },
            {
              value: 2,
              label: "韵达"
            },
          ],//物流公司--数据
          quantity: "",//数量
          unit: "",//单位
          units: [
            {
              value: 1,
              label: "克"
            },
            {
              value: 2,
              label: "千克"
            },
          ],//单位--数据
          price: "",//单价
          limit: "",//最低限量
          phone: "",//上传图片
          introduce: "",//商品介绍
          goods: "",//商品图片
          keywords: "",//关键字
          address: "",//联系信息
        },
        //验证规则
        rules: {
          type: [{required: true, message: '请选择订单类型', trigger: 'blur'}],
          title: [{required: true, message: '请输入订单标题', trigger: 'blur'}],
          aging: [{required: true, message: '请选择发布时效', trigger: 'blur'}],
          accept: [{required: true, message: '请选择物流承运', trigger: 'blur'}],
          logistic: [{required: true, message: '请选择物流公司', trigger: 'blur'}],
          quantity: [{required: true, message: '请输入订单数量', trigger: 'blur'}],
          unit: [{required: true, message: '请选择单位', trigger: 'blur'}],
          price: [{required: true, message: '请输入单价', trigger: 'blur'}],
          limit: [{required: true, message: '请输入最低限量', trigger: 'blur'}],
          phone: [{required: true, message: '请上传图片', trigger: 'blur'}],
          introduce: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          goods: [{required: true, message: '请上传商品图片', trigger: 'blur'}],
          keywords: [{required: true, message: '请输入关键字', trigger: 'blur'}],
          address: [{required: true, message: '请选择或者输入联系信息', trigger: 'blur'}],
        }
      };
    },
    created() {
    },
    components: {
      ContactAddress,//联系地址
    },
    methods: {
      //上传图片事件
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      },
      //种类
      handleChange() {
      },
    }
  };
</script>
<style lang="less" scoped>
  .demand-and-supply {
  }
</style>
