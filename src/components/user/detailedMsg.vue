/**
* @file 完善企业信息
@author 周毖强
<template>
  <div class="improve-enterprise-information">

    <!-- 公共标题 -->
    <CommonTitle title="订单管理"></CommonTitle>

    <!-- 企业基本信息 -->
    <div class="basic-information">
      <el-form :model="enterpriseForm"
               :rules="enterpriseFormRules"
               ref="enterpriseForm"
               label-width="150px"
               class="demo-ruleForm basic-information-form">
        <el-form-item style="background:#ddd;">
          <h3 class="title">企业基本信息</h3>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="enterpriseForm.unitName"
                    placeholder="请输入单位名称" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item label="单位简称" prop="unitAbbreviation">
          <el-input v-model="enterpriseForm.unitAbbreviation"
                    placeholder="请输入企业简称" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" required>
          <el-select v-model="enterpriseForm.province"
                     placeholder="请选择一个省份"
                     @change="selectProvince">
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.title"
              :value="item.itemCode">
            </el-option>
          </el-select>
          <el-select v-model="enterpriseForm.city"
                     placeholder="请选择一个市"
                     @change="handleChoseCity">
            <el-option
              v-for="item in cites"
              :key="item.id"
              :label="item.title"
              :value="item.itemCode">
            </el-option>
          </el-select>

          <el-select v-model="enterpriseForm.area "
                     placeholder="请选择一个区"
                     @change="handleChoseBlock">
            <el-option
              v-for="item in regions"
              :key="item.id"
              :label="item.title"
              :value="item.itemCode">
            </el-option>
          </el-select>
          <el-input v-model="enterpriseForm.unitAddress"
                    placeholder="请输入详细地址信息"
                    style="width:80%;margin-top:10px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="fixedTelephone">
          <el-input v-model="enterpriseForm.fixedTelephone"
                    placeholder="请输入固定电话" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item label="法人代表" prop="legalRepresentative">
          <el-input v-model="enterpriseForm.legalRepresentative"
                    placeholder="请输入法人代表" style="width:80%;"></el-input>
        </el-form-item>
        <el-form-item label="单位组织机构代码" prop="unitOrganizationCode">
          <el-input v-model="enterpriseForm.unitOrganizationCode"
                    placeholder="请输入单位组织机构代码" style="width:80%;"></el-input>
        </el-form-item>

        <el-form-item style="background:#ddd;">
          <h3 class="title">企业详细信息</h3>
        </el-form-item>
        <el-form-item label="单位logo" required>
          <el-upload
            class="avatar-uploader"
            :action="this.$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :data="logoParam"
            :on-change="handleOnChange"
            :on-success="handleAvatarSuccess">
            <img
              v-if="enterpriseForm.unitLogo"
              :src="$store.state.outputImgByIdUrl+enterpriseForm.unitLogo"
              class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="介绍图片" required>
          <el-upload
            :action="this.$store.state.fileUploadUrl"
            list-type="picture-card"
            :on-remove="handleBeforeIntroduceRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :file-list="introduction"
            :on-exceed="handleExceed"
            :on-success='handleCompanyUploadIntroduce'>
            <i class="el-icon-plus"></i>
          </el-upload>
          <span style="color:#ddd;">建议上传：12000*250的图片</span>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-radio-group v-model="enterpriseForm.industry">
            <el-radio :label="item.itemCode" v-for="item in dictionay.sshy" :key="item.id">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司性质" prop="companyProperties">
          <el-select v-model="enterpriseForm.companyProperties"
                     placeholder="请选择公司性质">
            <el-option
              v-for="item in dictionay.gsxz"
              :key="item.id"
              :label="item.title"
              :value="item.itemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要产品" prop="mainProducts">
          <el-checkbox-group v-model="enterpriseForm.mainProducts">
            <el-checkbox v-for="item in dictionay.zycp"
                         :label="item.itemCode"
                         :key="item.id">{{item.title}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="注册时间" prop="registrationTime">
          <el-date-picker
            v-model="enterpriseForm.registrationTime"
            value-format="yyyy-MM-dd"
            type="date"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="注册资本" prop="registrationCapital">
          <el-input v-model="enterpriseForm.registrationCapital"
                    placeholder="请选择注册资本">
          </el-input>
        </el-form-item>
        <el-form-item style="background:#ddd;">
          <h3 class="title">企业证书信息</h3>
        </el-form-item>
        <el-form-item label="企业证书上传" required>
          <el-upload
            :action="this.$store.state.fileUploadUrl"
            list-type="picture-card"
            :on-remove="handleBeforeCertificateRemove"
            :before-upload="beforeAvatarUpload"
            :limit="5"
            :file-list="certificateImg"
            :on-success='handleCompanyUploadCertificate'>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司介绍" prop="companyIntroduction">
          <el-input rows="5" type="textarea" v-model="enterpriseForm.companyIntroduction"
                    placeholder="请输入公司介绍" style="width:80%;" maxlength="5000"></el-input>
          <span style="color:#ddd;">最多不超过5000字</span>
        </el-form-item>
        <el-form-item>
          <el-button style="background:#208dd6;"
                     type="primary"
                     @click="handleEnterpriseFormSubmit('enterpriseForm')">
            保存
          </el-button>
          <el-button style="color:#208dd6;border:1px solid #208dd6;"
                     @click="handleEnterpriseFormResetForm('enterpriseForm')">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'

  export default {
    name: "detailedMsg",//企业详细信息
    data() {

      //验证固话
      let handleVerifyFixPhone = (rule, value, callback) => {
        if (!/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)) {
          callback(new Error('固话格式为：(0123-1234567 或 012-12345678)'));
        } else callback();
      };

      //验证企业介绍图片
      let handleVerifyIntroductionPhone = (rule, value, callback) => {
        console.log(value);
        if (!this.introduction.length) {
          callback(new Error('请上传企业介绍图片'));
        } else callback();
      };

      //验证企业证书
      let handleVerifyCertificateImg = (rule, value, callback) => {
        console.log(value);
        if (!this.certificateImg.length) {
          callback(new Error('请上传企业证书'));
        } else callback();
      };

      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        dictionay: {},
        provinces: [],
        regions: [],
        cites: [],
        logoParam: {},
        //介绍图片
        introduction: [],
        certificateImg: [],
        enterpriseForm: {
          unitLogo: "",//单位logo
        },//企业--表单
        enterpriseFormRules: {
          unitName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          unitAbbreviation: [
            {required: true, message: '请输入单位简称', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择一个省份', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择一个市', trigger: 'blur'}
          ],
          area: [
            {required: true, message: '请选择一个区', trigger: 'blur'}
          ],
          unitAddress: [
            {required: true, message: '请选择单位地址', trigger: 'blur'}
          ],
          fixedTelephone: [
            {required: true, message: '请输入固定电话', trigger: 'blur'},
            {validator: handleVerifyFixPhone, trigger: 'blur'}
          ],
          legalRepresentative: [
            {required: true, message: '请输入法人代表', trigger: 'blur'}
          ],
          unitOrganizationCode: [
            {required: true, message: '请输入单位组织机构代码', trigger: 'blur'}
          ],
          unitLogo: [
            {required: true, message: '请选择单位Logo', trigger: 'blur'}
          ],
          introductionPhone: [
            {validator: handleVerifyIntroductionPhone, trigger: 'blur'}
          ],
          industry: [
            {required: true, message: '请选择所属行业', trigger: 'blur'}
          ],
          companyProperties: [
            {required: true, message: '请选择公司性质', trigger: 'blur'}
          ],
          mainProducts: [
            {required: true, message: '请选择主要产品', trigger: 'blur'}
          ],
          registrationTime: [
            {required: true, message: '请选择注册时间', trigger: 'blur'}
          ],
          registrationCapital: [
            {required: true, message: '请选择注册资本', trigger: 'blur'}
          ],
          enterpriseCertificate: [
            {validator: handleVerifyCertificateImg, trigger: 'blur'}
          ],
          companyIntroduction: [
            {required: true, message: '请输入公司介绍', trigger: 'blur'}
          ],

        },//企业--表单--验证
      };
    },

    components: {
      CommonTitle,//公共标题
    },
    created() {

      this.handleTwoLoadingFormData();// 获取详信息情
      //this.handleGetWasteProvince();//省
      // this.handleChoseProvince();//市
      // this.handleChoseCity();//区
    },
    methods: {
      init() {
        let _this = this;
        this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "sshy,zycp,zczb,qy,gsxz"
          }
        }).then(res => {
          _this.dictionay = res.data.data;
        }).then(function () {
          _this.handleGetWasteProvince();
        });
      },


      selectProvince(val) {
        this.enterpriseForm.city = "";
        this.enterpriseForm.area = "";
        this.handleChoseProvince(val);
      },
      //省-市-区
      handleGetWasteProvince() {
        let _this = this;
        this
          .$axios({
            method: "post",
            url: "/base/getProvinceList",
            data: {
              moduleCode: "qy",
              parentId: 0
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              _this.provinces = res.data.data;

            }
          }).then(function () {
          if (_this.enterpriseForm.province && _this.enterpriseForm.province != "") {
            _this.handleChoseProvince(_this.enterpriseForm.province);
          }
        });
      },

      findItem(itemCode, data) {
        for (let i in data) {
          if (itemCode === data[i].itemCode) {
            return data[i];
          }
        }
      },

      // 选择市
      handleChoseProvince(val) {
        let _this = this;
        var itemProvice = this.findItem(val, this.provinces);
        this
          .$axios({
            method: "post",
            url: "/base/getListByProvinceId",
            data: {
              id: itemProvice.id
            }
          })
          .then(function (res) {
            if (res.data.status === 200) {
              _this.cites = res.data.data;
            }
          }).then(function () {
          if (_this.enterpriseForm.city && _this.enterpriseForm.city != "") {
            _this.handleChoseCity(_this.enterpriseForm.city);
          }
        });
      },

      //logo
      handleOnChange(file, fileList) {
        console.log(file);
        // file.response.data = "";
      },

      // 选择对应的区
      handleChoseCity(val) {
        let that = this;
        var itemCity = this.findItem(val, this.cites);
        that
          .$axios({
            method: "post",
            url: "/base/getListByProvinceId",
            data: {
              id: itemCity.id
            }
          })
          .then(function (res) {
            if (res.data.status === 200) {
              that.regions = res.data.data;
            }
          });

      },

      // 选择对应的区县
      handleChoseBlock(e) {
        this.E = e;
        console.log(this.E);
      },


      //上传文件格式限制
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 20;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      // //图片改变
      // handleChangeLogo(res, file) {
      //   let _this = this;
      //   // _this.enterpriseForm.unitLogo = res.data;
      // },

      //上传图片--单选
      handleAvatarSuccess(res, file) {
        this.logoParam.id = res.data;
        this.enterpriseForm.unitLogo = res.data;
        console.log("this.enterpriseForm.unitLogo", this.enterpriseForm.unitLogo);
      },


      //企业图片
      handleCompanyUploadIntroduce(res) {
        this.introduction.push({id: res.data, url: this.$store.state.outputImgByIdUrl + res.data});
        this.enterpriseForm.displayAttId = this.concatAttId(this.introduction);
        console.log("res", res);
      },

      concatAttId(fileList) {
        var ids = [];
        for (var i = 0; i < fileList.length; i++) {
          ids.push(fileList[i].id);
        }
        return ids.join(",");
      },

      //取消企业图片某一张图片上传
      handleBeforeIntroduceRemove(file, fileList) {
        this.introduction = fileList;
        this.enterpriseForm.displayAttId = this.concatAttId(this.introduction);
        this.removeImg(file);
      },

      //企业证书
      handleCompanyUploadCertificate(res) {
        this.certificateImg.push({id: res.data, url: this.$store.state.outputImgByIdUrl + res.data});
        this.enterpriseForm.certificateAttId = this.concatAttId(this.certificateImg);
      },

      //取消企业证书某一张图片上传
      handleBeforeCertificateRemove(file, fileList) {

        this.certificateImg = fileList;
        this.enterpriseForm.certificateAttId = this.concatAttId(this.certificateImg);
        this.removeImg(file);
      },

      removeImg(file) {
        this
          .$axios({
            method: "post",
            url: "/attachment/delete",
            data: {
              id: file.id
            }
          });

      },

      handleExceed() {
        let _this = this;
        _this.$message({
          type: "warning",
          message: "上传文件超出数量限制啦！"
        });
      },

      //表单提交
      handleEnterpriseFormSubmit(enterpriseForm) {
        var _this = this;
        var itemProvice = this.findItem(_this.enterpriseForm.province, this.provinces);
        var itemCity = this.findItem(_this.enterpriseForm.city, this.cites);
        var itemRegions = this.findItem(_this.enterpriseForm.area, this.regions);

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(itemProvice.title + itemCity.title + itemRegions.title + _this.enterpriseForm.unitAddress, function (point) {
          if (point) {
            //map.centerAndZoom(point, 16);
            ///map.addOverlay(new BMap.Marker(point));
            _this.enterpriseForm.longitude = point.lng;
            _this.enterpriseForm.latitude = point.lat;

            _this.$refs[enterpriseForm].validate((valid) => {
              if (valid) {
                _this.$axios({
                  method: "post",
                  url: "/company/updateDetailedInfo",
                  data: _this.enterpriseForm
                }).then((res) => {
                  switch (res.data.status) {
                    case 200:
                      _this.$message({
                        type: "success",
                        message: "保存成功！"
                      });
                      _this.$axios({
                        method: "post",
                        url: "/company/registerInfo"
                      }).then(res => {
                        switch (res.data.status) {
                          case 200:
                            let {enterpriseTypeStatus} = res.data.data;
                            _this.$store.state.enterpriseTypeStatus = enterpriseTypeStatus;
                            break;
                        }
                      });
                      break;
                  }
                })
              } else {
                _this.$message({
                  type: "warning",
                  message: "带红星的选项为必填项，请返回修改"
                });
                return false;
              }
            });

          } else {
            alert("您选择地址没有解析到结果!");
          }
        }, itemProvice.title);

      },

      //表单取消
      handleEnterpriseFormResetForm(formName) {
        this.$refs[formName].resetFields();
      },

      loadImg(bizObjId, bizObjName, callback) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/attachment/findByBizObj",
          data: {"bizObjId": bizObjId, "bizObjName": bizObjName}
        }).then(res => {
          callback(res);
        });
      },

      //当用户确定保存后，加载数据
      handleTwoLoadingFormData() {
        let _this = this;

        _this.$axios({
          method: "post",
          url: "/company/detailedInfo",
          data: ""
        }).then(res => {
          _this.enterpriseForm = res.data.data;
          _this.loadImg(_this.enterpriseForm.id, "COMPANY_DISPLAY_IMG", function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              _this.handleCompanyUploadIntroduce({data: res.data.data[i].id});
            }
          });

          _this.loadImg(_this.enterpriseForm.id, "ENTERPRISE_CERTIFICATE_IMG", function (res) {
            for (var i = 0; i < res.data.data.length; i++) {
              _this.handleCompanyUploadCertificate({data: res.data.data[i].id});
            }
          });


        }).then(function () {
          _this.init();

        });
      },
    }
  };
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="less" scoped>
  .improve-enterprise-information {
    .basic-information {
      .title {
        background: #ddd;
        padding: 10px 10px 10px 34%;
      }
    }
  }
</style>
