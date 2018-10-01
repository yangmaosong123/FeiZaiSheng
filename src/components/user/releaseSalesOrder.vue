<template>
  <div class="release-sales-order">

    <!-- 标题 -->
    <div class="title-box">
      <h3>订单发布</h3>
    </div>

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
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危废代码" prop="wasteCode">
          <el-input v-model="ruleForm.wasteCode" placeholder="请选择危废代码" style="width:194px;"></el-input>
        </el-form-item>
        <el-form-item label="危废名称" prop="wasteName">
          <el-input v-model="ruleForm.wasteNameValue" placeholder="请填写危废名称" style="width:194px;"></el-input>
          <!--<el-select v-model="ruleForm.wasteNameValue" placeholder="请选择危废名称" style="width:194px;">-->
          <!--<el-option-->
          <!--v-for="item in ruleForm.wasteNames"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <el-form-item label="年申成功截图：" class="img-box">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址区域" prop="">
          <el-select v-model="ruleForm.wasteProvinceValue" placeholder="请选择一个省份" @change="handleChoseProvince">
            <el-option
              v-for="item in ruleForm.wasteProvinces"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="ruleForm.wasteCityValue" placeholder="请选择一个市" @change="handleChoseCity">
            <el-option
              v-for="item in ruleForm.wasteCites"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="ruleForm.wasteRegionsValue" placeholder="请选择一个区" @change="handleChoseBlock">
            <el-option
              v-for="item in ruleForm.wasteRegions"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.detailedAddress" placeholder="请输入详细地址信息" style="width:194px;"></el-input>
        </el-form-item>
        <el-form-item label="发布时效" prop="issueAgingValue">
          <el-select v-model="ruleForm.issueAgingValue" placeholder="请选择一个时效时间">
            <el-option
              v-for="item in ruleForm.issueAgings"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否定价" prop="whetherPricing" class="whetherPricing">
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
        <el-form-item v-show="ruleForm.whetherPricingValue==1" label="单价" prop="unitPrice">
          <el-input v-model="ruleForm.unitPrice"
                    placeholder="请输入单价"
                    style="width:194px; margin-top:16px;"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="uploadPhotos" class="upload-photos">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleBeforeRemove"
            :http-request='companyUpload'>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword" class="keyword">
          <el-input v-model="ruleForm.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="其他说明" prop="otherDescription">
          <el-input type="textarea" v-model="ruleForm.otherDescription" placeholder="请输入说明相关内容"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：">
          <!-- 联系地址组件 -->
          <!--<LinkmanAddress></LinkmanAddress>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveOrIssueOrder('保存订单')">保存订单</el-button>
          <el-button @click="handleShowDispositionEnterpriseDialog()">发布订单</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 发布订单 -->
    <!--<DispositionEnterpriseDialog ref="DispositionEnterpriseDialog"></DispositionEnterpriseDialog>-->
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
          <el-form-item label="企业搜索：" prop="keyword" class="form-item">
            <el-input v-model="searchRuleForm.keyword"
                      placeholder="请输入搜索关键字"
                      style="width:600px;"
                      @keyup.enter.native="handleKeyUpEnter($event)"></el-input>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="primary" @click="handleQueryKeyword()">搜索
            </el-button>
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
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveOrIssueOrder('发布订单')">确 定</el-button>
      </span>

      </el-dialog>
    </div>
  </div>
</template>
<script type=" text/ecmascript-6">
  import {setCookie, getCookie, delCookie} from '../../assets/js/cookie.js'
  import LinkmanAddress from './components/linkmanAddress'
  // import DispositionEnterpriseDialog from './components/dispositionEnterpriseDialog'

  export default {
    name: "releaseSalesOrder",//订单发布
    components: {
      LinkmanAddress, //联系人地址组件
      // DispositionEnterpriseDialog,//发布订单弹框
    },
    data() {
      return {
        //订单发布表单--数据
        ruleForm: {
          wasteType: "",//危废类型
          wasteCategoryValue: '',//危废类别--select值
          wasteCategories: [],//危废类别
          wasteCode: "",//危废代码
          wasteNameValue: "",//危废名称-值
          wasteNames: [],//危废名称
          imageUrl: '',//图片路径
          imgId: "",//图片id
          imgLogoId: "",//年申图Id
          wasteProvinceValue: '',//危废区域--省份值
          wasteProvinces: [],//危废区域--省份
          wasteCityValue: '',//危废区域--市值
          wasteCites: [],//危废区域--市
          wasteRegionsValue: '',//危废区域--区值
          wasteRegions: [],//危废区域--区
          detailedAddress: "",//详细地址
          issueAgingValue: "",//发布时效--select值
          issueAgings: [
            {
              value: '1',
              label: "一个月"
            },
            {
              value: '2',
              label: "三个月"
            }
          ],//发布时效
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
          certificateAttId: "",//图片id
          certificateAttIds: [],//图片id集合
          keyword: "",//关键字
          otherDescription: ""//其他说明
        },
        orderDialogVisible: false,//发布订单弹框--默认隐藏
        searchRuleForm: {//搜索表单--数据
          keyword: "",//搜索关键字
        },
        searchRuleFormRules: {//搜索表单--验证规则
          keyword: [
            {
              required: true,
              message: '请输入搜索关键字',
              trigger: 'blur'
            }
          ]
        },
        tableData: [],//表格
        multipleSelection: [],//公司id集合
        page: {
          total: 0,//总数
          pageNum: 10,//每页条数
          currentPage: 1,//当前页
        },
        rules: {
          wasteCategoryValue: [
            {required: true, message: '请选择危废类别', trigger: 'blur'}
          ],
          wasteCode: [
            {required: true, message: '请输入危废代码', trigger: 'blur'}
          ],
          wasteNameValue: [
            {required: true, message: '请输入危废名称', trigger: 'blur'}
          ],
          addressArea: [
            // {required: true, message: '请选择相关省、市、区及输入详细地址信息', trigger: 'blur'}
          ],
          issueAgingValue: [
            {required: true, message: '请选择一个时效时间', trigger: 'blur'}
          ],
          whetherPricing: [
            {required: true, message: '请选择是否定价', trigger: 'blur'}
          ],
          quantity: [
            {required: true, message: '请输入数量', trigger: 'blur'}
          ],
          issueUnits: [
            {required: true, message: '请选择单位', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入单价', trigger: 'blur'}
          ],
          uploadPhotos: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          keyword: [
            {required: true, message: '请输入关键字', trigger: 'blur'}
          ],
        }
      };
    },
    created() {
      this.handleLoadingWasteCategories();//危废类别
      this.getProvinceData(); //省-市-区
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
              if (_this.ruleForm.wasteCategoryValue === item.id) {
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

      //省-市-区
      getProvinceData() {
        let that = this;
        that
          .$axios({
            method: "post",
            url: "/base/getProvinceList",
            data: {
              moduleCode: "qy",
              parentId: 0
            }
          })
          .then(function (res) {
            if (res.data.status === 200) {
              that.ruleForm.wasteProvinces = res.data.data;
            }
          })
          .catch(function (err) {
            alert(err);
          });
      },

      // 选择市
      handleChoseProvince(e) {
        let that = this;
        for (let i in that.ruleForm.wasteProvinces) {
          if (e === that.ruleForm.wasteProvinces[i].id) {
            that
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: that.ruleForm.wasteProvinces[i].id
                }
              })
              .then(function (res) {
                if (res.data.status === 200) {
                  that.ruleForm.wasteCites = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区
      handleChoseCity(e) {
        let that = this;
        for (let i in that.ruleForm.wasteCites) {
          if (e === that.ruleForm.wasteCites[i].id) {
            that
              .$axios({
                method: "post",
                url: "/base/getListByProvinceId",
                data: {
                  id: that.ruleForm.wasteCites[i].id
                }
              })
              .then(function (res) {
                if (res.data.status === 200) {
                  that.ruleForm.wasteRegions = res.data.data;
                }
              });
          }
        }
      },

      // 选择对应的区县
      handleChoseBlock(e) {
        this.E = e;
        console.log(this.E);
      },

      //显示发布订单弹框
      handleShowDispositionEnterpriseDialog() {
        this.orderDialogVisible = true;
        this.handleLoadingTableData();//加载表数据
      },

      //上传图片--单选
      handleAvatarSuccess(res, file) {
        this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
      },

      beforeAvatarUpload(file) {
        let _this = this;
        let formData = new FormData();
        formData.append("file", file);
        _this.$axios({
          method: "post",
          url: "/attachment/upload",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          if (res.data.status === 200) {
            _this.ruleForm.imgId = res.data.data;
            _this.ruleForm.imageUrl =
              "/attachment/outputImgById?" +
              "id=" +
              _this.ruleForm.imgId;
          }
          _this.ruleForm.imgLogoId = res.data.data;
          console.log('年id：', _this.ruleForm.imgLogoId);
        });
        return false;
      },

      //上传图片--支持多选

      companyUpload(content) {
        let formData = new FormData();
        formData.append("file", content.file);
        let config = {
          "Content-Type": "multipart/form-data"
        };
        let that = this;

        that.$axios
          .post("/attachment/upload", formData, config)
          .then(function (res) {
            if (res.data.status === 200) {
              that.ruleForm.certificateAttIds.push(res.data.data);
              // that.ruleForm.certificateAttId = res.data.data;
              console.log(res.data.data);
            }

          })
          .catch(function (error) {
            console.log(error);
          });

      },

      //取消某一张图片上传
      handleBeforeRemove(file, fileList) {
        let _this = this;
        console.log(fileList);
        // _this.ruleForm.certificateAttIds = fileList;
      },

      handlePictureCardPreview(file) {
        this.ruleForm.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      }
      ,

      //显示弹框
      // handlerShowDialog() {
      //   this.dialogVisible = true;
      //  // this.handleLoadingTableData();//加载表数据
      // },

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
        this.multipleSelection = val.map((item, index) => item.id);

        console.log("你已经选择了：" + this.multipleSelection);
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
      handleSaveOrIssueOrder(type) {
        let _this = this;
        if (!_this.ruleForm.wasteType) {
          this.$message({
            type: 'warning',
            message: "请选择危废类型！"
          });
          return false;
        } else if (!_this.ruleForm.wasteCategoryValue) {
          this.$message({
            type: 'warning',
            message: "请选择危废类别！"
          });
          return false;
        } else if (!_this.ruleForm.wasteNameValue) {
          this.$message({
            type: 'warning',
            message: "请填写危废名称！"
          });
          return false;
        } else if (!_this.ruleForm.imageUrl) {
          this.$message({
            type: 'warning',
            message: "请选择一张年申成功图！"
          });
          return false;
        } else if (!_this.ruleForm.wasteProvinceValue) {
          this.$message({
            type: 'warning',
            message: "请选择省份！"
          });
          return false;
        } else if (!_this.ruleForm.wasteCityValue) {
          this.$message({
            type: 'warning',
            message: "请选择市！"
          });
          return false;
        } else if (!_this.ruleForm.wasteRegionsValue) {
          this.$message({
            type: 'warning',
            message: "请选择区！"
          });
          return false;
        } else if (!_this.ruleForm.detailedAddress) {
          this.$message({
            type: 'warning',
            message: "请填写详细地址！"
          });
          return false;
        } else if (!_this.ruleForm.issueAgingValue) {
          this.$message({
            type: 'warning',
            message: "请选择时效！"
          });
          return false;
        } else if (!_this.ruleForm.whetherPricingValue) {
          this.$message({
            type: 'warning',
            message: "请选择是否定价！"
          });
          return false;
        } else if (!_this.ruleForm.quantity) {
          this.$message({
            type: 'warning',
            message: "请填写数量！"
          });
          return false;
        } else if (!_this.ruleForm.issueUnitValue) {
          this.$message({
            type: 'warning',
            message: "请选择单位！"
          });
          return false;
        } else if (!_this.ruleForm.keyword) {
          this.$message({
            type: 'warning',
            message: "请填写关键字！"
          });
          return false;
        } else if (!_this.ruleForm.otherDescription) {
          this.$message({
            type: 'warning',
            message: "请填写相关说明文字！"
          });
          return false;
        } else if (!_this.ruleForm.certificateAttIds) {
          this.$message({
            type: 'warning',
            message: "请至少选择一张图片！"
          });
          return false;
        } else {
          _this.$axios(
            {
              method: "post",
              url: "/order/create",
              withCredentials: true,
              data: {
                orderState: type === "保存订单" ? 0 : type === "发布订单" ? 1 : "",//0--保存订单
                daType: _this.ruleForm.wasteType,//危废类型
                daCategory: _this.ruleForm.wasteCategoryValue,//危废类别
                daCode: _this.ruleForm.wasteCode,//危废代码
                daName: _this.ruleForm.wasteNameValue,//危废名称
                screenFileId: _this.ruleForm.imgLogoId,//年申报截图ID
                province: _this.ruleForm.wasteProvinceValue,//区
                area: _this.ruleForm.wasteRegionsValue,//区
                city: _this.ruleForm.wasteCityValue,//市
                address: _this.ruleForm.detailedAddress,//详细地址
                deadtime: _this.ruleForm.issueAgingValue,//发布时效
                yesNo: _this.ruleForm.whetherPricingValue,//是否定价
                number: _this.ruleForm.quantity,//数量
                unit: _this.ruleForm.issueUnitValue,//单位
                price: _this.ruleForm.unitPrice ? _this.ruleForm.unitPrice : '',//单价
                fileId: _this.ruleForm.certificateAttIds.join(),//附件ID
                keyWords: _this.ruleForm.keyword,//关键字
                remark: _this.ruleForm.otherDescription,//其他说明
                companyId: type === "发布订单" ? _this.ruleForm.multipleSelection : "",//公司id集合
              }
            }
          ).then((res) => {
            console.log("年", _this.ruleForm.imgLogoId);
            console.log("未点出删除时的图片集合：", _this.ruleForm.certificateAttIds);
            console.log("已点出删除时的图片集合：", _this.ruleForm.certificateAttIds);
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
    }
  }
  ;
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
      padding: 10px;
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
