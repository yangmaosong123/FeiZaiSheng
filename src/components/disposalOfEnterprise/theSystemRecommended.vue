/**
*@file  处置_系统推荐_报价
*@author 周毖强
*/
<template>
  <div class="the-system-recommended">

    <!-- 公共标题 -->
    <CommonTitle title="危险废品"></CommonTitle>

    <!-- menu切换 -->
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="">全部</el-menu-item>
      <el-menu-item index="1">不可回收</el-menu-item>
      <el-menu-item index="2"> 可回收</el-menu-item>
    </el-menu>

    <!-- 表格 -->
    <div class="time-order-table">
      <el-table
        :data="tableData"
        ref="tableData"
        @filter-change="handleFilterChg"
        highlight-current-row
        :default-expand-all="true"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img
                    @click="handleGoToWasteDetail(props.row)"
                    :src="$store.state.outputImgUrl+props.row.orderId+'&bizObjName=prod_img'"
                    alt="img">
                </div>
              </el-col>
              <el-col :span="7">
                <el-row class="title">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{props.row.daName}}
                      </div>
                      <el-button class="nowrap nowrap-h3"
                                 type="text"
                                 @click="handleGoToWasteDetail(props.row)">
                        {{props.row.daName}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row class="address">
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content">
                          {{ props.row.daCategory }}/{{ props.row.daCode}}
                        </div>
                        <el-button class="nowrap" type="text"
                                   @click="handleGoToWasteDetail(props.row)">
                          {{props.row.daCategory }}/{{props.row.daCode}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </div>
                        <el-button class="nowrap" type="text"
                                   @click="handleGoToWasteDetail(props.row)">
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}/{{props.row.dangerousWasteSource}}
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row>
                    <span style="white-space:normal; word-break:break-all;">
                      地址：{{props.row.province+ props.row.city+props.row.region}}

                    </span>
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="3" class="type">
                <el-row>
                  <span>
                    类型：{{ props.row.daType=='1'?'不可回收': props.row.daType=='2'?'可回收':"" }}
                  </span>
                </el-row>
                <el-row>
                  <span>
                    数量：{{ props.row.number }}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row>
                  <span>
                    单价：{{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price }}
                  </span>
                </el-row>
              </el-col>

              <el-col :span="5" class="enterprise">
                <span style="white-space:normal; word-break:break-all;">
                  {{props.row.enterpriseName===''?'——':props.row.enterpriseName }}
                </span>
              </el-col>

              <el-col :span="3" class="details">
                <span>
                {{findConfigItem(props.row.state,$store.state.dictionary.bjzt).title}}
                </span>|
                <span>
                  {{props.row.dataStatus=='0'?'未中标':props.row.dataStatus=='2'?'已中标':''}}
                </span>
              </el-col>
              <el-col :span="2" class="operation">
                <el-button type="text" size="small"
                           @click="handleShowDialog(props.row)"
                           v-show="props.row.state=='0'&&props.row.dataStatus=='1'"
                           style="margin-left: 20px;">
                  报价
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.state=='1'||props.row.dataStatus=='2'"
                           @click="handleShowDetailDialog(props.row)">
                  报价详情
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="tag"
                         label="报价时间"
                         column-key="filter_date"
                         width="220"
                         :filter-multiple="false"
                         :filters="[{text: '半年内', value: 180}, {text: '3个月内', value: 90}, {text: '1个月内', value: 30}]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="危废详情"
          width="270"
          prop="name">
          <template slot-scope="scope">
            <span>商品编号:{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布企业"
          width="200"
          prop="name">
        </el-table-column>
        <el-table-column
          width="160"
          label="状态"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="[{text: '已报价', value: '1'}, {text: '未报价', value: '0'}]"
          prop="tag"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="recommended-pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!--报价-->
    <div class="dialog">
      <el-dialog @closed="resetQuoteData"
                 title="订单报价"
                 :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false"
                 width="40%"
                 :before-close="handleClose">
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item label="报价说明：">
            <el-input type="textarea" v-model="form.textarea"
                      style="width:500px;"
                      placeholder="请输入报价说明"></el-input>
          </el-form-item>
          <el-form-item label="上传附件：" style="width:300px;">
            <el-upload
              class="upload-demo"
              ref="uploadDemo"
              :on-exceed="handleBeyondFile"
              :action="this.$store.state.fileUploadUrl"
              :on-remove="handleRemove"
              :on-success="handleSuccessGetId"
              :limit="1">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="输入单价：" prop="count">
            <el-input v-model="form.count" style="width:500px;" placeholder="请输入单价"></el-input>
          </el-form-item>
          <el-form-item v-show="dataType=='2'" label="付款方：" required>
            <el-radio v-model="form.radio" label="1">产废企业</el-radio>
            <el-radio v-model="form.radio" label="2">处置企业</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left:80px;" type="primary" @click="handleForm('form')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--查看报价-->
    <div class="dialog">
      <el-dialog title="订单报价" :visible.sync="lookDialogFormVisible" width="40%" v-if="lookDialogFormVisible">
        <el-form ref="lookForm" :model="lookForm" :rules="formRules">
          <el-form-item label="报价说明：">
            <el-input type="textarea" v-model="lookForm.textarea" style="width:500px;" disabled></el-input>
          </el-form-item>
          <el-form-item label="附件：" style="width:300px;">
            <a :href="$store.state.fileDownloadUrl+lookForm.id">{{lookForm.attachmentName}}</a>
          </el-form-item>
          <el-form-item label="输入单价：" prop="count">
            <el-input v-model="'￥'+lookForm.count" style="width:500px;" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left:80px;" type="primary" @click="lookDialogFormVisible=false">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import CommonTitle from "../common/commonTitle";

  export default {
    name: "theSystemRecommended", //系统推荐 ==>>危险废品
    data() {
      let handleVerifyUserInput = (rule, value, callback) => {
        if (isNaN(value)) callback(new Error("报价必须是数字，请返回修改！"));
        else if (value == 0 || value < 0) callback(new Error("报价金额必须大于0"));
        else callback();
      };
      let handleRadio = (rule, value, callback) => {
        alert("1");
        if (!value) callback(new Error("付款方必选"));
        else callback();
      };
      return {
        activeIndex: "", //
        tableData: [], //表数据
        dataRowCount: 0, //表行数
        daType: "", //订单类型
        selectTime: "",
        orderStatus: "", //报价时段
        page: {
          total: 0, //总条数
          pageNum: 1, //页码
          pageSize: 10 //每页条数
        },

        // 订单报价
        userId: "", //当前用户id
        dialogFormVisible: false, // 弹框
        form: {
          textarea: "", //报价描述
          fileId: "0", //附件id
          count: "", //报价总额
          radio: "1", //付款方选择
          daType: ""
        }, //表单数据

        formRules: {
          textarea: [
            {required: true, message: "请输入报价说明", trigger: "blur"}
          ],
          count: [
            {required: true, message: "请输入单价", trigger: "blur"},
            {validator: handleVerifyUserInput, trigger: "blur"}
          ],
          radio: [
            {validator: handleRadio, trigger: "blur"}
          ],
        },

        //查看报价
        lookDialogFormVisible: false, // 弹框
        lookForm: {
          textarea: "", //报价描述
          count: "", //报价总额
          id: "",//
          attachmentName: "",
          rowId: "",//
        }, //表单数据

        dataType: "1"
      };
    },
    components: {
      CommonTitle //公共标题
    },
    created() {
      this.handleGetTableData(); //获取表数据
    },
    methods: {
      resetQuoteData() {
        this.form.textarea = "";
        this.form.fileId = "";
        this.form.count = "";
        this.form.radio = "1";
      },
      //表数据过滤
      handleFilterChg(filters) {
        let _this = this;
        _this.selectTime = "";
        _this.orderStatus = "";
        for (let index in this.$refs.tableData.columns) {
          let column = this.$refs.tableData.columns[index];
          if (!column.filteredValue || column.filteredValue.length == 0) {
            continue;
          }
          if (column.columnKey && column.columnKey == "filter_date") {
            _this.selectTime = column.filteredValue[0];
          } else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.orderStatus = column.filteredValue[0];
          }
        }
        _this.handleGetTableData();
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.tableData = [];
        _this.dataRowCount = 0;
        _this.$axios({
          method: "post",
          url: "/quote/listOffer",
          data: {
            companyId: 0,
            daType: _this.daType, //订单类型
            quotationPeriod: _this.selectTime, //报价时段
            pageIndex: _this.page.pageNum, //页码
            pageSize: _this.page.pageSize, //每页条数
            status: _this.orderStatus //全部 "" ,已报价1，未报价0
          }
        })
          .then(res => {
            switch (res.data.status) {
              case -500:
                _this.tableData = [];
                break;
              case 200:
                _this.page.total = res.data.data.total;
                _this.tableData = res.data.data.list;
                _this.dataRowCount = res.data.data.list.length;
                break;
              case 300:
                _this.tableData = [];
                break;
            }
          });
      },

      //menu切换
      handleSelect(key, keyPath) {
        let _this = this;
        this.$router.push({
          path: "theSystemRecommended",
          query: {
            status: key //1 2 3
          }
        }); //根据订单状态显示路由
        _this.daType = key;
        this.handleGetTableData();
      },

      //分页事件
      handleSizeChange(val) {
        let _this = this;
        _this.page.pageSize = val;
        _this.handleGetTableData(); //获取表数据
      },

      handleCurrentChange(val) {
        let _this = this;
        _this.page.pageNum = val;
        _this.handleGetTableData(); //获取表数据
      },

      //报价关闭
      handleClose() {
        let _this = this;
        _this.dialogFormVisible = false;
        _this.$refs.uploadDemo.clearFiles();
      },


      //订单报价事件
      handleShowDialog(row) {
        let _this = this;
        if (row.daType == '2') _this.form.radio = "";
        _this.form.daType = row.daType;
        _this.$axios({
          method: "post",
          url: "/addressManage/selectOne",
        })
          .then((res) => {
            switch (res.data.status) {
              case 300:
                _this.$message({
                  type: "warning",
                  message: "您还未设置收货地址，请先设置"
                });
                _this.$router.push("/user/addressMessage");
                break;
              case 200:
                _this.dialogFormVisible = true;
                _this.userId = row.id;
                if (row.daType == "2") {
                  _this.dataType = row.daType;
                  console.log(_this.dataType);
                }
                break;
            }
          });
      },

      //上传文件超出数量
      handleBeyondFile() {
        let _this = this;
        _this.$message({
          type: "warning",
          message: "上传文件超出数量限制!"
        });
      },

      //附件上传成功获取对应id
      handleSuccessGetId(res) {
        let _this = this;
        _this.form.fileId = res.data;
        console.log("上传成功后的附件id", _this.form.fileId);
      },

      //取消附件上传
      handleRemove(res) {
        let _this = this;
        _this.form.fileId = "";
        _this.$refs.uploadDemo.clearFiles();
      },

      handleForm(form) {
        let _this = this;
        if (_this.form.daType == '1')
          if (!_this.form.count)
            _this.$message({
              type: 'warning',
              message: "请输入单价"
            });
          else
            _this.$axios({
              method: "post",
              url: "/quote/addOffer",
              data: {
                id: _this.userId, //用户id
                attId: _this.form.fileId, //附件id
                attachmentId: 0,
                offerExplain: _this.form.textarea, //报价说明
                extField: _this.form.count, //报价总额
                payer: "1" //付款方
              }
            }).then(res => {
              if (res.data.status === 200) {
                _this.$message({
                  type: "success",
                  message: "报价发送成功"
                });
                _this.dialogFormVisible = false;
                _this.form.textarea = "";
                _this.form.fileId = "";
                _this.form.count = "";
                _this.form.radio = "1";
                _this.$refs.uploadDemo.clearFiles();

                _this.handleGetTableData(); //获取表数据
              }
            });
        else if (_this.form.daType == '2')
          if (!_this.form.count)
            _this.$message({
              type: 'warning',
              message: "请输入单价"
            });
          else if (_this.form.daType == '2' && !_this.form.radio)
            _this.$message({
              type: 'warning',
              message: "请选择付款方"
            });
          else
            _this.$axios({
              method: "post",
              url: "/quote/addOffer",
              data: {
                id: _this.userId, //用户id
                attId: _this.form.fileId, //附件id
                attachmentId: 0,
                offerExplain: _this.form.textarea, //报价说明
                extField: _this.form.count, //报价总额
                payer: _this.form.radio //付款方
              }
            })
              .then(res => {
                if (res.data.status === 200) {
                  _this.$message({
                    type: "success",
                    message: "报价发送成功"
                  });
                  _this.dialogFormVisible = false;
                  _this.form.textarea = "";
                  _this.form.fileId = "";
                  _this.form.count = "";
                  _this.form.radio = "";
                  _this.$refs.uploadDemo.clearFiles();

                  _this.handleGetTableData(); //获取表数据
                }
              });
      },

      //报价时段
      handleTimeChange(value) {
        let _this = this;
        _this.quotationPeriod = value;
        _this.handleGetTableData(); //获取table数据
      },

      //报价状态
      handleStatusChange(value) {
        let _this = this;
        _this.orderStatus = value;
        _this.handleGetTableData(); //获取table数据
      },

      // 查看报价详情
      handleShowDetailDialog(row) {
        let _this = this;
        _this.lookDialogFormVisible = true;
        _this
          .$axios({
            method: "post",
            url: "/quote/orderQuoteOfferView",
            data: {
              id: row.id
            }
          })
          .then(res => {
            console.log("id", row.id);
            if (res.data.status === 200) {
              if (res.data.data.length) {
                res.data.data.map(item => {
                  console.log(item);
                  _this.lookForm.textarea = item.offerExplain;
                  _this.lookForm.count = item.extField;
                  _this.lookForm.attachmentName = item.attachmentName;
                  _this.lookForm.id = item.id;
                });
              } else {
                _this.lookForm.textarea = "";
                _this.lookForm.count = "";
                _this.lookForm.attachmentName = "";
                _this.lookForm.id = "";
              }
            }
          });
      },

      //查看商品详情
      handleGoToWasteDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/wasteDetail',
          query: {
            id: row.productId,
            tradeType: row.daType,
            companyId: row.productCompanyId
          }
        });
      },

    },
  };
</script>
<style>
  .recommended-table .el-table th {
    background: rgba(242, 242, 242, 1);
  }

  .time-order-table .el-table__expanded-cell {
    /* background: #f9f9f9; */
    font-size: 12px;
    padding: 20px 20px;
  }

  .el-col {
    padding: 0px;
  }
</style>
<style lang="less" scoped>
  .the-system-recommended {
    background: #fff;
    .time-order-table {
    }
    .recommended-pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 33%;

    }
  }
</style>
<style lang="less" scoped>
  #content {
    font-size: 12px;
    img {
      width: 100px;
      height: 80px;
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title:hover {
      cursor: pointer;
      color: #208dd6;
    }
    .address {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

    }
    .type {
      font-size: 12px;
      padding-top: 25px;
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .enterprise {
      margin-top: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .details {
      line-height: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .operation {
      margin-top: 28px;
      line-height: 10px;
      margin-left: 20px;
    }
    :hover {
      overflow: visible;
    }
    .el-textarea__inner {
      min-height: 80px;
    }
  }
</style>

