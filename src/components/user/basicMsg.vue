<template>
  <div class="basic">
    <h3 style="margin:20px;" v-show="basicBtn">基本信息 </h3>
    <div class="info" v-show="basicBtn">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="企业用户：">
          <el-input v-model="form.account" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属行业：" prop="industry">
          <el-radio-group v-model="form.enterpriseType">
            <el-radio disabled :label="item.itemCode" v-for="item in form.companyTypeList" :key="item.id">
              {{item.title}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请输入联系邮箱"></el-input>
        </el-form-item>
        <el-form-item label="企业名称：" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger"
                     style="background:#fff;color:#208dd6;border:1px solid #208dd6;"
                     @click="handleClickEditPassword">修改密码
          </el-button>
          <el-button type="primary" style="background:#208dd6;" @click="submitForm('form')">保存</el-button>
          <router-link to="/user/detailedMsg">(为更好的体验请点击完善企业信息)</router-link>
        </el-form-item>
      </el-form>

    </div>

    <!-- 修改密码 -->
    <h3 style="margin:20px;" v-show="!basicBtn">修改密码</h3>
    <div class="info" v-show="!basicBtn">
      <el-form :model="editPasswordForm"
               :rules="editPasswordFormRules"
               ref="editPasswordForm"
               label-width="120px">
        <el-form-item label="旧密码：" prop="formerPassword">
          <el-input type="password"
                    v-model="editPasswordForm.formerPassword"
                    placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input maxlength="12" type="password"
                    :disabled="newPasswordDisabled"
                    v-model="editPasswordForm.newPassword"
                    placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="newPassword1">
          <el-input type="password"
                    :disabled="newPassword1Disabled"
                    v-model="editPasswordForm.newPassword1"
                    placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="background:#208dd6;"
                     @click="handleSubmitFormEditPassword('editPasswordForm')">保存
          </el-button>
          <el-button type="primary" style="background:#208dd6;"
                     @click="handleSubmitFormEditResetPassword">重置密码
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>

  export default {
    data() {

      // 校验手机号
      let changePhone = (rule, value, callback) => {
        if (!/^1[34578]\d{9}$/.test(value))
          return callback(new Error("请输入11位有效的手机号码，请返回修改！"));
        else callback();
      };

      // 校验邮箱
      let changeEmail = (rule, value, callback) => {
        let reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.(?:com|cn|com.cn)))$/;
        if (!reg.test(value))
          return callback(new Error("用户邮箱格式为[example@example.com]，请返回修改！"));
        else callback();
      };

      // 校验旧密码
      let changeFormerPassword = (rule, value, callback) => {
        let _this = this;
        if (_this.$store.state.password != value)
          return callback(new Error("旧密码不正确，请重新输入！"));
        else callback();
      };

      // 校验两次密码输入是否一致
      let changeNewPassword = (rule, value, callback) => {
        let _this = this;
        if (!_this.editPasswordForm.formerPassword)
          return callback(new Error("请先输入旧密码！"));
        else if (!value) return callback(new Error("请输入新密码！"));
        else if (_this.$store.state.password == value)
          return callback(new Error("新密码与旧密码相同，请返回修改！"));
        else {
          _this.newPasswordDisabled = true;
          _this.newPassword1Disabled = false;
          callback();
        }
      };

      // 校验两次密码输入是否一致
      let changeNewPassword1 = (rule, value, callback) => {
        let _this = this;
        if (!value) return callback(new Error("请两次输入新密码！"));
        else if (_this.editPasswordForm.newPassword1 != _this.editPasswordForm.newPassword)
          return callback(new Error("两次密码输入不一致，请返回修改！"));
        else callback();
      };


      return {
        basicBtn: true,//控制基本信息显示隐藏
        form: {
          account: "",//企业用户、
          enterpriseType: "",//企业类型
          phone: "",//联系电话
          email: "",//联系邮箱
          enterpriseName: "",//企业名称
          companyTypeList: "",
        },

        rules: {
          checkedId: [
            {required: true, message: '请选择企业类型', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入联系电话', trigger: 'blur'},
            {validator: changePhone, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入联系邮箱', trigger: 'blur'},
            {validator: changeEmail, trigger: 'blur'}
          ],
          companyName: [
            {required: true, message: '请输入企业名称', trigger: 'blur'},
          ],
        },

        //修改密码
        editPasswordForm: {
          formerPassword: "",//旧密码
          newPassword: "",//新密码
          newPassword1: "",//确认新密码
        },
        newPasswordDisabled: false,
        newPassword1Disabled: true,
        //修改密码--验证规则
        editPasswordFormRules: {
          formerPassword: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
            {validator: changeFormerPassword, trigger: 'blur'}
          ],
          newPassword: [
            {min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur'},
            {validator: changeNewPassword, trigger: 'blur'}
          ],
          newPassword1: [
            {validator: changeNewPassword1, trigger: 'blur'}
          ],
        }

      };
    },
    created() {
      let _this = this;
      _this.getBeginData();// 初始化企业基本信息数据
      _this.$axios({
        method: "post",
        url: "/base/findDictionary",
        data: {
          moduleCode: "qylx"
        }
      }).then(res => {
        _this.form.companyTypeList = res.data.data.qylx;
      });
    },
    mounted() {
      this.getBeginData();// 初始化企业基本信息数据
    },
    methods: {

      // 初始化企业基本信息数据
      getBeginData() {
        let _this = this;
        _this.$axios({
          method: "post",
          withCredentials: true,
          url: "/company/registerInfo"
        }).then(res => {
          switch (res.data.status) {
            case 200:
              let {userId, account, phone, email, enterpriseName, enterpriseType, enterpriseTypeStatus} = res.data.data;
              _this.form.account = account;
              _this.form.phone = phone;
              _this.form.email = email;
              _this.form.enterpriseName = enterpriseName;
              _this.form.enterpriseType = enterpriseType;
              _this.$store.state.enterpriseTypeStatus = enterpriseTypeStatus;
              _this.$store.state.userId = userId;
              break;
          }
        });
      },

      // 保存基本信息
      submitForm(form) {
        let _this = this;

        this.$refs[form].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/company/updateRegisterInfo",
              data: _this.form
            }).then((res) => {
              if (res.data.status === 200) {
                _this.$message({
                  type: 'success',
                  message: "用户信息保存成功！"
                });
              }
            })
          }
        });
      },

      //点击修改密码
      handleClickEditPassword() {
        let _this = this;
        _this.basicBtn = false;
      },

      //重置密码
      handleSubmitFormEditResetPassword() {
        let _this = this;
        _this.newPasswordDisabled = false;
        _this.newPassword1Disabled = true;
      },

      //保存修改密码
      handleSubmitFormEditPassword(editPasswordForm) {
        let _this = this;
        _this.$refs[editPasswordForm].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/user/updatePassword",
              data: {
                id: _this.$store.state.userId,//用户id
                password: _this.editPasswordForm.newPassword//新密码
              }
            }).then((res) => {
              if (res.data.status === 200) {
                _this.$message({
                  type: 'success',
                  message: "密码修改成功！"
                });
                _this.basicBtn = true;
                _this.newPasswordDisabled = false;
                _this.newPassword1Disabled = true;
                _this.editPasswordForm = {
                  formerPassword: "",//旧密码
                  newPassword: "",//新密码
                  newPassword1: ""//确认新密码
                };
                _this.$router.push("/login");
              }
            });
          } else return false;
        });
      },
    }
  };
</script>


