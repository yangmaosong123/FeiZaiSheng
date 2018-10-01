/**
*@file 产废_危废管理
*@author 周毖强
*/
<template>
  <div class="order-common-attack">

    <!-- 公共标题 -->
    <CommonTitle title="订单管理"></CommonTitle>

    <!-- 搜索模块 -->
    <div class="form-search background-color clearfix">
      <div class="search-left-content fl">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item index="0">全部</el-menu-item>
          <el-menu-item index="1"> 不可回收</el-menu-item>
          <el-menu-item index="2">可回收</el-menu-item>
        </el-menu>
      </div>
    </div>

    <!-- 表格模块 -->
    <div class="order-table-content background-color">
      <el-table @filter-change="handleFilterChg" ref="tableData" default-expand-all :data="tableData"
                highlight-current-row
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row id="content">
              <el-col :span="3">
                <div class="logo">
                  <img
                    @click="handleGoToWasteDetail(props.row)"
                    :src="$store.state.outputImgUrl+props.row.id+'&bizObjName=prod_img'"
                    :alt="'img'+props.row.id">
                </div>
              </el-col>
              <el-col :span="6">
                <el-row class="title">
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">{{props.row.daName}}</div>
                      <el-button class="nowrap nowrap-h3" type="text" @click="handleGoToWasteDetail(props.row)">
                        {{props.row.daName}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row class="address">
                  <el-row>
                    <el-col>
                      <el-tooltip placement="right-start" effect="light">
                        <div slot="content">{{ props.row.daCategory }}/{{ props.row.daCode}}</div>
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
                          {{findConfigItem(props.row.industrySource,$store.state.dictionary.hyly).title}}
                          /{{props.row.dangerousWasteSource}}
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
                      地址：{{ props.row.province+ props.row.city+props.row.region}}
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
                  <span>数量：{{ props.row.number }}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                </el-row>
                <el-row>
                  <span>单价：
                    {{!props.row.price||props.row.price=='0.00'?'面议':'￥'+props.row.price }}
                  </span>
                </el-row>
              </el-col>
              <el-col :span="5" class="enterprise">
                <span>
                  {{ props.row.enterpriseName===''?'——':props.row.enterpriseName }}
                </span>
              </el-col>

              <el-col :span="3" class="details">
                {{findConfigItem(props.row.orderState,$store.state.dictionary.ORDER_STATUS).title}}
                <el-button type="text" size="small" @click="handleGoToLogisticsDetail(props.row)">
                  订单详情
                </el-button>
              </el-col>
              <el-col :span="4" class="operation">
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='2'"
                           @click="handleShowContractDialog(props.row)">
                  签约
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='11'"
                           @click="handleShowConsigneeDialog(props.row)">
                  确认交货
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='4'"
                           @click="handleShowSingFormDialog(props.row)"
                >上传备案
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='5'"
                           @click="handleShowSingFormDialog(props.row)">
                  付款
                </el-button>
                <el-button type="text" size="small"
                           v-show="props.row.orderState=='14'&&props.row.disposalResult=='Y'"
                           @click="handleShowreceiptsFormDialog(props.row.id)">
                  查看单据
                </el-button>
                <el-button type="text" size="small" @click="handleCollectionEnterprise(props.row.companyId)">
                  收藏企业
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="日期"
          width="180"
          column-key="filter_date"
          :filter-multiple="false"
          :filters="timeFilters"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单详情"
          width="270"
          prop="">
          <template slot-scope="scope">
            <span>订单编号：{{scope.row.orderSn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="处置企业"
          width="200"
          prop="">
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="130"
          column-key="filter_tag"
          :filter-multiple="false"
          :filters="orderFilters"
          prop="tag">
        </el-table-column>
        <el-table-column
          label="订单操作"
          prop="">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

    <!-- 发布订单 -->
    <ReleaseTheOrderDialog ref="ReleaseTheOrderDialog"></ReleaseTheOrderDialog>

    <!-- 签约弹框 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="signContractDialogFormVisible" width="40%"
                 :before-close="handleRemoveSignContract"
                 v-if="signContractDialogFormVisible">
        <el-form :model="signFormContract" :rules="signFormContractRules">
          <el-form-item label="上传合同：" prop="file">
            <el-upload
              class="upload-demo"
              ref="signAContract"
              :limit="1"
              :action="this.$store.state.fileUploadUrl"
              :on-remove="handleRemoveGetIdContract"
              :on-success="handleSuccessGetIdContract">
              <el-button size="small" type="primary" style="background:#208dd6;">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="color:#208dd6;border:1px solid #208dd6;" @click="handleRemoveSignContract">
            取 消
          </el-button>
          <el-button style="background:#208dd6;" type="primary" @click="handleSignContract">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 上传备案弹框 -->
    <div class="order-dialog">
      <el-dialog title="上传备案"
                 :visible.sync="signDialogFormVisible"
                 :before-close="handleRemoveSignForm"
                 width="40%">
        <el-form :model="signForm" ref="signForm" :rules="signFormRules">
          <el-form-item label="上传备案：" required>
            <el-upload
              class="upload-demo"
              ref="SignUpload"
              v-model="signForm.records"
              :action="this.$store.state.fileUploadUrl"
              :on-remove="handleRemoveGetIdSign"
              :on-success="handleSuccessGetIdSign">
              <el-button size="small" type="primary" style="background:#208dd6;">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="危废类别：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="signForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="signForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="findConfigItem(signForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input type="textarea" v-model="signForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废地址：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="signForm.address" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易数量：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="signForm.number+findConfigItem(signForm.unit,$store.state.dictionary.unit).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：" v-show="signForm.payer=='1'||!signForm.payer">
            <el-input v-model="'￥'+signForm.unitPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易总金额：" v-show="signForm.payer=='1'||!signForm.payer">
            <span>￥{{parseInt(signForm.number*signForm.unitPrice).toFixed(2)}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="color:#208dd6;border:1px solid #208dd6;"
                     @click="handleRemoveSignForm">
            取 消
          </el-button>
          <el-button style="background:#208dd6;" type="primary" @click="handleSignSignForm">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 确认收货 -->
    <div class="order-dialog">
      <el-dialog title="" :visible.sync="consigneeDispositionDialogFormVisible" width="30%"
                 v-if="consigneeDispositionDialogFormVisible">
        <el-form :model="consigneeForm" label-width="100px">
          <el-form-item label="危废类别：">
            <el-input v-model="consigneeForm.daCategory" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废代码：">
            <el-input v-model="consigneeForm.daCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="行业来源：">
            <el-input type="textarea"
                      v-model="findConfigItem(consigneeForm.industrySource ,$store.state.dictionary.hyly).title"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="危废来源：">
            <el-input type="textarea" v-model="consigneeForm.dangerousWasteSource" disabled></el-input>
          </el-form-item>
          <el-form-item label="危废地址：">
            <el-input type="textarea"
                      v-model="consigneeForm.province+consigneeForm.city+consigneeForm.region+consigneeForm.address"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input
              v-model="consigneeForm.number+findConfigItem(consigneeForm.unit,$store.state.dictionary.unit).title"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="交易单价：">
            <el-input v-model="'￥'+consigneeForm.unitPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="交易金额：">
            <span>{{'￥'+(consigneeForm.number*consigneeForm.unitPrice).toFixed(2)}}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="consigneeDispositionDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleShowConsignee">确 定</el-button>
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
          <el-form-item label="申报信息：">
            <a :href="$store.state.fileDownloadUrl+receiptsForm.declareAttId">查看申报</a>
          </el-form-item>
          <el-form-item label="备案信息：">
            <a :href="$store.state.fileDownloadUrl+receiptsForm.recordsAttId">查看备案</a>
          </el-form-item>
          <el-form-item label="交易数量：">
            <el-input
              v-model="receiptsForm.number+findConfigItem(consigneeForm.unit,$store.state.dictionary.unit).title"
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
  import CommonTitle from '../common/commonTitle'
  import ReleaseTheOrderDialog from './components/releaseTheOrderDialog'

  export default {
    name: "orderCommonAttack",//订单管理
    data() {
      return {

        activeIndex: '0',//index--默认全部订单
        tableData: [],//订单表--数据
        selectTime: '',//订单时间
        orderStatus: "",//订单状态
        daType: '0',//危废种类
        dataRowCount: 0,
        filterValue: [],
        orderFilters: [],//订单状态
        timeFilters: [],//订单时间
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },//分页

        //签约
        signContractDialogFormVisible: false,
        signFormContract: {
          id: "",//当前订单id
          fileId: "",//附件id
        },
        signFormContractRules: {
          file: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
          ],
        },

        //上传备案
        signDialogFormVisible: false,
        signForm: {
          id: "",//当前订单id
          fileId: "",//附件id
          daCategory: "",//危废类别
          daCode: "",//危废代码
          industrySource: "",//行业来源
          dangerousWasteSource: "",//危废来源
          address: "",//危废地址
          number: "",//交易数量
          unitPrice: "",//交易单价
          payer: '',//根据值不同调不同接口
        },
        signFormRules: {},

        //确认收货
        consigneeDispositionDialogFormVisible: false,//弹框--false
        consigneeForm: {//签约表单
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
        receiptsForm: {//签约表单
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

      };
    },
    created() {
      this.getLoadingRoutingDictionaryData(); //获取路由词典数据
      this.handleGetTableData(); //获取表数据
    },
    components: {
      CommonTitle,//公共标题
      ReleaseTheOrderDialog,//发布订单--弹框
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
            moduleCode: "ORDER_STATUS,cxsj"
          }
        }).then((res) => {
          _this.orderFilters = _this.handleChangeElement(res.data.data.ORDER_STATUS);
          _this.timeFilters = _this.handleChangeElement(res.data.data.cxsj);
          console.log(" _this.orderFilters", _this.orderFilters);
        });
      },

      //表过滤
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
        this.handleGetTableData();
      },

      //menu切换
      handleSelect(key, keyPath) {
        this.$router.push({
          path: 'orderCommonAttack',
          query: {
            orderStatus: key//1 2 3
          }
        });//根据订单状态显示路由
        this.selectTime = "";
        this.orderStatus = "";
        this.daType = key;
        this.$refs.tableData.clearFilter();
        this.handleGetTableData();//获取表数据
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/orderList",
          data: {
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
            orderStatus: _this.orderStatus, //数据状态(必填)
            selectTime: _this.selectTime,//订单时间
            daType: _this.daType,//危废种类
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case -500:
              _this.tableData = [];
              break;
            case 300:
              _this.tableData = [];
              break;
          }
        })
      },

      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetTableData();//获取表数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.handleGetTableData();//获取表数据
      },

      //关闭签约签约弹框
      handleRemoveSignContract() {
        let _this = this;
        _this.signContractDialogFormVisible = false;
        _this.signFormContract.fileId = "";
      },

      //显示签约弹框
      handleShowContractDialog(row) {
        this.signContractDialogFormVisible = true;
        this.signFormContract.id = row.id;
      },

      //附件上传成功获取对应id
      handleSuccessGetIdContract(res) {
        let _this = this;
        _this.signFormContract.fileId = res.data;
      },
      //取消附件上传
      handleRemoveGetIdContract() {
        let _this = this;
        _this.signFormContract.fileId = "";
      },

      handleSignContract() {
        let _this = this;
        if (!_this.signFormContract.fileId) {
          _this.$message({
            type: 'warning',
            message: '请上传合同'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/order/orderContract",
            data: {
              id: _this.signFormContract.id,
              attId: _this.signFormContract.fileId
            }
          }).then((res) => {
            if (res.data.status === 200) {
              _this.$message({
                type: 'success',
                message: "签收成功！"
              });
              _this.signContractDialogFormVisible = false;
              _this.handleGetTableData(); //获取表数据
              _this.$refs.signAContract.clearFiles();
            }
          })
        }
      },

      //关闭上传备案
      handleRemoveSignForm() {
        let _this = this;
        _this.signDialogFormVisible = false;
        _this.signForm.fileId = "";
        _this.$refs.SignUpload.clearFiles();
      },

      //显示上传备案弹框
      handleShowSingFormDialog(row) {
        let _this = this;
        _this.signDialogFormVisible = true;
        let {id, daCategory, daCode, industrySource, dangerousWasteSource, number, unitPrice, province, city, region, address, payer, unit} = row;
        _this.signForm.id = id;
        _this.signForm.daCategory = daCategory;
        _this.signForm.daCode = daCode;
        _this.signForm.industrySource = industrySource;
        _this.signForm.dangerousWasteSource = dangerousWasteSource;
        _this.signForm.address = province + "/" + city + "/" + region + "/" + address;
        _this.signForm.number = number;
        _this.signForm.unitPrice = unitPrice;
        _this.signForm.payer = payer;
        _this.signForm.unit = unit;
      },


      //备案上传成功获取对应id
      handleSuccessGetIdSign(res) {
        let _this = this;
        _this.signForm.fileId = res.data;
        console.log("上传成功后的附件id", _this.signForm.fileId);
      },

      //取消上传备案
      handleRemoveGetIdSign() {
        let _this = this;
        _this.signForm.fileId = "";
      },

      //确定上传备案
      handleSignSignForm() {
        let _this = this;
        if (!_this.signForm.fileId) {
          _this.$message({
            type: 'warning',
            message: '请上传备案'
          });
        } else {
          if (_this.signForm.payer == '1' || !_this.signForm.payer) {
            _this.$axios({
              method: "post",
              url: "/order/uploadFile",
              data: {
                attId: _this.signForm.fileId,//附件id
                enabledFlag: "1",//后端默认传1
                orderId: _this.signForm.id,//当前订单id
                payAmount: (_this.signForm.number * _this.signForm.unitPrice)//交易总金额
              }
            }).then((res) => {
              switch (res.data.status) {
                case 200:
                  _this.$message({
                    type: 'success',
                    message: "上传备案成功！"
                  });
                  _this.signDialogFormVisible = false;
                  _this.handleGetTableData();//获取表数据
                  _this.$refs.SignUpload.clearFiles();
                  break;
              }
            })
          } else if (_this.signForm.payer == '2') {
            _this.$axios({
              method: "post",
              url: "/order/productionUploadFile",
              data: {
                attId: _this.signForm.fileId,//附件id
                id: _this.signForm.id,//当前订单id
              }
            }).then((res) => {
              if (res.data.status === 200) {
                _this.$message({
                  type: 'success',
                  message: "上传备案成功！"
                });
                // _this.router.push('/');
                _this.signDialogFormVisible = false;
                _this.handleGetTableData();//获取表数据
                console.log("_this.signForm.fileId", _this.signForm.fileId);
                console.log("_this.signForm.fileId", _this.signForm.id);
              }
            })
          }
        }
      },

      //显示确认收货弹框
      handleShowConsigneeDialog(row) {
        let _this = this;
        _this.consigneeDispositionDialogFormVisible = true;
        let {daCategory, daCode, province, city, region, unit, industrySource, dangerousWasteSource, address, number, unitPrice, id} = row;
        console.log("daCategory", daCategory);
        _this.consigneeForm.daCategory = daCategory;//危废类别
        _this.consigneeForm.daCode = daCode;//危废代码
        _this.consigneeForm.industrySource = industrySource;//行业来源
        _this.consigneeForm.dangerousWasteSource = dangerousWasteSource;//危废来源
        _this.consigneeForm.province = province;//危废地址
        _this.consigneeForm.city = city;//危废地址
        _this.consigneeForm.region = region;//危废地址
        _this.consigneeForm.address = address;//危废地址
        _this.consigneeForm.number = number;//交易数量
        _this.consigneeForm.unit = unit;//交易数量
        _this.consigneeForm.unitPrice = unitPrice;//交易单价
        _this.consigneeForm.id = id;//订单Id
      },

      //确认收货
      handleShowConsignee() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/confirmReceipt",
          data: {
            id: _this.consigneeForm.id,//订单id
          }
        }).then((res) => {
          switch (res.data.status) {
            case  200:
              _this.$message({
                type: 'success',
                message: "已确认收货！"
              });
              _this.consigneeDispositionDialogFormVisible = false;
              _this.handleGetTableData(); //获取表数据
              _this.consigneeForm = {//签约表单
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
      handleShowreceiptsFormDialog(id) {
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

      //查看订单详情
      handleGoToWasteDetail(row) {
        let _this = this;
        _this.$router.push({
          path: '/user/logisticsDaOrderDetails',
          query: {
            id: row.id,
            otherId: '1',
          }
        });
      },
    }
  };
</script>
<style>
  .order-table-content .el-table__expanded-cell {
    background: #f9f9f9;
    font-size: 12px;
    padding: 20px 20px;
  }

  .el-col {
    padding: 0px;
  }
</style>
<style lang="less" scoped>
  .order-common-attack {
    .form-search {
      height: 60px;
      position: relative;
      .search-button {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
    .pagination {
      padding-top: 11px;
      height: 50px;
      line-height: 50px;
      padding-left: 40%;
    }
  }
</style>
<style lang="less" scoped>
  #content {

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

    }
    .type {
      padding-top: 25px;
      font-size: 12px;
    }
    .enterprise {
      line-height: 90px;
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
      line-height: 90px;
    }
    :hover {
      overflow: visible;
    }
  }
</style>

