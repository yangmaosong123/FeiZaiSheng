<template>
  <div class="address">
    <div class="address-content">
      <h3>联系人地址信息</h3>
      <el-form :model="addressRuleForm"
               :rules="addressRuleFormRules"
               ref="addressRuleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="addressRuleForm.linkman" placeholder="请输入联系人信息"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addressRuleForm.linkman" placeholder="请输入联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addressRuleForm.linkman" placeholder="请输入联系人邮箱"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    name: "address",//地址
    data() {
      return {
        addressRuleForm: {//address表单--数据
          linkman: "",//联系人
          phone: "",//联系电话
          email: "",//邮箱
        },
        addressRuleFormRules: {//address表单--验证规则
          linkman: [
            {required: true, message: '请输入联系人信息', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入联系人电话', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入联系人邮箱', trigger: 'blur'}
          ]
        }
      };
    }
  };
</script>
<style lang="less" scoped>
  .address {
    .address-content {
      background: rgba(242, 242, 242, 1);
    }
  }
</style>
