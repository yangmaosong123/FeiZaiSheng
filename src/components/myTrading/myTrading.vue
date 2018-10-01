<template>
  <div class="recycle-order">

    <!-- tab切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs"></el-tab-pane>
    </el-tabs>

    <!-- 表数据 -->
    <el-table @filter-change="handleFilterChg"
              ref="tableData"
              default-expand-all :data="tableData"
              highlight-current-row
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row id="content">
            <el-col :span="3">
              <div class="logo">
                <img
                  @click="handleGoToLogisticsDetail(props.row)"
                  :src="$store.state.outputImgUrl+props.row.productId+'&bizObjName=upload_img'"
                  :alt="'img'+props.row.id">
              </div>
            </el-col>
            <el-col :span="6">
              <el-row class="title">
                <el-col><span @click="handleGoToLogisticsDetail(props.row)">
                  【{{props.row.tradeType=='buy'?'求购':props.row.tradeType=='sell'?'出售':''}}】
                  <el-tooltip placement="right-start" effect="light">
                                <div slot="content">
                                   {{props.row.productTitle}}
                                </div>
                                <el-button class=" nowrap-h3 nowrap4"
                                           @click="handleGoToLogisticsDetail(props.row)"
                                           type="text"
                                >
                                   {{props.row.productTitle}}
                                </el-button>
                              </el-tooltip>
                  </span>
                </el-col>
              </el-row>
              <el-row class="address">
                <el-row>
                  <el-col>
                    <el-tooltip placement="right-start" effect="light">
                      <div slot="content">
                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </div>
                      <el-button class="nowrap4 nowrap-h4"
                                 @click="handleGoToLogisticsDetail(props.row)"
                                 type="text"
                      >
                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                      </el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <span>最小成交量:{{props.row.minTradeQuantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <span style="white-space:normal; word-break:break-all;">地址：{{ makeAddr(props.row.province,props.row.city,props.row.region)}}</span>
                </el-row>
              </el-row>
            </el-col>
            <el-col :span="3" class="type">
              <el-row>
                <span>交易类型：{{props.row.tradeType=='buy'?'求购':props.row.tradeType=='sell'?'出售':''}}</span>
              </el-row>
              <el-row>
                <span>数量：{{ props.row.quantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
              </el-row>
              <el-row>
                <span>单价：{{(!props.row.price || parseFloat(props.row.price)<=0) ?'面议':'￥'+props.row.price}}</span>
              </el-row>
            </el-col>
            <el-col :span="6" class="enterprise">
              <span>{{!props.row.enterpriseName?'**':props.row.enterpriseName}}</span>
            </el-col>

            <el-col :span="3" class="details">
              <span>{{findConfigItem(props.row.orderStatusForSeller,$store.state.dictionary.order_status_for_seller).title}}</span>
            </el-col>
            <el-col :span="3" class="operation">
              <el-button type="text" size="small" @click="handleShowPayment(props.row)"
                         v-show="props.row.orderStatusForSeller=='wait_pay'">付款
              </el-button>
              <el-button type="text" size="small" @click="showConfirmDialog(props.row)"
                         v-show="props.row.orderStatusForBuyer=='convey'&&props.row.tradeType=='buy'">交易确认
              </el-button>
              <el-button type="text" size="small" @click="handleGoToLogisticsDetail(props.row)">订单详情</el-button>
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
          <span>{{dateToStrMinue(scope.row.creationTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易详情"
        width="270"
        prop="">
        <template slot-scope="scope">
          <span>订单编号：{{scope.row.orderSn}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="合作企业"
        width="180"
        prop="">
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="130"
        column-key="filter_tag"
        :filter-multiple="false"
        :filters="dictionaryToFilter($store.state.dictionary.order_status_for_seller)"
        prop="tag">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="">
        <template slot-scope="props">

        </template>
      </el-table-column>
    </el-table>
    <confirm-trade-dialog :tradeQuantity="contextRowData.tradeQuantity"
                          :unit="findConfigItem(contextRowData.unit,$store.state.dictionary.unit).title"
                          v-if="showConfirm" :minQuantity="contextRowData.minTradeQuantity" @after-save="confirmOk"
                          @hide="hideConfirmTrade" tradeType="sell" :productTitle="contextRowData.productTitle"
                          :id="contextRowData.id"/>
    <confirm-payment :unit="findConfigItem(contextRowData.unit,$store.state.dictionary.unit).title" v-if="showPayment"
                     @hide="cancelPayment" @after-save="confirmOk" tradeType="buy"
                     :productTitle="contextRowData.productTitle" :id="contextRowData.id"/>

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


  </div>
</template>
<script>
  import ConfirmTrade from '@/components/rec/ConfirmTrade'
  import ConfirmPayment from '@/components/rec/ConfirmPayment'

  export default {
    name: "myTrading",//我的商品
    components: {
      "confirm-trade-dialog": ConfirmTrade,
      "confirm-payment": ConfirmPayment
    },
    data() {

      //验证数量+价格
      let handleJudgeIsNumber = (rule, value, callback) => {
        if (isNaN(value))
          return callback(new Error('单价和数量必须是数字'));
        else if (value < 1) return callback(new Error('单价和数量必须大于/等于1且必填'));
        else return callback();
      };
      return {
        activeName: '',//tabs--1
        contextRowData: {},
        tabs: [
          {
            value: "",
            label: "全部"
          },
          {
            value: "sell",
            label: "买入"
          },
          {
            value: "buy",
            label: "卖出"
          }
        ],//tabs--数据
        showConfirm: false,
        showPayment: false,
        quotationPeriod: "",//时间
        buyerSellerStatus: "",//买卖状态
        tradeType: "",//类型
        tableData: [],//表
        page: {//分页
          total: 0,//总数
          currentPage: 1,//当前页
          pageSize: 10,//每页条数
        },
        confirmOrderDialogVisible: false,//确定订单弹框
        id: '',//订单id

        //付款
        paymentDialogFormVisible: false,
        paymentForm: {
          totalCount: '',
          quantity: '',
          price: ''
        },//付款--表单
        paymentBtn: false,
        paymentFormRules: {
          quantity: [{validator: handleJudgeIsNumber, trigger: 'blur'}],
          price: [{validator: handleJudgeIsNumber, trigger: 'blur'}],
        },
        orderStatus: [],

      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    methods: {
      //查看订单详情
      handleGoToLogisticsDetail(row) {
        let _this = this;
        _this.$router.push({
          path: 'recBillStatus',
          query: {
            id: row.id,
            otherId: "2"
          }
        });
      },

      hideConfirmTrade: function () {
        this.showConfirm = false;
      },

      cancelPayment: function () {
        this.showPayment = false;

      },
      showConfirmDialog: function (data) {
        this.showConfirm = true;
        this.contextRowData = data;

      },

      confirmOk: function () {
        this.handleGetTableData(); //获取表数据
        this.showConfirm = false;
        this.showPayment = false;
      },
      //表过滤
      handleFilterChg(filters) {
        let _this = this;
        _this.quotationPeriod = "";
        _this.buyerSellerStatus = "";
        for (let index in _this.$refs.tableData.columns) {
          let column = _this.$refs.tableData.columns[index];
          if (!column.filteredValue || column.filteredValue.length == 0) {
            continue;
          }
          if (column.columnKey && column.columnKey == "filter_date") {
            _this.quotationPeriod = column.filteredValue[0];
          }
          else if (column.columnKey && column.columnKey == "filter_tag") {
            _this.buyerSellerStatus = column.filteredValue[0];
          }
        }
        _this.handleGetTableData();
      },

      //tab切换
      handleClick(tab, event) {
        let _this = this;
        _this.$router.push({
          path: 'myTrading',
          query: {
            tradeType: tab.name//1 2 3
          }
        });//根据订单状态显示路由
        _this.quotationPeriod = "";
        _this.buyerSellerStatus = "";
        _this.tradeType = tab.name;
        _this.$refs.tableData.clearFilter();
        _this.handleGetTableData();//获取表数据
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          // url: "/recProduct/listRecOrder",
          url: _this.$store.state.recycleAddr + "/recOrder/listRecOrderByMyself",
          data: {
            companyId: "",
            buyerSellerStatus: _this.buyerSellerStatus,//买卖状态
            quotationPeriod: _this.quotationPeriod,//时间
            tradeType: _this.tradeType,//类型
            pageIndex: _this.page.currentPage, //页数
            pageSize: _this.page.pageSize,//条数
          }
        }).then((res) => {
          _this.page.total = 0;
          _this.tableData = [];
          switch (res.data.status) {
            case 200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case 300:
              _this.tableData = [];
              break;
            case -500:
              _this.tableData = [];
              break;
          }
        })
      },

      //分页事件
      handleSizeChange(val) {
        let _this = this;
        _this.page.pageSize = val;
        _this.handleGetTableData();//获取表数据
      },
      handleCurrentChange(val) {
        let _this = this;
        _this.page.currentPage = val;
        _this.handleGetTableData();//获取表数据
      },

      //显示付款弹框
      handleShowPayment(row) {
        this.showPayment = true;
        this.contextRowData = row;
      },

      //确定付款
      handleSubmitConfirmPayment() {
        let _this = this;
        console.log(_this.paymentForm.quantity);
        console.log(_this.paymentForm.price);
        _this.paymentBtn = true;
        _this.$axios({
          method: "post",
          // url: "/recOrder/orderRealyBuyPay",
          url: _this.$store.state.recycleAddr + "/recOrder/orderRealyBuyPay",
          data: {
            id: _this.id,
            tradeAmount: _this.paymentForm.tradeQuantity * _this.paymentForm.tradePrice,//总额
            tradePrice: _this.paymentForm.tradeQuantity,//数量
            tradeQuantity: _this.paymentForm.tradePrice//单价
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.paymentBtn = false;
            _this.paymentDialogFormVisible = false;
            _this.$message({
              type: 'success',
              message: '付款成功！'
            });
            _this.handleGetTableData();//获取表数据
          }
        })
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
  .recycle-order {
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
      overflow: hidden;
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
      padding-left: 20px;
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
    }
    :hover {
      overflow: visible;
    }
  }
</style>
