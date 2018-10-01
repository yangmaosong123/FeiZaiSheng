/**
*@file 处置企业==>>订单处理
*@author 周毖强
*/
<template>
  <div class="order-processing">

    <!-- 公共标题 -->
    <CommonTitle title="危险废品"></CommonTitle>

    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="0">全部</el-menu-item>
      <el-menu-item index="1">不可回收</el-menu-item>
      <el-menu-item index="2">可回收</el-menu-item>
    </el-menu>

    <!-- 表格 -->
    <div class="order-table">
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
                    @click="handleGoToLogisticsDetail(props.row)"
                    :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                    :alt="'img'+props.row.id">
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
                                 @click="handleGoToLogisticsDetail(props.row)">
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
                        <el-button class="nowrap"
                                   type="text"
                                   @click="handleGoToLogisticsDetail(props.row)">
                          {{props.row.daCategory }}/3/{{props.row.daCode}}
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
                        <el-button class="nowrap"
                                   type="text"
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
                    数量：{{ props.row.number }}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}
                  </span>
                </el-row>
                <el-row>
                  <span>
                    单价：{{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price }}
                  </span>
                </el-row>
              </el-col>

              <el-col :span="4" class="enterprise">
                <span>
                  {{ props.row.enterpriseName===''?'——':props.row.enterpriseName  }}
                </span>
              </el-col>

              <el-col :span="3" class="details">
                <span>
              {{findConfigItem(props.row.orderState,$store.state.dictionary.ORDER_STATUS_QUOTE).title}}
                </span>
                <el-button type="text"
                           size="small"
                           @click="handleGoToLogisticsDetail(props.row)">
                  订单详情
                </el-button>
              </el-col>

              <el-col :span="4" class="operation">
                <el-button v-show="props.row.orderState==2"
                           type="text" size="small"
                           @click="handleShowSignDialog(props.row)">
                  签约
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='9'"
                           @click="handleShowNotarizeDialog(props.row)">
                  确定收货
                </el-button>
                <el-button v-show="props.row.orderState==6"
                           type="text" size="small"
                           @click="handleShowPaymentDialog(props.row)">
                  付款
                </el-button>
                <el-button type="text" size="small"
                           @click="handleCollectionEnterprise(props.row.companyId)">
                  收藏企业
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState==12&&props.row.disposalResult=='N'"
                           @click="handleShowDispositionDialog(props.row)">
                  上传处置结果
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.disposalResult=='Y'&&props.row.orderState==12"
                           @click="handleShowReceiptFormDialog(props.row.id)">
                  查看单据
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="日期"
          width="220"
          column-key="filter_date"
          :filter-multiple="false"
          :filters="[{text: '半年内', value: 180}, {text: '3个月内', value: 90}, {text: '1个月内', value: 30}]"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="危废详情"
          width="270"
          prop="">
          <template slot-scope="scope">
            <span>订单编号：{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布企业"
          width="200"
          prop="">
        </el-table-column>
        <el-table-column
          label="状态"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="orderFilters"
          prop="tag"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="120"
          label="操作">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="order-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!-- 签约弹框 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="signDialogFormVisible"
                 :before-close="handleCloseSignForm"
                 width="30%">
        <el-form :model="signForm" :rules="signFormRules">
          <el-form-item label="上传合同：" required>
            <el-upload
              ref="upload"
              class="upload-demo"
              v-model="signForm.upload"
              :action="this.$store.state.fileUploadUrl"
              :limit="1"
              :on-exceed="handleBeyondFile"
              :on-remove="handleRemoveSignFile"
              :on-success="handleSuccessGetId">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="物流公司：" prop="value">
            <el-select v-model="signForm.value" placeholder="请选择物流公司">
              <el-option
                v-for="item in signForm.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseSignForm">取 消</el-button>
          <el-button type="primary" @click="handleSignContract">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 确认收货弹框 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="notarizeDialogFormVisible" width="30%">
        <el-form :model="notarizeForm" label-width="100px">
          <el-form-item label="危废类别：">
            <el-input v-model="notarizeForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：">
            <el-input v-model="notarizeForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：">
            <el-input v-model="findConfigItem(notarizeForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：">
            <el-input type="textarea" v-model="notarizeForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废地址：">
            <el-input type="textarea" v-model="notarizeForm.address" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input v-model="notarizeForm.number+findConfigItem(notarizeForm.unit,$store.state.dictionary.unit).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：">
            <el-input v-model="'￥'+notarizeForm.unitPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易金额：">
            <span>{{'￥'+(notarizeForm.number*notarizeForm.unitPrice).toFixed(2)}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="notarizeDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleMakeSureTheGoods">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--  处置弹框 -->
    <div class="order-dialog">
      <el-dialog title=""
                 :visible.sync="dispositionDialogFormVisible"
                 width="30%"
                 :before-close="handleCloseDisposition">
        <el-form :model="dispositionForm" label-width="100px">
          <el-form-item label="危废类别：">
            <el-input type="textarea" v-model="dispositionForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：">
            <el-input v-model="dispositionForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：">
            <el-input v-model="findConfigItem(dispositionForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：">
            <el-input type="textarea" v-model="dispositionForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废地址：">
            <el-input
              type="textarea"
              v-model="dispositionForm.province+dispositionForm.city+dispositionForm.region+dispositionForm.address"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input
              v-model="dispositionForm.number+findConfigItem(dispositionForm.unit,$store.state.dictionary.unit).title"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：">
            <el-input v-model="'￥'+dispositionForm.unitPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易金额：">
            <span>{{'￥'+(dispositionForm.number*dispositionForm.unitPrice).toFixed(2)}}</span>
          </el-form-item>
          <el-form-item label="处置结果：" required>
            <el-upload
              ref="dispositionFormUpload"
              class="upload-demo"
              :action="this.$store.state.fileUploadUrl"
              :on-exceed="handleBeyondFile"
              :on-remove="handleRemoveDispositionFile"
              :on-success="handleSuccessDispositionGetId">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseDisposition">取 消</el-button>
          <el-button type="primary" @click="handleDisposalResults">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--  付款弹框 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="paymentDispositionDialogFormVisible" width="30%">
        <el-form :model="paymentForm" label-width="100px">
          <el-form-item label="危废类别：">
            <el-input v-model="paymentForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：">
            <el-input v-model="paymentForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：">
            <el-input v-model="findConfigItem(paymentForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：">
            <el-input type="textarea" v-model="paymentForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废地址：">
            <el-input type="textarea" v-model="paymentForm.address" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input v-model="paymentForm.number+findConfigItem(paymentForm.unit,$store.state.dictionary.unit).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：">
            <el-input v-model="'￥'+paymentForm.unitPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易金额：">
            <span>{{'￥'+(paymentForm.number*paymentForm.unitPrice).toFixed(2)}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="paymentDispositionDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDisposalPayment">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 查看单据 -->
    <div class="order-dialog">
      <el-dialog title="订单交易详情" :visible.sync="receiptsDispositionDialogFormVisible" width="50%"
                 v-if="receiptsDispositionDialogFormVisible">
        <el-form :model="receiptsForm" label-width="100px">
          <el-form-item style="background:#ddd;">
            <h3 class="title" style="padding-left:38%;">产废企业</h3>
          </el-form-item>
          <el-form-item label="产废企业：">
            <el-input v-model="receiptsForm.productionEnterprises" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废类型：">
            <el-input v-model="receiptsForm.daType=='1'?'不可回收':receiptsForm.daType=='2'?'可回收':''" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废类别：">
            <el-input v-model="receiptsForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：">
            <el-input v-model="receiptsForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：">
            <el-input v-model="findConfigItem(receiptsForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：">
            <el-input v-model="receiptsForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="receiptsForm.productionContacts" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="receiptsForm.productionPhone" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系地址：">
            <el-input
              v-model="receiptsForm.productionProvince+receiptsForm.productionCity+receiptsForm.productionRegion+receiptsForm.productionAddress"
              disabled></el-input>
          </el-form-item>
          <el-form-item style="background:#ddd;">
            <h3 class="title" style="padding-left:38%;">处置企业</h3>
          </el-form-item>
          <el-form-item label="处置企业：">
            <el-input v-model="receiptsForm.disposeEnterprises" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="receiptsForm.disposeContacts" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="receiptsForm.disposePhone" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系地址：">
            <el-input
              v-model="receiptsForm.disposeProvince+receiptsForm.disposeCity+receiptsForm.disposeRegion+receiptsForm.disposeAddress"
              disabled></el-input>
          </el-form-item>
          <el-form-item style="background:#ddd;">
            <h3 class="title" style="padding-left:36%;">订单处理详情</h3>
          </el-form-item>
          <el-form-item label="付款方企业：">
            <el-input
              v-model="receiptsForm.paymentEnterpriseName"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="备案信息：">
            <a :href="$store.state.fileDownloadUrl+receiptsForm.declareAttId">查看备案</a>
          </el-form-item>
          <el-form-item label="申报信息：">
            <a :href="$store.state.fileDownloadUrl+receiptsForm.recordsAttId">查看申报</a>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input
              v-model="receiptsForm.number+findConfigItem(receiptsForm.unit,$store.state.dictionary.unit).title"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：">
            <el-input v-model="'￥'+receiptsForm.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易总额：">
            <el-input v-model="'￥'+(receiptsForm.number*receiptsForm.price).toFixed(2)" disabled></el-input>
          </el-form-item>
          <el-form-item label="处置结果：">
            <a :href="$store.state.fileDownloadUrl+receiptsForm.disposeAttId">查看处置结果</a>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="receiptsDispositionDialogFormVisible = false">确认</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle';

  export default {
    name: "orderProcessing",//订单处理
    data() {
      return {
        activeIndex: "0",//
        tableData: [],//表数据
        daType: "0",//订单类型
        selectTime: "",
        orderStatus: "",
        orderFilters: [],//订单状态
        timeFilters: [],//订单时间
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },

        //签约弹框
        signDialogFormVisible: false,//弹框--false
        signId: "",//订单id
        signForm: {//签约表单
          fileId: "",//附件id
          value: "",//
          options: [
            {
              label: "物流1",
              value: "1"
            },
            {
              label: "物流2",
              value: "2"
            }
          ],//
        },
        signFormRules: {
          upload: [],
          value: [{required: true, message: '请选择物流公司', trigger: 'blur'}]
        },

        //确认弹框
        notarizeDialogFormVisible: false,//弹框--false
        notarizeId: "",//订单id
        notarizeForm: {//签约表单
          daCategory: "",//危废类别
          daCode: "",//危废代码
          industrySource: "",//行业来源
          dangerousWasteSource: "",//危废来源
          address: "",//危废地址
          number: "",//交易数量
          unitPrice: "",//交易单价
          total: "",//交易金额
        },

        //处置弹框
        dispositionDialogFormVisible: false,//弹框--false
        dispositionId: "",//订单id
        dispositionForm: {//签约表单
          daCategory: "",//危废类别
          daCode: "",//危废代码
          industrySource: "",//行业来源
          dangerousWasteSource: "",//危废来源
          address: "",//危废地址
          number: "",//交易数量
          unitPrice: "",//交易单价
          total: "",//交易金额
        },


        //付款弹框
        paymentDispositionDialogFormVisible: false,//弹框--false
        paymentForm: {//签约表单
          daCategory: "",//危废类别
          daCode: "",//危废代码
          industrySource: "",//行业来源
          dangerousWasteSource: "",//危废来源
          address: "",//危废地址
          number: "",//交易数量
          unitPrice: "",//交易单价
          total: "",//交易金额
          id: "",//订单id
        },

        //查看单据
        receiptsDispositionDialogFormVisible: false,//弹框--false
        receiptsForm: {},

      };
    },
    components: {
      CommonTitle,//公共标题
    },
    created() {
      this.getLoadingRoutingDictionaryData(); //获取路由词典数据
      this.getLoadingTableData(); //获取表数据
      this.getLoadingOrdersDictionaryData();//
    },
    methods: {

      //转换成element-select数据格式
      handleChangeElement(obj) {
        let result = [];
        for (let i = 0; i < obj.length; i++) {
          result.push({});
          result[i].value = obj[i].itemCode;
          result[i].text = obj[i].title
        }
        return result;
      },


      //获取路由词典数据
      getLoadingRoutingDictionaryData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findOneType",
          data: {
            moduleCode: "ORDER_STATUS_QUOTE,cxsj"
          }
        }).then((res) => {
          _this.orderFilters = _this.handleChangeElement(res.data.data.ORDER_STATUS_QUOTE);
          _this.timeFilters = _this.handleChangeElement(res.data.data.cxsj);
          console.log(" _this.orderFilters", _this.orderFilters);
        });
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
          }
          else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.orderStatus = column.filteredValue[0];
          }
        }
        _this.getLoadingTableData();
      },

      //menu切换
      handleSelect(key, keyPath) {
        let _this = this;
        this.$router.push({
          path: 'orderProcessing',
          query: {
            status: key//1 2 3
          }
        });//根据订单状态显示路由
        _this.selectTime = "";
        _this.orderStatus = "";
        _this.daType = key;
        _this.getLoadingTableData()
      },

      //获取表数据
      getLoadingTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/quote/queryAllOrder",
          data: {
            daType: _this.daType,//订单类型
            selectTime: _this.selectTime,//报价时段
            pageIndex: _this.page.pageNum,//页码
            pageSize: _this.page.pageSize,//每页条数
            orderStatus: _this.orderStatus,//全部 "" ,已报价1，未报价0
          }
        }).then((res) => {
          switch (res.data.status) {
            case  -500:
              _this.tableData = [];
              break;
            case  200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case  300:
              _this.tableData = [];
              break;
          }
        })
      },

      //显示签约弹框
      handleShowSignDialog(row) {
        let _this = this;
        _this.signDialogFormVisible = true;
        _this.signId = row.id;

      },

      //关闭签约弹框
      handleCloseSignForm() {
        let _this = this;
        _this.signDialogFormVisible = false;
        _this.signForm.fileId = "";
        _this.$refs.upload.clearFiles();//清空上传的文件
      },

      //附件上传成功获取对应id
      handleSuccessGetId(res) {
        this.signForm.fileId = res.data;
        console.log("上传成功后的附件id", this.form.fileId);
      },

      //取消上传
      handleRemoveSignFile(file, fileList) {
        let _this = this;
        _this.signForm.fileId = "";
      },

      //签约
      handleSignContract() {
        let _this = this;
        if (!_this.signForm.fileId) {
          _this.$message({
            type: 'warning',
            message: '请上传合同'
          });
        } else if (!_this.signForm.value) {
          _this.$message({
            type: 'warning',
            message: '请选择物流公司'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/quote/addInstruction",
            data: {
              attId: _this.signForm.fileId, //页数
              id: _this.signId,//订单id
              logistics: _this.signForm.value//物流公司
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: 'success',
                  message: "签收成功！"
                });
                _this.signDialogFormVisible = false;
                _this.getLoadingTableData(); //获取表数据
                _this.signForm = {//签约表单
                  fileId: "",//附件id
                  value: "",
                  options: [
                    {
                      label: "物流1",
                      value: "1"
                    },
                    {
                      label: "物流2",
                      value: "2"
                    }
                  ],//
                };
                _this.$refs.upload.clearFiles();//清空上传的文件
                break;
            }
          })
        }
      },

      //附件上传验证
      beforeAvatarUpload(file) {
        //   const isJPG = file.type === 'image/jpeg';
        //   const isLt2M = file.size / 1024 / 1024 < 2;
        //
        //   if (!isJPG) {
        //     this.$message.error('上传头像图片只能是 JPG 格式!');
        //   }
        //   if (!isLt2M) {
        //     this.$message.error('上传头像图片大小不能超过 2MB!');
        //   }
        //   return isJPG && isLt2M;
        // }
      },

      //上传文件超出数量
      handleBeyondFile() {
        let _this = this;
        _this.$message({
          type: "warning",
          message: "上传文件超出限制!"
        });
      },

      //显示确认收货弹框
      handleShowNotarizeDialog(row) {
        this.notarizeDialogFormVisible = true;
        this.notarizeId = row.id;
        let {daCategory, daCode, industrySource, dangerousWasteSource, address, number, unit, unitPrice, province, city, region} = row;
        this.notarizeForm.daCategory = daCategory;//危废类别
        this.notarizeForm.daCode = daCode;//危废代码
        this.notarizeForm.industrySource = industrySource;//行业来源
        this.notarizeForm.dangerousWasteSource = dangerousWasteSource;//危废来源
        this.notarizeForm.address = province + ' ' + city + ' ' + region + ' ' + address;//危废地址
        this.notarizeForm.number = number;//交易数量
        this.notarizeForm.unit = unit;//
        this.notarizeForm.unitPrice = unitPrice;//交易单价

      },

      // 确认收货
      handleMakeSureTheGoods() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/quote/confirmReceipt",
          data: {
            id: _this.notarizeId,//订单id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.$message({
                type: 'success',
                message: "签收成功！"
              });
              _this.notarizeDialogFormVisible = false;
              _this.getLoadingTableData();
              _this.notarizeForm = {//签约表单
                daCategory: "",//危废类别
                daCode: "",//危废代码
                industrySource: "",//行业来源
                dangerousWasteSource: "",//危废来源
                address: "",//危废地址
                number: "",//交易数量
                unitPrice: "",//交易单价
                total: "",//交易金额
              };
              break;
          }
        })
      },

      //显示处置弹框
      handleShowDispositionDialog(row) {
        this.dispositionDialogFormVisible = true;
        this.dispositionId = row.id;
        let {daCategory, unit, daCode, industrySource, dangerousWasteSource, province, city, region, address, number, unitPrice} = row;
        this.dispositionForm.daCategory = daCategory;//危废类别
        this.dispositionForm.daCode = daCode;//危废代码
        this.dispositionForm.industrySource = industrySource;//行业来源
        this.dispositionForm.dangerousWasteSource = dangerousWasteSource;//危废来源
        this.dispositionForm.province = province;//危废地址
        this.dispositionForm.city = city;//危废地址
        this.dispositionForm.region = region;//危废地址
        this.dispositionForm.address = address;//危废地址
        this.dispositionForm.number = number;//交易数量
        this.dispositionForm.unit = unit;//单位
        this.dispositionForm.unitPrice = unitPrice;//交易单价
      },

      //附件上传成功获取对应id
      handleSuccessDispositionGetId(res) {
        this.dispositionForm.fileId = res.data;
        console.log("上传成功后的附件id", this.form.fileId);
      },

      //取消上传
      handleRemoveDispositionFile(file, fileList) {
        let _this = this;
        _this.dispositionForm.fileId = "";
      },

      //关闭弹框
      handleCloseDisposition() {
        let _this = this;
        _this.dispositionDialogFormVisible = false;
        _this.dispositionForm.fileId = "";
        _this.$refs.dispositionFormUpload.clearFiles();
      },

      //处置结果
      handleDisposalResults() {
        let _this = this;
        if (!_this.dispositionForm.fileId) {
          _this.$message({
            type: 'warning',
            message: '请上传处置结果'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/quote/disposalResult",
            data: {
              attId: _this.dispositionForm.fileId, //附件id
              id: _this.dispositionId,//订单id
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: 'success',
                  message: "签收成功！"
                });
                _this.dispositionDialogFormVisible = false;
                _this.dispositionForm = {
                  daCategory: "",//危废类别
                  daCode: "",//危废代码
                  industrySource: "",//行业来源
                  dangerousWasteSource: "",//危废来源
                  address: "",//危废地址
                  number: "",//交易数量
                  unitPrice: "",//交易单价
                  total: "",//交易金额
                };
                _this.$refs.dispositionFormUpload.clearFiles();
                _this.getLoadingTableData();
                break;
            }
          })
        }
      },

      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.getLoadingTableData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.pageNum = val;
        this.getLoadingTableData();
      },

      //显示付款弹框
      handleShowPaymentDialog(row) {
        let _this = this;
        _this.paymentDispositionDialogFormVisible = true;
        let {daCategory, unit, daCode, province, city, region, industrySource, dangerousWasteSource, address, number, unitPrice, id} = row;
        console.log("daCategory", daCategory);
        _this.paymentForm.daCategory = daCategory;//危废类别
        _this.paymentForm.daCode = daCode;//危废代码
        _this.paymentForm.industrySource = industrySource;//行业来源
        _this.paymentForm.dangerousWasteSource = dangerousWasteSource;//危废来源
        _this.paymentForm.address = province + ' ' + city + ' ' + region + ' ' + address;//危废地址
        _this.paymentForm.number = number;//交易数量
        _this.paymentForm.unit = unit;//交易数量
        _this.paymentForm.unitPrice = unitPrice;//交易单价
        _this.paymentForm.id = id;//订单Id
      },

      //确认付款
      handleDisposalPayment() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/quote/orderPendingPayment",
          data: {
            orderId: _this.paymentForm.id,//订单id
            enabledFlag: '1',//订单id
            payAmount: _this.paymentForm.unitPrice * _this.paymentForm.unitPrice,//订单id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.$message({
                type: 'success',
                message: "付款成功！"
              });
              _this.paymentDispositionDialogFormVisible = false;
              _this.getLoadingTableData(); //获取表数据
              _this.paymentForm = {//签约表单
                daCategory: "",//危废类别
                daCode: "",//危废代码
                industrySource: "",//行业来源
                dangerousWasteSource: "",//危废来源
                address: "",//危废地址
                number: "",//交易数量
                unitPrice: "",//交易单价
                total: "",//交易金额
              };
              break;
          }
        })
      },

      //查看单据
      handleShowReceiptFormDialog(id) {
        let _this = this;
        _this.receiptsDispositionDialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/quote/queryOrderBill",
          data: {
            id: id//当前订单id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.receiptsForm = res.data.data;
              break;
          }
        })
      },

      //查看订单详情
      handleGoToLogisticsDetail(row) {
        let _this = this;
        _this.$router.push({
          path: 'logisticsDaOrderDetails',
          query: {
            id: row.id,
            otherId: "1"
          }
        });
      },

      //收藏企业
      handleCollectionEnterprise(companyId) {
        let _this = this;
        _this.$confirm('确定收藏该企业吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/enterpriseCollection",
            data: {
              id: companyId//当前企业id
            }
          }).then((res) => {
            switch (res.data.status) {
              case  200:
                _this.$message({
                  type: 'success',
                  message: '成功收藏该企业!'
                });
                break;
              case  300:
                _this.$message({
                  type: 'warning',
                  message: '该企业已被收藏!'
                });
                break;
            }
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消收藏'
          });
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
            companyId: row.companyId
          }
        });
      },

    }
  };
</script>
<style>
  .order-table .el-table th {
    background: rgba(242, 242, 242, 1);
  }

  .order-table .el-table__expanded-cell {
    /* background: #f9f9f9; */
    font-size: 12px;
    padding: 20px 20px;
  }

  .el-col {
    padding: 0px;
  }
</style>
<style lang="less" scoped>
  .order-processing {

    .order-pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 40%;

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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

    }
    .enterprise {
      line-height: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .details {
      margin-top: 30px;
      text-align: center;
    }
    .operation {
      margin-top: 30px;
      padding-left: 20px;
      text-align: center;
    }
    :hover {
      overflow: visible;
    }
  }
</style>

