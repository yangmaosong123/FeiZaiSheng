<template>
<div class="main">
    <div class="forget-password">
        <h2>找回密码</h2>
        <div class="step">
            <el-steps :active="active" finish-status="success">
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3"></el-step>
                <el-step title="步骤 4"></el-step>
            </el-steps>
        </div>
        <div class="step-one" v-show="active==0">
            <el-form :model="accountRuleForm" :rules="accountRuleFormRules" ref="accountRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="企业账号" prop="account" style="margin:30px 0 10px 30%;">
                    <el-input v-model="accountRuleForm.account" placeholder="请输入企业账号" style="width:40%;"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="picCode" style="margin:30px 0 10px 30%;">
                    <el-input v-model="accountRuleForm.picCode" style="width:20%;"></el-input>
                    <img :src="picCodeUrl" style="display:inline-block;width:80px;height:26px;vertical-align:middle;border-radius:2px">
                    <span @click="flushPicCode">换一张</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="step-two" v-show="active==1">
            <span>邮箱：</span>
            <el-input v-model="email" disabled></el-input>
        </div>
        <div class="step-three" v-show="active==2">
            <el-form :model="passwordRuleForm" :rules="passwordRuleFormRules" ref="passwordRuleForm" label-width="100px" class="demo-ruleForm" style="margin:30px 0 10px 30%;">
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="passwordRuleForm.password" placeholder="请输入新密码" style="width:40%;"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input type="password" v-model="passwordRuleForm.password1" placeholder="请输入确认密码" style="width:40%;"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="step-four" v-show="active==3">
            <h3>密码修改成功!</h3>
        </div>
        <el-button style="margin:10px 0 0 460px;" @click="next" :disabled="disabled" v-show="showBtn">{{content}}</el-button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        let changeUser = (rule, value, callback) => {
            let _this = this;
            if (!value) {
                return callback(new Error("请输入企业账号！"))
            } else {
                _this.$axios({
                    method: "post",
                    url: "/user/checkAccount",
                    data: {
                        account: value
                    }
                }).then((res) => {
                    if (res.data.status == 500) {
                        callback();
                    } else {
                        return callback(new Error("该企业账号不存在,请返回修改"))
                    }
                })
            }
        };
        return {
            picCodeUrl: "",
            active: 0, //步骤-----0
            showBtn: "", //按钮---控制显示或隐藏
            content: "", //下一步--内容
            disabled: false,
            id: "", //用户id
            key: "", //用户key
            //表单数据
            accountRuleForm: {
                account: "", //企业账号
                picCode: "", //验证码
            },
            //表单验证规则
            accountRuleFormRules: {
                account: [{
                    validator: changeUser,
                    trigger: 'blur',
                    required: true
                }],
                picCode: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }]
            },
            passwordRuleForm: {
                password: "", //新密码
                password1: "", //确认密码
            },
            passwordRuleFormRules: {
                password: [{
                        required: true,
                        message: '请输入账号密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 20,
                        message: '长度在 6 到 20 个字符',
                        trigger: 'blur'
                    },
                ],
                password1: [{
                        required: true,
                        message: '请输入再次账号密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 20,
                        message: '长度在 6 到 20 个字符',
                        trigger: 'blur'
                    },
                ],
            }
        }
    },
    created: function () {
        this.handleGetUserInfo(); //用户信息存在  (存在的话，可直接跳到第三步骤)
    },
    mounted: function () {
        this.picCodeUrl
    },
    methods: {
        //更换一张验证码图片
        flushPicCode: function () {
            this.picCodeUrl = this.$axios.defaults.baseURL + "/attachment/randomImgForForgetPassword?t=" + (new Date()).getTime();
        },
        handleGetUserInfo: function () {
            let _this = this,
                url = window.location.href;
            _this.id = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
            _this.key = url.substring(url.lastIndexOf("=") + 1);
            _this.$axios({
                method: "post",
                url: "/user/checkPwdChgTimeout",
                data: {
                    id: _this.id,
                    key: _this.key
                }
            }).then((res) => {
                if (res.data.status == 200) {
                    _this.active = 2;
                    _this.content = "提交";
                    _this.disabled = false;
                }
            })
        },

        next: function () {
            let _this = this;
            if (_this.active == 0) {
                if (!_this.accountRuleForm.account) {
                    _this.$message({
                        type: 'warning',
                        message: '请填写企业账号'
                    });
                    return false;
                } else {
                    _this.$axios({
                        method: "post",
                        url: "/user/getUserBy",
                        data: {
                            account: _this.accountRuleForm.account,
                            picCode: _this.accountRuleForm.picCode
                        }
                    }).then((res) => {
                        if (res.data.status == 200) {
                            _this.email = res.data.data.email;
                            _this.active = 1;
                            _this.account = "发送邮件"
                        } else if (res.data.status == 300) {
                            _this.$message({
                                type: 'warning',
                                message: '验证码输入有误，请重新输入！'
                            });
                            _this.flushPicCode();
                        }
                    });
                    return true;
                }
            } else if (_this.active == 1) {
                _this.$axios({
                    method: "post",
                    url: "/user/findPwd",
                    data: {
                        account: _this.accountRuleForm.account,
                        picCode: _this.accountRuleForm.picCode,
                    }
                }).then((res) => {
                    if (res.data.status == 200) {
                        _this.content = "请登录邮箱,点击链接,找回密码";
                        _this.disabled = true;
                    }
                })
            } else if (_this.active == 2) {
                this.$refs[passwordRuleForm].validate((valid) => {
                    if (valid == true) {
                        _this.showBtn = true;
                        if (_this.passwordRuleForm.password != _this.passwordRuleForm.password1) {
                            _this.$message({
                                type: 'warning',
                                message: '两次输入密码不一致，请重新输入'
                            });
                        } else {
                            _this.$axios({
                                method: "post",
                                url: "/user/update",
                                data: {
                                    id: _this.id,
                                    password: _this.passwordRuleForm.password
                                }
                            }).then((res) => {
                                if (res.data.status == 200) {
                                    _this.active = 3;
                                    _this.showBtn = false;
                                }
                            })
                        }
                    } else {
                        return false
                    }
                })
            }
        }
    }
}
</script>

<style lang="less">
.forget-password {
    margin-top: 150px;

    h2 {
        margin-bottom: 20px;
    }

    h3 {
        font-size: 20px;
        margin: 50px 0 10px 46%;
    }

    .step-one {
        span {
            color: #666;
            padding-left: 10px;
        }

        span:hover {
            cursor: pointer;
            color: #208dd6;
        }
    }

    .step-two {
        margin: 30px 0 0 412px;

        span {
            font-size: 16px;
            color: #606266;
        }
    }

    .mailbox {
        width: 300px;

    }
}
</style>
