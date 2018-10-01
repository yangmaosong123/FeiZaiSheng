<template>
  <div class="loginBox clearfix main">
    <div class="container">
      <div class="login fr">
        <h2>会员登录</h2>
        <div class="name">
          <img class="icon1" src="../assets/img/usericon.png" alt="">
          <input style="padding-left: 43px;" type="text"
                 @keyup.enter="login"
                 v-model="username"
                 placeholder="请输入企业账号">
        </div>
        <div class="psd">
          <img class="icon2" src="../assets/img/passwordicon.png" alt="">
          <input style="padding-left: 43px;" type="password"
                 v-model="password"
                 @keyup.enter="login"
                 placeholder="请输入密码">
        </div>
        <div>
          <el-row style="height:60px;">
            <el-col :span="12" class="yzm">
              <img class="icon3" src="../assets/img/code.png" alt="">
              <input style="padding-left: 44px;" class="code" type="text"
                     v-model.trim="picCode"
                     @keyup.enter="login"
                     placeholder="请输入验证码">
            </el-col>
            <el-col :span="5" class="picture"><img :src="picCodeUrl"></el-col>
            <el-col :span="4" class="picture" style="padding:19px 0 0 10px; ">
              <span @click="flushPicCode">换一张</span>
            </el-col>
          </el-row>


        </div>


        <button @click="login" :disabled="controlBtn">登录</button>
         <button @click="testKY">跨域访问</button>
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
  import {setCookie, getCookie, delCookie} from '../assets/js/cookie.js'

  export default {
    data() {
      return {
        picCodeUrl: this.$axios.defaults.baseURL + "/attachment/randomImg",
        username: "",
        password: "",
        picCode: "",
        controlBtn: false,//防止用户多次点击
      };
    },
    mounted: function () {
      this.flushPicCode();
    },

    methods: {
      flushPicCode: function () {
        this.picCodeUrl = this.$axios.defaults.baseURL + "/attachment/randomImg?t=" + (new Date()).getTime();
      },
      // 登录
      login() {
        let _this = this;
        if (_this.username === "" || _this.password === "") {
          _this.$message({
            type: "warning",
            message: "请输入企业账号和密码",
          });
        }
        else if (!this.picCode.length) {
          _this.$message({
            type: "warning",
            message: "请输入验证码",
          });
        }
        else {
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
            switch (res.data.status) {
              case 200:
                setTimeout(() => {
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
                    data: {"province": _this.$store.state.curProvince.title}
                  }).then((res) => {
                    if (res.data.status === 200) {
                      _this.reload();
                      localStorage.setItem("province", _this.$store.state.curProvince.title);
                    }
                  });

                  _this.controlBtn = false;
                }, 1000);
                break;
              case 300:
                _this.$message({
                  type: "warning",
                  message: res.data.text,
                });
                _this.flushPicCode();
                _this.controlBtn = false;
                break;
            }
          });
        }
      },
      testKY(){
         this.$axios({
            method: "get",
            url: "http://www.sz.gov.cn/cn/"
          }).then(res => {    
            alert("ok.....")        
          });
      },

    }
  };
</script>


<style lang="less">
  .loginBox {
    background: url(../assets/img/login-bg.jpg) no-repeat;
    width: 100% !important;
    padding-top: 60px;
    .container {
      width: 1200px;
      height: 562px;
      margin: 0 auto;
    }
  }

  .login {
    width: 400px;
    height: 380px;
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #ededed;
    margin-top: 50px;

    .name {
      position: relative;
      .icon1 {
        position: absolute;
        left: 60px;
        top: 18px;
      }
    }
    .psd {
      position: relative;
      .icon2 {
        position: absolute;
        left: 60px;
        top: 18px;
      }
    }
    .yzm {
      position: relative;
      .icon3 {
        position: absolute;
        left: 60px;
        top: 20px;
      }
    }

    h2 {
      margin: 20px 0px 15px 25px;
      text-align: left;
    }
    input {
      background-color: #fff;
      color: #656565;;
      width: 300px;
      height: 40px;
      line-height: 40px;
      margin: 10px 22px;
      border: 1px solid #c0c0c0;

    }
    button {
      width: 300px;
      height: 40px;
      line-height: 30px;
      color: #fff;
      background: #208dd6;
      border: 0;
      margin-top: 10px;

    }
    button:hover {
      cursor: pointer;
      background: #2195da;
    }
    .code {
      margin-left: 49px;
      width: 150px;
    }
    .picture {
      padding-top: 15px;
      color: #666;
      img {
        width: 90px;
        height: 30px;
        margin-left: 5px;
      }
    }
    .picture:hover {
      cursor: pointer;
      color: #208dd6;
    }
    .info {
      width: 100%;
      margin: 20px 0;
      li {
        float: left;
        width: 50%;
        a {
          color: #6f6f6f;
        }
        a:hover {
          color: #208dd6;
        }
      }
    }
  }
</style>


