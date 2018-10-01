/**
*@file 产废_危废管理_发布订单
*@author 周毖强
*/
<template>
  <div class="release-the-order-dialog">

    <el-dialog title="订单发布"
               :visible.sync="issueOutDialogTableVisible"
               :close-on-click-modal="false"
               width="55%"
               :before-close="handleBeforeClose"
               center>

      <!-- 产废_危废管理_发布-表单 -->
      <el-form :model="ruleForm" :rules="rules"
               ref="ruleForm" label-width="130px"
               class="demo-ruleForm"
               style="position:relative;">
        <el-form-item label="发布标题" prop="title">
          <el-input v-model="ruleForm.title"
                    placeholder="请输入标题"
                    style="width:60%;"></el-input>
        </el-form-item>
        <el-form-item label="年申成功截图："
                      class="img-box"
                      required
                      style="position:absolute;top:0;right:10px;z-index: 1000">
          <el-upload
            class="avatar-uploader"
            :action="this.$store.state.fileUploadUrl"
            ref="fileUploadUrlPhonedd"
            v-model="ruleForm.imageUrl"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="危废类别" prop="wasteCategoryValue">
          <el-select v-model="ruleForm.wasteCategoryValue"
                     placeholder="请选择危废类别"
                     @focus="handleLoadingWasteCategories"
                     style="width:60%;"
                     @change="handleWasteCategoryValue">
            <el-option
              v-for="item in ruleForm.wasteCategories"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="废物代码" prop="wasteCode">
          <el-select v-model="ruleForm.wasteCategoryCodeValue" style="width:60%;" placeholder="请选择危废类别"
                     @focus="handleGetWasteCategoryCodeValue">
            <el-option
              v-for="item in ruleForm.wasteCategoriesCode"
              :key="item.extField"
              :label="item.itemCode"
              :value="item.extField">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危废类型" prop="wasteType">
          <el-radio-group v-model="ruleForm.wasteType">
            <el-radio label="1">不可回收</el-radio>
            <el-radio label="2">可回收</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行业来源" prop="industrySourcesValue">
          <el-select v-model="ruleForm.industrySourcesValue"
                     style="width:60%;"
                     placeholder="请选择行业来源">
            <el-option
              v-for="item in ruleForm.industrySources"
              :key="item.id"
              :label="item.title"
              :value="item.title">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危废来源" prop="wasteName">
          <el-input v-model="ruleForm.wasteName" placeholder="请填写危废来源" style="width:60%;"></el-input>
        </el-form-item>
        <el-form-item label="价格方式" prop="whetherPricingValue" class="whetherPricing">
          <el-radio-group v-model="ruleForm.whetherPricingValue">
            <el-radio label="1">面议</el-radio>
            <el-radio label="2">公开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="ruleForm.quantity "
                    maxlength="10"
                    placeholder="请输入数量"
                    style="width:60%;"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="issueUnits">
          <el-select v-model="ruleForm.issueUnitValue" placeholder="请选择一个单位" style="width:60%;">
            <el-option
              v-for="item in ruleForm.issueUnits"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.whetherPricingValue==2" maxlength="10" label="单价" prop="unitPrice">
          <el-input v-model="ruleForm.unitPrice"
                    placeholder="请输入单价"
                    style="width:60%; margin-top:16px;"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" class="upload-photos" required>
          <el-upload
            v-model="ruleForm.uploadPhotos"
            :action="this.$store.state.fileUploadUrl"
            list-type="picture-card"
            :on-remove="handleBeforeRemove"
            :before-upload="beforeAvatarUpload"
            ref="fileUploadUrlPhones"
            :limit="3"
            :on-success='companyUpload'>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="危废介绍" prop="otherDescription">
          <el-input type="textarea" rows="4" v-model="ruleForm.otherDescription" placeholder="请输入说明相关内容"></el-input>
        </el-form-item>
        <el-form-item label="危废图片" prop="uploadPhotos" class="upload-photos" required>
          <el-upload
            :action="this.$store.state.fileUploadUrl"
            list-type="picture-card"
            ref="uploadPhotos"
            :on-remove="handleBeforeWasteRemove"
            :before-upload="beforeAvatarUpload"
            :on-success='handleCompanyUpload'>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系信息">
          <!-- 联系地址组件 -->
          <ContactAddress @getChildData="getChildData"></ContactAddress>
        </el-form-item>
      </el-form>

      <el-dialog
        width="50%"
        title="订单发布"
        :visible.sync="issueInnerDialogTableVisible"
        append-to-body>

        <!--  产废_危废管理_发布-选择处置企业 -->
        <el-form :model="searchRuleForm"
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
            <template slot-scope="scope">
              {{findConfigItem(scope.row.companyProperties,dictionay.gsxz).title}}
            </template>

          </el-table-column>
          <el-table-column
            prop="registrationCapital"
            label="资金">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-box">
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="page.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </div>

        <!-- 按钮 -->
        <div class="buttons">
          <el-button @click="issueInnerDialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmIssueOrder()">确定发布订单</el-button>
        </div>

      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleBeforeClose">取 消</el-button>
        <el-button type="primary" @click="handleShowDispositionEnterpriseDialog('ruleForm')">发布订单</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ContactAddress from '../../common/contactAddress'


  export default {
    name: "",
    data() {

      //验证价格
      let handleJudgeIsNumber = (rule, value, callback) => {
        if (isNaN(value))
          return callback(new Error('数量/价格必须为数字，请返回修改！'));
        else return callback();
      };

      return {
        dictionay: {},

        issueOutDialogTableVisible: false,//发布订单--外层
        issueInnerDialogTableVisible: false,//发布订单--内层
        ruleForm: {
          title: "",//发布标题
          imageUrl: '',//年申图路径
          imgLogoId: "",//年申图Id
          wasteCategoryValue: '',//危废类别--select值
          wasteCategories: [],//危废类别
          wasteCode: "",//废物代码
          wasteType: "",//危废类型
          industrySourcesValue: "",//行业来源--值
          wasteCategoriesCode: [],
          industrySources: [],////行业来源--数据
          wasteName: "",//危废来源
          whetherPricingValue: "",//价格方式
          wasteCategoryCodeValue: "",//代码
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
              label: "吨"
            },
            {
              value: 4,
              label: "台"
            },
            {
              value: 5,
              label: "个"
            }
          ],//
          unitPrice: "",//单价
          certificateAttId: "",//上传图片
          certificateAttIds: [],//上传图片--ids
          newCertificateAttIds: [],//图片id集合--有删除操作
          fileId: "",//危废图片
          fileIds: [],//危废图片-ids
          newFileIds: [],//图片id集合--有删除操作
          addressId: "",//地址对应的id
        },//订单发布表单--数据
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          wasteCategoryValue: [
            {required: true, message: '请选择危废类别', trigger: 'blur'}
          ],
          wasteCode: [
            {required: true, message: '请输入危废代码', trigger: 'blur'}
          ],
          wasteType: [
            {required: true, message: '请选择危废类型', trigger: 'blur'}
          ],
          industrySourcesValue: [
            {required: true, message: '请选择行业来源', trigger: 'blur'}
          ],
          wasteName: [
            {required: true, message: '请输入危废来源', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '请选择年申图', trigger: 'blur'}
          ],
          AddressArea: [
            {required: true, message: '请选择地址区域', trigger: 'blur'}
          ],
          whetherPricingValue: [
            {required: true, message: '请选择价格方式', trigger: 'blur'}
          ],
          quantity: [
            {required: true, message: '请输入数量', trigger: 'blur'},
            // {validator: handleJudgeIsNumber, trigger: 'blur'}
          ],
          issueUnits: [
            {required: true, message: '请选择单位', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入单价', trigger: 'blur'},
            // {validator: handleJudgeIsNumber, trigger: 'blur'}
          ],
          uploadPhotos: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          otherDescription: [
            {required: true, message: '请输入危废介绍', trigger: 'blur'}
          ],
        },
        searchRuleForm: {//搜索表单--数据
          keyword: "",//搜索关键字
          multipleSelection: [],//公司id集合
        },

        tableData: [],//表格

        page: {//分页
          total: 0,//总数
          pageNum: 5,//每页条数
          currentPage: 1,//当前页
        },
      };
    },
    components: {
      ContactAddress,//联系地址
    },
    created() {
      this.init();
      this.handleGetProductionIndustryData(); //获取行业来源
    },
    methods: {

      init() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "sshy,zycp,zczb,qy,gsxz"
          }
        }).then(res => {
          _this.dictionay = res.data.data;
        }).then(function () {
          _this.handleLoadingTableData();//加载表数据
        });
      },

      //获取行业来源
      handleGetProductionIndustryData() {
        let _this = this;
        this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "hyly"
          }
        }).then(res => {
          _this.ruleForm.industrySources = res.data.data.hyly;
        });
      },

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

      //转换成element-select数据格式
      handleChangeElementWasteCategories(obj) {
        let result = [];
        for (let i = 0; i < obj.length; i++) {
          result.push({});
          result[i].value = obj[i].extField;
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
          url: "/base/findWasteType",
          data: {
            wasteType: "wflb"
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.ruleForm.wasteCategories = _this.handleChangeElementWasteCategories(res.data.data);
          } else
            this.$message({
              type: 'warning',
              message: "暂无相关数据！"
            });
        })
      },

      //监听危废类别值改变
      handleWasteCategoryValue() {
        let _this = this;
        _this.$axios({
          method: "post",
          withCredentials: true,
          url: "/base/findWasteCode",
          data: {
            wasteType: "wflb",
            extField: _this.ruleForm.wasteCategoryValue
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.ruleForm.wasteCategoriesCode = res.data.data;
          }
        })
      },

      handleGetWasteCategoryCodeValue() {
        let _this = this;
        _this.handleWasteCategoryValue
      },

      //获取子组件传递过来的数据
      getChildData(defaultValue, value) {
        this.ruleForm.addressId = typeof(value) != 'Number' ? defaultValue : value;
        console.log("已获取到子组件的信息：", this.ruleForm.addressId);
      },

      //取消发布订单
      handleBeforeClose() {
        let _this = this;
        _this.issueOutDialogTableVisible = false;
        _this.$refs.fileUploadUrlPhonedd.clearFiles();
        _this.$refs.fileUploadUrlPhones.clearFiles();
        _this.$refs.uploadPhotos.clearFiles();
      },

      //显示发布订单弹框
      handleShowDispositionEnterpriseDialog(ruleForm) {
        let _this = this;
        if (!_this.ruleForm.title) {
          _this.$message({
            type: "warning",
            message: "请填写标题"
          });
        } else if (!_this.ruleForm.imageUrl) {
          _this.$message({
            type: "warning",
            message: "请上传年申成功截图"
          });
        } else if (!_this.ruleForm.wasteCategoryValue) {
          _this.$message({
            type: "warning",
            message: "请选择危废类别"
          });
        } else if (!_this.ruleForm.wasteType) {
          _this.$message({
            type: "warning",
            message: "请选择危废类型"
          });
        } else if (!_this.ruleForm.industrySourcesValue) {
          _this.$message({
            type: "warning",
            message: "请选择行业来源"
          });
        } else if (!_this.ruleForm.wasteName) {
          _this.$message({
            type: "warning",
            message: "请填写危废来源"
          });
        } else if (!_this.ruleForm.whetherPricingValue) {
          _this.$message({
            type: "warning",
            message: "请填写价格方式"
          });
        } else if (isNaN(_this.ruleForm.whetherPricingValue)) {
          _this.$message({
            type: "warning",
            message: "价格必须为数字"
          });
        } else if (!_this.ruleForm.issueUnitValue) {
          _this.$message({
            type: "warning",
            message: "请选择一个单位"
          });
        }
        else if (!_this.ruleForm.certificateAttIds.length) {
          _this.$message({
            type: "warning",
            message: "请上传图片"
          });
        } else if (!_this.ruleForm.quantity) {
          _this.$message({
            type: "warning",
            message: "请填写数量"
          });
        } else if (isNaN(_this.ruleForm.quantity)) {
          _this.$message({
            type: "warning",
            message: "数量必须为数字"
          });
        } else if (!_this.ruleForm.otherDescription) {
          _this.$message({
            type: "warning",
            message: "请填写危废介绍"
          });
        } else if (!_this.ruleForm.fileIds.length) {
          _this.$message({
            type: "warning",
            message: "请上传危废图片"
          });
        } else if (!_this.ruleForm.addressId) {
          _this.$confirm('是否选择默认地址', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '重选',
            type: 'warning'
          }).then(() => {
            _this.$axios({
              method: "post",
              url: "/addressManage/selectOne",
              data: ""
            })
              .then((res) => {
                if (res.data.status === 200) {
                  _this.ruleForm.addressId = res.data.data.id;
                }
              });
          })
        } else if (_this.ruleForm.whetherPricingValue == 2 && !_this.ruleForm.unitPrice) {
          _this.$message({
            type: "warning",
            message: "请填写单价"
          });
        } else {
          _this.issueInnerDialogTableVisible = true;
          _this.handleLoadingTableData();
        }
      },
      //上传图片--单选
      handleAvatarSuccess(res, file) {
        let _this = this;
        this.ruleForm.imageUrl = _this.$store.state.outputImgByIdUrl + res.data;
        this.ruleForm.imgLogoId = res.data;
        console.log("  this.ruleForm.imgLogoId", res.data);
      },

      //上传文件格式限制
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 jpg/jpeg/png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //上传图片--支持多选
      companyUpload(content) {
        let _this = this;
        _this.ruleForm.certificateAttIds.push(content.data);
      },

      //取消某一张图片上传
      handleBeforeRemove(file) {
        let _this = this;
        _this.ruleForm.NewCertificateAttIds = [];
        _this.ruleForm.certificateAttIds.forEach((item) => {
          if (item != file.response.data)
            _this.ruleForm.NewCertificateAttIds.push(item);
        });
      },

      //危废图片--支持多选
      handleCompanyUpload(content) {
        console.log("返回成功：", content);
        this.ruleForm.fileIds.push(content.data);
      },

      //取消危废图片某一张图片上传
      handleBeforeWasteRemove(file, fileList) {
        let _this = this;
        _this.ruleForm.NewFileIds = [];
        _this.ruleForm.fileIds.forEach((item) => {
          if (item != file.response.data)
            _this.ruleForm.NewFileIds.push(item);
        });
      },

      //显示外层弹框
      ShowIssueOrderDialog() {
        let _this = this;
        _this.issueOutDialogTableVisible = true;
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
      },

      //搜索
      handleQueryKeyword() {
        this.handleLoadingTableData();//加载表数据
      },
      //键盘搜索
      handleKeyUpEnter(event) {
        if (event.keyCode === 13)
          this.handleLoadingTableData();//加载表数据
      },

      //表格事件
      handleSelectionChange(val) {
        this.searchRuleForm.multipleSelection = val.map((item, index) => item.id);
        console.log("你已经选择了：" + this.searchRuleForm.multipleSelection);
      },

      //分页事件
      handleSizeChange(val) {
        this.page.pageNum = val;
        this.handleLoadingTableData();//加载表数据
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.handleLoadingTableData();//加载表数据
      },

      //确定发布订单
      handleConfirmIssueOrder() {
        let _this = this;
        if (!_this.searchRuleForm.multipleSelection.length) {
          _this.$message({
            type: 'warning',
            message: "请至少选择一家处置企业！"
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/order/create",
            data: {
              orderState: "1",//订单--1
              daName: _this.ruleForm.title,//标题
              screenFileId: _this.ruleForm.imgLogoId,// 年申报截图
              daCategory: _this.ruleForm.wasteCategoryValue,//危废类别
              daCode: _this.ruleForm.wasteCategoryCodeValue,//废物代码
              daType: _this.ruleForm.wasteType,//危废类型
              industrySource: _this.ruleForm.industrySourcesValue,//行业来源
              dangerousWasteSource: _this.ruleForm.wasteName,//危废来源
              priceMethod: _this.ruleForm.whetherPricingValue,//价格方式
              number: _this.ruleForm.quantity,//数量
              unit: _this.ruleForm.issueUnitValue,//单位
              price: _this.ruleForm.unitPrice,//单价
              uploadFileId: _this.ruleForm.NewCertificateAttIds ? _this.ruleForm.NewCertificateAttIds.join() : _this.ruleForm.certificateAttIds.join(),//上传图片
              remark: _this.ruleForm.otherDescription,//危废介绍
              fileId: _this.ruleForm.NewFileIds ? _this.ruleForm.NewFileIds.join() : _this.ruleForm.fileIds.join(),//危废图片
              addressId: _this.ruleForm.addressId,//地址对应的id
              companyId: _this.searchRuleForm.multipleSelection.join(','),//处置企业
            }
          }).then((res) => {
            if (res.data.status === 200) {
              _this.$message({
                type: "success",
                message: "订单发布成功！"
              });
              this.handleLoadingTableData();//加载表数据
              console.log("_this.searchRuleForm.multipleSelection", _this.searchRuleForm.multipleSelection);
              _this.issueInnerDialogTableVisible = false;
              _this.issueOutDialogTableVisible = false;
              _this.ruleForm.title = "";
              _this.ruleForm.imgLogoId = "";
              _this.ruleForm.wasteCategoryValue = "";
              _this.ruleForm.wasteCode = "";
              _this.ruleForm.wasteType = "";
              _this.ruleForm.industrySourcesValue = "";
              _this.ruleForm.wasteName = "";
              _this.ruleForm.whetherPricingValue = "";
              _this.ruleForm.quantity = "";
              _this.ruleForm.issueUnitValue = "";
              _this.ruleForm.newCertificateAttIds = [];
              _this.ruleForm.certificateAttIds = [];
              _this.ruleForm.otherDescription = "";
              _this.ruleForm.newFileIds = [];
              _this.ruleForm.fileIds = [];
              _this.ruleForm.wasteCategoryCodeValue = "";
              _this.searchRuleForm.multipleSelection = [];
              _this.ruleForm.imageUrl = "";
              _this.$refs.fileUploadUrlPhonedd.clearFiles();
              _this.$refs.fileUploadUrlPhones.clearFiles();
              _this.$refs.uploadPhotos.clearFiles();
            }
          });
        }
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
  .pagination-box {
    height: 50px;
    .pagination {
      padding-top: 10px;
      padding-left: 25%;
    }
  }
</style>
