<template>
<div class="recycle-order">
    <!--tab切换-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.value" :key="item.id"></el-tab-pane>
    </el-tabs>

    <!--表数据-->
    <el-table :data="tableData" ref="tableData" default-expand-all @filter-change="handleFilterChg" highlight-current-row style="width: 100%">
        <el-table-column type="expand" show-overflow-tooltip=true>
            <template slot-scope="props">
                <el-row id="content">
                    <el-col :span="3">
                        <div class="logo">
                            <img  @click="handleGoToLogisticsDetail(props.row)"  :src="$store.state.outputImgUrl+props.row.productId+'&bizObjName=upload_img'" :alt="'img'+props.row.id" >
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <el-row class="title">
                            <el-col>
                                <span> 【{{props.row.tradeType=='buy'?'求购':props.row.tradeType=='sell'?'出售':''}}】
                                      <div slot="content"  >
                                   {{props.row.productTitle}}
                                        </div>
                               <el-button type="text" class="nowrap4 nowrap-h3" @click="handleGoToLogisticsDetail(props.row)"> {{props.row.productTitle}}
                                   </el-button> 
                                 </span>
                            </el-col>
                        </el-row>
                        <el-row class="address">
                            <el-row>
                                <el-col>
                                    <div slot="content">
                                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                                    </div>
                                    <el-button class="nowrap4 nowrap-h3" @click="handleGoToLogisticsDetail(props.row)" type="text">
                                        {{findConfigItem(props.row.source,$store.state.dictionary.hsly).title}}/
                                        {{findConfigItem(props.row.category,$store.state.dictionary.hszl).title}}/
                                        {{findConfigItem(props.row.subCategory,$store.state.dictionary.hslb).title}}
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col>
                                    <span>最小成交量:{{props.row.minTradeQuantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <span style="white-space:normal; word-break:break-all;">{{makeAddr(props.row.province,props.row.city,props.row.region)}}</span>
                            </el-row>
                        </el-row>
                    </el-col>
                    <el-col :span="3" class="type">
                        <el-row>
                            <span>交易类型:{{props.row.tradeType=='buy'?'求购':props.row.tradeType=='sell'?'出售':''}}</span>
                        </el-row>
                        <el-row>
                            <span>数量：{{ props.row.quantity}}{{findConfigItem(props.row.unit,$store.state.dictionary.unit).title}}</span>
                        </el-row>
                        <el-row>
                            <span>单价：{{!props.row.price || props.row.price==0 ?'面议':'￥'+props.row.price}}</span>
                        </el-row>
                    </el-col>
                    <el-col :span="6" class="enterprise">
                        <span>{{!props.row.enterpriseName?'**':props.row.enterpriseName}}</span>
                    </el-col>
                    <el-col :span="3" class="details">
                        <!--显示商品发布方在当前交易订单上的状态-->
                        <span>{{findConfigItem(props.row.orderStatusForBuyer,$store.state.dictionary.rec_order_status_for_buyer).title}}</span>
                    </el-col>
                    <el-col :span="3" class="operation">
                        <el-button type="text" size="small" @click="handleShowPayment(props.row)" v-show="props.row.orderStatusForBuyer=='wait_pay'">付款
                        </el-button>
                        <el-button type="text" size="small" @click="handleShowOrder(props.row)" v-show="props.row.orderStatusForBuyer=='wait_confirm'">确定订单
                        </el-button>
                        <el-button type="text" size="small" @click="showConfirmDialog(props.row)" v-show="props.row.orderStatusForBuyer=='convey'&&props.row.tradeType=='sell'">交易确认
                        </el-button>
                        <el-button type="text" size="small" @click="handleGoToLogisticsDetail(props.row)">订单详情</el-button>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="日期" prop="tag" width="220" column-key="filter_date" :filter-multiple="false" :filters="[{text: '半年内', value: 180}, {text: '3个月内', value: 90}, {text: '1个月内', value: 30}]">
            <template slot-scope="scope">
                {{dateToStrMinue(scope.row.creationTime)}}
            </template>
        </el-table-column>
        <el-table-column label="交易详情" width="270" prop="">
            <template slot-scope="scope">
                <span>订单编号：{{scope.row.orderSn}}</span>
            </template>
        </el-table-column>
        <el-table-column label="合作企业" width="180" prop="">
        </el-table-column>
        <el-table-column label="订单状态" width="130" column-key="filter_tag" :filter-multiple="false" :filters="$store.state.dictionary.rec_order_status_for_buyer" prop="tag">
        </el-table-column>
        <el-table-column label="操作" prop="">
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
    </el-pagination>

</div>
</template>

<script>
export default {
    data() {
        return {
            activeName: "", //默认选中第一个标签页  --1
            tabs: [ //tabs数据（标签页属性名称）
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "buy",
                    label: "购买"
                },
                {
                    value: "sell",
                    label: "出售"
                },

            ],
            //分页
            page: {
                pageSize: 10, //每页条数
                total: 0, //总数
                currentPage: 1, //当前页
            },
        }
    },
    components: {},
    created: function () {
        this.handleGetTableData();    //获取表数据
    },
    methods: {
        //表格筛选
        handleFilterChg: function () {
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
                } else if (column.columnKey && column.columnKey == "filter_tag") {
                    _this.buyerSellerStatus = column.filteredValue[0];
                }
            }
            _this.handleGetTableData();
        },
        //查看订单详情
        handleGoToLogisticsDetail: function () {
            let _this = this
            _this.$push({
                path: 'recBillStatus',
                query: {
                    id: row.id,
                    otherId: "2"
                }
            })
        },
        //显示付款弹框
        handleShowPayment: function (row) {
            this.showPayment = true;
            this.contextRowData = row;
        },
        //显示确认定安弹框
        handleShowOrder: function (row) {
            this.contextRowData = row;
            this.showConfirmOrder = true;

        },
        //显示确认订单信息弹框
        showConfirmDialog: function (row) {
            this.showConfirm = true;
            this.contextRowData = row;

        },

        //tab切换事件
        handleClick: function (tab, event) {
            let _this = this;
            //根据订单状态显示路由
            _this.$router.push({
                path: 'recycleOrder',
                query: {
                    tradeType: tab.name //“”  sell  buy
                }
            });
            _this.quotationPeriod = ""; //时间
            _this.buyerSellerStatus = ""; //买卖状态
            _this.tradeType = tab.name;
            _this.$refs.tableData.clearFilter();
            _this.handleGetTableData(); //获取表数据
        },
        //获取表数据
        handleGetTableData: function () {
            let _this = this;
            _this.$axios({
                method: "post",
                url: _this.$store.state.recycleAddr + "/recOrder/listRecOrder",
                data: {
                    buyerSellerStatus: _this.buyerSellerStatus, //买卖状态
                    quotationPeriod: _this.quotationPeriod, //时间
                    tradeType: _this.tradeType, //类型
                    pageIndex: _this.page.currentPage, //页数
                    pageSize: _this.page.pageSize, //条数
                }
            }).then((res) => {
                _this.page.total = 0;
                _this.tableData = [];
                if (res.data.status == 200) {
                    _this.page.total = res.data.data.total;
                    _this.tableData = res.data.data.list;
                } else {
                    _this.tableData = [];
                }
            })
        },
        //改变每页条数执行事件
        handleSizeChange: function (val) {
            this.page.pageSize = val
            this.handleGetTableData()
        },
        //改变页数执行事件
        handleCurrentChange: function (val) {
            this.page.currentPage = val
            this.handleGetTableData()
        },
    }

}
</script>
