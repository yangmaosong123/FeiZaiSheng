<template>
<div class="recoverable-list">
    <div class="main">
        <el-row>
            <el-col :span="24">
                <el-card class="box-card" v-for="item in cards1" :key="item.id" style=" width: 1150px !important;">
                    <div class="text item">
                        <el-row class="content">
                            <el-col :span="24">
                                <el-row>
                                    <el-col :span="5">
                                        <img
                                        @click="handleGoToDetail(item)"
                                        :src="$store.state.outputImgUrl+item.id+'&bizObjName=upload_img'"
                                        :alt="item.id">
                                    </el-col>
                                        <el-col :span="8" class="productname">
                                            <h3 @click="handleGoToDetail(item)">
                                                [{{item.tradeType=='sell'?'出售':item.tradeType=='buy'?'求购':''}}]{{item.productTitle}}
                                            </h3>
                                            <p>供货地址：{{makeAddr(item.province,item.city,item.region)}}</p>
                                            <p>供应总量：{{item.quantity}}{{findConfigItem(item.unit,$store.state.dictionary.unit).title}}</p>
                                            <p>发布日期：{{dateToStrMinue(item.creationTime)}}</p>
                                        </el-col>
                                        <el-col :span="5" class="enterprisename">
                                            <h3 class="title">{{item.enterpriseName}}</h3>
                                            <el-badge value="优质企业" class="item"></el-badge>
                                        </el-col>
                                        <el-col :span="6" class="transactionprice">
                                            <span>交易价格：{{!item.price||item.price=='0.00'?'面议':'￥'+item.price}}</span>
                                            <el-button type="text" @click="handleGoToDetail(item)">查看详情</el-button>
                                        </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 分页 -->
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            cards1: [],
              total: '',//总交易个数
            page: { //分页
                total: 0, //总数
                currentPage: 1, //当前页
                pageSize: 10, //每页条数
            },
        }
    },
    created: function () {
        let _this = this;
        _this.handleGetMoreDataOther(); //获取企业数据
    },
    watch: {
        '$store.state.searchKey': function () {
            let _this = this;
            _this.handleGetMoreDataOther(); //获取更多企业数据

        }
    },
    methods: {
        //跳去详情页
        handleGoToDetail: function (item) {
            let _this = this;
            _this.$router.push({
                    path: '/sellAndBuyDetail',
                    query: {
                        id: item.id,
                        tradeType: item.tradeType,
                        companyId: item.companyId
                    }
                }

            )
        },
        //分页事件
        handleSizeChange(val) {
            let _this = this;
            _this.page.pageSize = val;
            _this.handleGetMoreDataOther(); //获取企业数据
        },
        handleCurrentChange(val) {
            let _this = this;
            _this.page.currentPage = val;
            _this.handleGetMoreDataOther(); //获取企业数据
        },

        handleGetMoreDataOther() {
            let _this = this;
            _this.$axios({
                method: "post",
                url: _this.$store.state.recycleAddr + "/recProduct/indexRecyclList",
                data: {
                    category: "bx", //种类状态     (后端默认固定的)
                    source: "", //行业              (后端默认固定的)
                    tradeType: "不限", //发布种类     (后端默认固定的)
                    searchKey: _this.$store.state.searchKey,
                    pageIndex: _this.page.currentPage,
                    pageSize: _this.page.pageSize
                }
            }).then((res) => {
                if (res.data.status !== 200) {
                    _this.page.total = 0;
                    _this.cards1 = [];
                    _this.total = 0;
                } else {
                    _this.page.total = res.data.data.total;
                    _this.cards1 = res.data.data.list;
                    _this.total = res.data.data.total;
                }
            });
        },
    }

}
</script>
