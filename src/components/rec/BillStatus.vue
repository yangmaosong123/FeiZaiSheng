<template>
<div class="logistics-detail">
    <CommonTitle title="订单详情"></CommonTitle>
    <GoBack class="go-back"></GoBack>
    <!-- 返回 -->

    <!-- 物流详情 -->
    <div>
        <el-row class="top">
            <el-col :span="6" class="order-number">
                <h3>订单号：{{detail.orderSn}}</h3>
                <!--<p>完成</p>-->
                <!--<el-button type="primary">评价</el-button>-->
            </el-col>
            <el-col :span="18" class="step">

                <el-steps :space="200" :active="recycleActive" finish-status="success">
                    <el-step :title="items" v-for="(items,indexs) in recycleSteps" :key="indexs"></el-step>
                </el-steps>

            </el-col>
        </el-row>
    </div>

    <!-- 信息列表 -->
    <div>
        <el-row class="nav">
            <el-col :span="8" class="Collectgoods">
                <h3>收货人信息：</h3>
                <template v-if='detail.daType=="buy"'>
                    <p>联系人：{{detail.contactsWaste}}</p>
                    <p>电话：{{detail.phoneWaste}}/{{detail.fixedLineWaste}}</p>
                    <p>邮箱：{{detail.emailWaste}}</p>
                    <p>地址：{{makeAddr(detail.provinceWaste,detail.cityWaste,detail.regionWaste)+detail.addressWaste}}</p>
                </template>
                <template v-else>
                    <p>联系人：{{detail.contacts}}</p>
                    <p>电话：{{detail.phone}}/{{detail.fixedLine}}</p>
                    <p>邮箱：{{detail.email}}</p>
                    <p>地址：{{makeAddr(detail.province,detail.city,detail.region)+detail.address}}</p>
                </template>

            </el-col>
            <el-col :span="15" class="distribution">
                <h3>订单信息：</h3>

                <el-col :span="12">

                    <p>订单号：{{detail.orderSn}}</p>
                    <p>数量：{{detail.number}}{{findConfigItem(detail.unit,$store.state.dictionary.unit).title}}</p>
                    <p>单价：{{!detail.publishPrice||detail.publishPrice=='0.00'?'面议':'￥'+detail.publishPrice}}</p>
                </el-col>
                <el-col :span="12">
                    <p>时间：{{detail.createtime}}</p>
                    <p>地址：{{makeAddr(detail.provinceWaste,detail.cityWaste,detail.regionWaste)+detail.addressWaste}}</p>
                    <p>种类：{{findConfigItem(detail.category,$store.state.dictionary.hszl).title}}/{{findConfigItem(detail.subCategory,$store.state.dictionary.hslb).title}}</p>
                    <p>来源：{{findConfigItem(detail.source,$store.state.dictionary.hsly).title}}</p>
                </el-col>
            </el-col>

        </el-row>
    </div>

    <!-- 表格-->
    <el-table class="bottom" :data="tableData" border style="width: 100%">
        <el-table-column label="商品" width="350">
            <tempalte slot-scope="scope">
                <img :src="$store.state.outputImgUrl+scope.row.productId+'&bizObjName=upload_img'">
                <el-tooltip placement="right-start" effect="light">
                    <div slot="content">
                        {{scope.row.productTitle}}
                    </div>
                    <el-button class="nowrap" type="text">
                        {{scope.row.productTitle}}
                    </el-button>
                </el-tooltip>

            </tempalte>
        </el-table-column>
        <el-table-column prop="productSn" label="商品编号">
        </el-table-column>
        <el-table-column prop="province" label="交易单价" width="150">
            <tempalte slot-scope="scope">
                <span v-if="tradeFlag">￥{{scope.row.price}}</span>
            </tempalte>
        </el-table-column>
        <el-table-column prop="city" label="数量" width="100">
            <tempalte slot-scope="scope">
                <span>{{scope.row.number}}{{findConfigItem(scope.row.unit,$store.state.dictionary.unit).title}}</span>
            </tempalte>
        </el-table-column>
    </el-table>

    <template v-if="tradeFlag">
        <div class="price" v-for="item in tableData" :key="item.id">
            <h3>付款信息：</h3>
            <p>商品总价：￥<span>{{item.offerTotal}}</span></p>
            <p>应付总额：￥<span>{{item.offerTotal}}</span></p>
        </div>
    </template>

</div>
</template>

<script>
import CommonTitle from '@/components/common/commonTitle'
import GoBack from '@/components/common/goBack'

export default {
    name: 'logisticsDetails', //物流信息
    data() {
        return {
            tableData: [],
            recycleActive: "", //回收步骤
            recycleSteps: [], //步骤
            detail: {}, //订单编号        
            consignee: {},
            tradeFlag: false,
        };
    },
    components: {
        CommonTitle, //公共标题
        GoBack //返回
    },
    created() {
        this.handleGetLogisticsInfo(); //获取物流信息数据
    },
    methods: {
        //获取物流信息数据
        handleGetLogisticsInfo() {
            let _this = this;
            this.$axios({
                method: "post",
                url: "/order/receiptOrIstribution",
                // url: "recProduct/list",
                data: {
                    id: _this.$route.query.id,
                    otherId: "2"
                }
            }).then((res) => {
                switch (res.data.status) {
                    case 200:
                        _this.detail = res.data.data;
                        this.tableData.push(res.data.data);
                        if (_this.detail.orderBuyState == "canceled") {
                            _this.recycleActive = 2;
                            _this.recycleSteps = ['待确定', '取消'];
                            return;
                        }
                        this.recycleSteps = ['待确定', '运输中'];
                        //_this.detail.companyId=610;
                        //_this.detail.orderStatusForBuyer="wait_buy_pay";
                        //_this.detail.tradeType="sell";
                        //判断当前用户是否发布方
                        if (_this.detail.companyId == _this.$store.state.accountObj.companyId) {
                            if (_this.detail.daType == "buy") {
                                _this.recycleSteps.push('待付款');
                            } else {
                                _this.recycleSteps.push('待买家付款');
                            }
                            _this.recycleSteps.push('完成');
                            _this.recycleActive = 1 + _this.recycleSteps.indexOf(_this.findConfigItem(_this.detail.orderBuyState, _this.$store.state.dictionary.rec_order_status_for_buyer).title);
                        } else {
                            if (_this.detail.daType == "buy") {
                                _this.recycleSteps.push('待买家付款');
                            } else {
                                _this.recycleSteps.push('待付款');
                            }
                            _this.recycleSteps.push('完成');
                            _this.recycleActive = 1 + _this.recycleSteps.indexOf(this.findConfigItem(_this.detail.orderSellState, _this.$store.state.dictionary.order_status_for_seller).title);
                        }
                        this.tradeFlag = true;
                        var sz = ["wait_confirm", "convey"]
                        if (sz.indexOf(_this.detail.orderBuyState) >= 0) {
                            this.tradeFlag = false;
                        }

                        break;
                    case 300:
                        _this.$message({
                            type: 'warning',
                            message: res.data.text
                        });
                        break;
                    case -500:
                        break;
                }
            });
        },
    }
};
</script>

<style lang="less" scoped>
.logistics-detail {
    position: relative;
    .go-back {
        position: absolute;
        top: 10px;
        right: 12px;
    }
    .top {
        border-top: 3px solid #ea8329;
        border-bottom: 1px solid #d6d6d6;
    }
    .order-number {
        //  background: #f7f7f7;
        text-align: center;
        h3 {
            font-size: 14px;
            margin-top: 50px;
        }
        p {
            font-size: 18px;
            color: #009900;
            font-weight: bold;
        }
    }
    .step {
        margin-top: 50px;
    }
    .nav {
        // border-top: 2px solid #ea8329;
        padding: 20px 0 20px 0;
        .Collectgoods {
            background: #f7f7f7;
            border: 1px solid #d6d6d6;
            padding: 10px;
            margin-left: 15px;
        }
        .distribution {
            background: #f7f7f7;
            border: 1px solid #d6d6d6;
            padding: 10px 10px 0 10px;
            margin-left: 15px;
        }
        h3 {
            font-size: 14px; // color: #333;
        }
        p {
            line-height: 12px;
            font-size: 12px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .bottom {
        border-top: 2px solid #cacaca;
        img {
            width: 120px;
            height: 60px;
        }
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .price {
        font-size: 14px;
        height: 130px;
        color: #208dd6;
        border: 1px solid #5bb1e4;
        padding: 10px 30px 0px 30px;
        margin: 20px 30px;
        float: right;
        span {
            font-weight: bold;
        }
    }
}
</style>
