<template>
<div class="loginBox clearfix main">
    <div class="container">
        <div class="login fr">
            <h2>会员登录</h2>
            <div class="name">
                <img src="../assets/img/usericon.png" alt="" class="icon1">
                <input style="padding-left: 43px;" type="text" @keyup.enter="login" v-model="userName" placeholder="请输入企业账号">
            </div>
                <div class="psd">
                    <img src="../assets/img/passwordicon.png" alt="" class="icon2">
                    <input type="password" style="padding-left: 43px;" @keyup.enter="login" v-model="password" placeholder="请输入密码">
             </div>
                    <div>
                        <el-row style="height:60px;">
                            <el-col :span="12" class="yzm">
                                <img src="../assets/img/code.png" alt="" class="icon3">
                                <input type="text" style="padding-left: 44px;" class="code"  @keyup.enter="login" v-model.trim="picCode" placeholder="请输入验证码">
                 </el-col>
                                <el-col :span="5" class="picture"> <img src="picCodeUrl"></el-col>
                                    <el-col :span="4" class="picture" style="padding:19px 0 0 10px; ">
                                        <span @click="flushPicCode">换一张</span>
                                    </el-col>
                        </el-row>
                    </div>
                    <button @click="login" :disabled="controlBtn">登陆</button>
                    <div class="info clearfix">
                        <ul>
                            <li>
                                <router-link to="/forgetPassword">忘记密码</router-link>
                            </li>
                            <li>
                                <router-link to="/register">立即注册</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            userName: "", //账号
            password: "", //密码
            picCode: "", //验证码
            picCodeUrl: this.$axios.defaults.baseURL + "/attachment/randomImg",
            controlBtn: false, //防止用户多次点击
        }
    },
    created: function () {

    },
    mounted: function () {
        this.flushPicCode();
    },
    methods: {
        //更换验证码图片
        flushPicCode: function () {
            this.picCodeUrl = this.$axios.defaults.baseURL + "/attachment/randomImg?t=" + (new Date()).getTime();
        },
        //登陆
        login: function () {
            let _this = this
            if (_this.userName === "" || _this.password === "") {
                _this.$message({
                    type: "warning",
                    message: "请输入企业账号和密码",
                });
            } else if (!_this.picCode.length) {
                _this.$message({
                    type: "warning",
                    message: "请输入验证码",
                });
            } else {
                _this.controlBtn = true;
                _this.$axios({
                    method: "post",
                    url: "/user/login",
                    withCredentials: true,
                    data: {
                        account: _this.username,
                        password: _this.password,
                        picCode: _this.picCode
                    }
                }).then(res => {
                    if (res.data.status == 200) {
                        _this.$router.push("/main");
                        _this.$store.state.account = _this.username;
                        _this.$store.state.password = _this.password;
                        _this.$message({
                            type: "success",
                            message: "登录成功！"
                        });
                        _this.$axios({
                            method: "post",
                            url: "/user/setReqProvince",
                            data: {
                                "province": _this.$store.state.curProvince.title
                            }
                        }).then((res) => {
                            if (res.data.status === 200) {
                                _this.reload();
                                localStorage.setItem("province", _this.$store.state.curProvince.title);
                            }
                        });

                        _this.controlBtn = false;
                    } else {
                        _this.$message({
                            type: "warning",
                            message: res.data.text,
                        });
                        _this.flushPicCode();
                        _this.controlBtn = false;
                    }
                })
            }
        }
    }
}
</script>
