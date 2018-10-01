/**
*@file 订单管理==>>发布订单==>>危废
*@author 周毖强
*/
<template>
  <div class="release-sales-order">

    <!-- 订单发布表单 -->
    <div class="form-order">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="危废类型" prop="wasteType">
          <el-radio-group v-model="ruleForm.wasteType">
            <el-radio label="1">不可回收</el-radio>
            <el-radio label="2">可回收</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="危废类别" prop="wasteCategoryValue">
          <el-select v-model="ruleForm.wasteCategoryValue" placeholder="请选择危废类别" @change="handleWasteCategoryValue()">
            <el-option
              v-for="item in ruleForm.wasteCategories"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危废代码" prop="wasteCode">
          <el-input disabled v-model="ruleForm.wasteCode" placeholder="请选择危废代码" style="width:194px;"></el-input>
        </el-form-item>
        <el-form-item label="危废名称" prop="wasteName">
          <el-input v-model="ruleForm.wasteName" placeholder="请填写危废名称" style="width:194px;"></el-input>
        </el-form-item>
        <el-form-item label="年申成功截图：" class="img-box" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :action="this.$store.state.fileUploadUrl"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否定价" prop="whetherPricingValue" class="whetherPricing">
          <el-radio-group v-model="ruleForm.whetherPricingValue">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="ruleForm.quantity "
                    placeholder="请输入数量"
                    style="width:194px; margin-bottom:16px;"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="issueUnits">
          <el-select v-model="ruleForm.issueUnitValue" placeholder="请选择一个单位">
            <el-option
              v-for="item in ruleForm.issueUnits"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.whetherPricingValue==1" label="单价" prop="unitPrice">
          <el-input v-model="ruleForm.unitPrice"
                    placeholder="请输入单价"
                    style="width:194px; margin-top:16px;"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="uploadPhotos" class="upload-photos">
          <el-upload
            :action="this.$store.state.fileUploadUrl"
            list-type="picture-card"
            :on-remove="handleBeforeRemove"
            :before-upload="beforeAvatarUpload"
            :on-success='companyUpload'>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword" class="keyword">
          <el-input v-model="ruleForm.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="其他说明" prop="otherDescription">
          <el-input type="textarea" v-model="ruleForm.otherDescription" placeholder="请输入说明相关内容"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <!-- 联系地址组件 -->
          <ContactAddress @getChildData="getChildData"></ContactAddress>
        </el-form-item>
        <el-form-item>
          <el-button type="" @click="handleAbolish('ruleForm')">取消</el-button>
          <el-button type="primary" @click="handleShowDispositionEnterpriseDialog('ruleForm')">发布订单</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 选择处置企业 -->
    <div class="disposition-enterprise-dialog">

      <el-dialog
        title="选择处置企业"
        :visible.sync="orderDialogVisible"
        width="50%">

        <!-- 搜索表单 -->
        <el-form :model="searchRuleForm"
                 :rules="searchRuleFormRules"
                 ref="searchRuleForm"
                 label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="企业搜索：" class="form-item" style="display:inline-block;">
            <el-input v-model="searchRuleForm.keyword"
                      placeholder="请输入搜索关键字"
                      @keyup.enter.native="handleKeyUpEnter($event)"></el-input>
          </el-form-item>
          <el-form-item class="form-item" style="display:inline-block;">
            <el-button type="primary" @click="handleQueryKeyword()">搜索</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="enterpriseName"
            label="企业名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="企业信誉"
            width="120">
          </el-table-column>
          <el-table-column
            prop="registrationTime"
            label="注册时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="companyProperties"
            label="公司性质"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="registrationCapital"
            label="企业规模"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-box">
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>

        <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleSaveOrIssueOrder">确 定</el-button>
      </span>

      </el-dialog>
    </div>
  </div>
</template>
<script type=" text/ecmascript-6">
  import ContactAddress from '../../common/contactAddress'

  export default {
    name: "releaseSalesOrder",//订单发布
    data() {
      let handleJudgeIsNumber = (rule, value, callback) => {
        if (isNaN(value))
          return callback(new Error('数量/价格必须为数字，请返回修改！'));
        return callback();
      };
      return {
        //订单发布表单--数据
        ruleForm: {
          wasteType: "",//危废类型
          wasteCategoryValue: '',//危废类别--select值
          wasteCategories: [],//危废类别
          wasteCode: "",//危废代码
          wasteName: "",//危废名称
          AddressArea: "",//地址区域
          addressId: "",//联系地址Id
          wasteProvinceValue: '',//危废区域--省份值
          wasteProvinces: [],//危废区域--省份
          wasteCityValue: '',//危废区域--市值
          wasteCites: [],//危废区域--市
          wasteRegionsValue: '',//危废区域--区值
          wasteRegions: [],//危废区域--区
          detailedAddress: "",//详细地址
          imageUrl: '',//图片路径
          imgId: "",//图片id
          successInPhone: "",//年申图
          imgLogoId: "",//年申图Id
          whetherPricingValue: "",//是否定价
          quantity: "",//数量
          issueUnitValue: "",//单位-值
          issueUnits: [
            {
              value: 1,
              label: "克"
            },
            {
              value: 2,
              label: "千克"
            },
            {
              value: 3,
              label: "顿"
            },
            {
              value: 4,
              label: "台"
            },
            {
              value: 5,
              label: "个"
            },
            {
              value: 6,
              label: "个"
            }
          ],//
          unitPrice: "",//单价
          dialogImageUrl: '',//img路径
          dialogVisible: false,//img-dialog--默认隐藏
          successInPhone: "",//年申成功图
          certificateAttId: "",//图片id
          certificateAttIds: [],//图片id集合
          newCertificateAttIds: [],//图片id集合--有删除操作
          keyword: "",//关键字
          otherDescription: ""//其他说明
        },
        orderDialogVisible: false,//发布订单弹框--默认隐藏
        searchRuleForm: {//搜索表单--数据
          keyword: "",//搜索关键字
          multipleSelection: [],//公司id集合
        },
        tableData: [],//表格

        page: {
          total: 0,//总数
          pageNum: 5,//每页条数
          currentPage: 1,//当前页
        },
        rules: {
          wasteType: [
            {required: true, message: '请选择危废类型', trigger: 'blur'}
          ],
          wasteCategoryValue: [
            {required: true, message: '请选择危废类别', trigger: 'blur'}
          ],
          wasteCode: [
            {required: true, message: '请输入危废代码', trigger: 'blur'}
          ],
          wasteName: [
            {required: true, message: '请输入危废名称', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '请选择年申图', trigger: 'blur'}
          ],
          AddressArea: [
            {required: true, message: '请选择地址区域', trigger: 'blur'}
          ],
          whetherPricingValue: [
            {required: true, message: '请选择是否定价', trigger: 'blur'}
          ],
          quantity: [
            {required: true, message: '请输入数量', trigger: 'blur'},
            {validator: handleJudgeIsNumber, trigger: 'blur'}
          ],
          issueUnits: [
            {required: true, message: '请选择单位', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入单价', trigger: 'blur'},
            {validator: handleJudgeIsNumber, trigger: 'blur'}
          ],
          // uploadPhotos: [
          //   {required: true, message: '请选择图片', trigger: 'blur'}
          // ],
          keyword: [
            {required: true, message: '请输入关键字', trigger: 'blur'}
          ],
        }
      };
    },
    created() {
      this.handleLoadingWasteCategories();//危废类别
    },
    components: {
      ContactAddress,//联系地址
    },
    methods: {

      //转换成element-select数据格式
      handleChangeElement(obj) {
        let result = [];
        for (let i = 0; i < obj.length; i++) {
          result.push({});
          result[i].value = obj[i].id;
          result[i].label = obj[i].title
        }
        return result;
      },

      //危废类别
      handleLoadingWasteCategories() {
        let _this = this;
        _this.$axios({
          method: "post",
          withCredentials: true,
          url: "/base/findDictionary",
          data: {
            moduleCode: "wflb"
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.ruleForm.wasteCategories = this.handleChangeElement(res.data.data.wflb);
            console.log('危废类别', _this.ruleForm.wasteCategories);
            console.log('危废类别对应的id：', _this.ruleForm.wasteCategories.value);
          } else {
            this.$message({
              type: 'warning',
              message: "暂无相关数据！"
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      //监听危废类别值改变
      handleWasteCategoryValue() {
        let _this = this;
        _this.$axios({
          method: "post",
          withCredentials: true,
          url: "/base/findDictionary",
          data: {
            moduleCode: "wflb"
          }
        }).then((res) => {
          if (res.data.status === 200) {
            for (let i = 0; i < res.data.data.wflb.length; i++) {
              let item = res.data.data.wflb[i];
              if (_this.ruleForm.wasteCategoryValue === item.title) {
                _this.ruleForm.wasteCode = item.itemCode;
              }
            }

          } else {
            this.$message({
              type: 'warning',
              message: "暂无相关数据！"
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      //获取子组件传递过来的数据
      getChildData(value) {
        this.ruleForm.addressId = value;
        console.log("已获取到子组件的信息：", this.ruleForm.addressId);
      },

      //取消发布订单
      handleAbolish(formName) {
        this.$refs[formName].resetFields();
      },

      //显示发布订单弹框
      handleShowDispositionEnterpriseDialog(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.orderDialogVisible = true;
            this.handleLoadingTableData();//加载表数据
          } else
            return false;
        });
      },

      //上传图片--单选
      handleAvatarSuccess(res, file) {
        let _this = this;
        this.ruleForm.imageUrl = _this.$store.state.outputImgByIdUrl + res.data;
        this.ruleForm.imgLogoId = res.data;
        console.log("dfasdfasdf", res.data);
      },
      //上传文件格式限制
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //上传图片--支持多选
      companyUpload(content) {
        console.log("返回成功：", content);
        this.ruleForm.certificateAttIds.push(content.data);
      },

      //取消某一张图片上传
      handleBeforeRemove(file, fileList) {
        let _this = this;
        console.log('您取消的图片id为：', file.response.data);
        _this.ruleForm.newCertificateAttIds = _this.ruleForm.certificateAttIds.filter(item => item !== file.response.data);
        console.log('您取消的图片返回结果为：', _this.ruleForm.newCertificateAttIds);
      },

      //加载表数据
      handleLoadingTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/company/selectCompanyEnter",
          data: {
            enterpriseName: this.searchRuleForm.keyword,//搜索关键字
            pageIndex: this.page.currentPage,//当前页
            pageSize: this.page.pageNum,//每页条数
            latitude: "",
            longitude: ""
          }
        })
          .then((res) => {
            if (res.data.status === 200) {
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              console.log("表格数据", _this.tableData);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      ,

      //搜索
      handleQueryKeyword() {
        this.handleLoadingTableData();//加载表数据
      }
      ,
      //键盘搜索
      handleKeyUpEnter(event) {
        if (event.keyCode === 13)
          this.handleLoadingTableData();//加载表数据
      }
      ,

      //表格事件
      handleSelectionChange(val) {
        this.searchRuleForm.multipleSelection = val.map((item, index) => item.id);
        console.log("你已经选择了：" + this.searchRuleForm.multipleSelection);
      }
      ,

      //分页事件
      handleSizeChange(val) {
        this.page.pageNum = val;
        this.handleLoadingTableData();//加载表数据
      }
      ,
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.handleLoadingTableData();//加载表数据
      }
      ,

      //保存订单
      handleSaveOrIssueOrder() {
        let _this = this;
        // _this.getChildData();
        _this.$axios(
          {
            method: "post",
            url: "/order/create",
            withCredentials: true,
            data: {
              companyId: this.searchRuleForm.multipleSelection.join(),//公司id集合
              orderState: 1,//0--保存订单
              daType: _this.ruleForm.wasteType,//危废类型
              daCategory: _this.ruleForm.wasteCategoryValue,//危废类别
              daCode: _this.ruleForm.wasteCode,//危废代码
              daName: _this.ruleForm.wasteName,//危废名称
              screenFileId: _this.ruleForm.imgLogoId,//年申报截图ID
              addressId: _this.ruleForm.addressId,//联系地址 id
              deadtime: _this.ruleForm.issueAgingValue,//发布时效
              yesNo: _this.ruleForm.whetherPricingValue,//是否定价
              number: _this.ruleForm.quantity,//数量
              unit: _this.ruleForm.issueUnitValue,//单位
              price: _this.ruleForm.unitPrice ? _this.ruleForm.unitPrice : '',//单价
              fileId: _this.ruleForm.newCertificateAttIds ? _this.ruleForm.newCertificateAttIds.join() : _this.ruleForm.certificateAttIds.join(),//附件ID
              keyWords: _this.ruleForm.keyword,//关键字
              remark: _this.ruleForm.otherDescription,//其他说明
            }
          }
        ).then((res) => {
          console.log("fdsfasdafasdf", _this.ruleForm.multipleSelection);
          if (res.data.status === 200) {
            this.$message({
              type: "success",
              message: "恭喜您！保存成功！"
            });
            _this.orderDialogVisible = false;//隐藏弹框
          }
        }).catch((err) => {
          console.log(err);
        });
      }
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
  .release-sales-order {
    padding: 4px;
    .title-box {
      position: relative;
      border-bottom: 2px solid #666;
      padding-bottom: 10px;
    }
    .form-order {
      /*padding: 10px;*/
      position: relative;
      .img-box {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .whetherPricing {
        position: relative;
        .keyword {
          margin-top: 60px;
        }
        .upload-photos {
          position: absolute;
          top: 20px;
          right: 30%;
        }
      }
    }
  }

  .disposition-enterprise-dialog {
    .form-item {
      display: inline - block;
    }
    .pagination-box {
      height: 50px;
      margin: 20px;
      position: relative;
      .pagination {
        position: absolute;
        right: 0;
        bottom: 10px;
      }
    }
  }
</style>
