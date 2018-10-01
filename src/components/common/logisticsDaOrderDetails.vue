<template>
  <div class="logistics-detail">
    <CommonTitle title="订单详情"></CommonTitle>
    <GoBack class="go-back"></GoBack><!-- 返回 -->

    <!-- 物流详情 -->
    <div>
      <el-row class="top">
        <el-col :span="6" class="order-number">
          <h3>订单号：{{detail.orderSn}}</h3>
          <!--<p>完成</p>-->
          <!--<el-button type="primary">评价</el-button>-->
        </el-col>
        <el-col :span="18" class="step">

          <!-- 步骤条 -->
          <el-steps :space="200" :active="active" finish-status="success" v-show="this.$route.query.otherId=='1'">
            <el-step :title="item" v-for="(item,index) in hazardousSteps" :key="index"></el-step>
          </el-steps>

          <el-steps :space="200" :active="recycleActive" finish-status="success"
                    v-show="this.$route.query.otherId=='2'">
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
          <p>联系人：{{consignee.contacts}}</p>
          <p>电话：{{consignee.phone}}/{{consignee.fixedLine}}</p>
          <p>邮箱：{{consignee.email}}</p>
          <p>地址：{{consignee.province+consignee.city+consignee.region+consignee.address}}</p>
        </el-col>
        <el-col :span="15" class="distribution">
          <h3>订单信息：</h3>

          <el-col :span="12">
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                订单名称：{{consignee.daName}}
              </div>
              <el-button class="nowrap-detail"
                         type="text"
                         @click="handleGoToLogisticsDetail(props.row)">
                订单名称：{{consignee.daName}}
              </el-button>
            </el-tooltip>
            <p>订单号：{{consignee.orderSn}}</p>
            <p>数量：{{consignee.number}}{{findConfigItem(consignee.unit,$store.state.dictionary.unit).title}}</p>
            <p>单价：{{!consignee.price||consignee.price=='0.00'?'面议':'￥'+consignee.price}}</p>
          </el-col>
          <el-col :span="12">
            <p>时间：{{consignee.createtime}}</p>
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                地址：{{consignee.provinceWaste+consignee.cityWaste+consignee.regionWaste+consignee.addressWaste}}
              </div>
              <el-button class="nowrap-detail"
                         type="text"
                         @click="handleGoToLogisticsDetail(props.row)">
                地址：{{consignee.provinceWaste+consignee.cityWaste+consignee.regionWaste+consignee.addressWaste}}
              </el-button>
            </el-tooltip>
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                种类：{{consignee.daCategory+'/'+consignee.daCode}}
              </div>
              <el-button class="nowrap-detail"
                         type="text"
                         @click="handleGoToLogisticsDetail(props.row)">
                种类：{{consignee.daCategory+'/'+consignee.daCode}}
              </el-button>
            </el-tooltip>
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                来源：{{findConfigItem(consignee.industrySource,$store.state.dictionary.hyly).title}}{{consignee.dangerousWasteSource=='0'?'':'/'+consignee.dangerousWasteSource}}
              </div>
              <el-button class="nowrap-detail"
                         type="text"
                         @click="handleGoToLogisticsDetail(props.row)">
                来源：{{findConfigItem(consignee.industrySource,$store.state.dictionary.hyly).title}}{{consignee.dangerousWasteSource=='0'?'':'/'+consignee.dangerousWasteSource}}
              </el-button>
            </el-tooltip>
          </el-col>
        </el-col>


      </el-row>
    </div>

    <!-- 表格-->
    <el-table class="bottom"
              :data="tableData"
              border
              style="width: 100%">
      <el-table-column
        width="145">
        <tempalte slot-scope="scope">
          <img
            :src="$store.state.outputImgUrl+scope.row.id+'&bizObjName=prod_img'"
            :alt="'img'+scope.row.id">
        </tempalte>
      </el-table-column>
      <el-table-column
        label="商品描述"
        width="410">
        <tempalte slot-scope="scope">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">
              {{scope.row.remark}}
            </div>
            <el-button class="nowrap-detail"
                       type="text"
                       @click="handleGoToLogisticsDetail(props.row)">
              {{scope.row.remark}}
            </el-button>
          </el-tooltip>
        </tempalte>
      </el-table-column>
      <el-table-column
        prop="productSn"
        label="商品编号">
      </el-table-column>
      <el-table-column
        prop="province"
        label="交易单价"
        width="150">
        <tempalte slot-scope="scope">
          <span>￥{{scope.row.offerTotal}}</span>
        </tempalte>
      </el-table-column>
      <el-table-column
        prop="city"
        label="数量"
        width="100">
        <tempalte slot-scope="scope">
          <span>{{scope.row.number}}{{findConfigItem(scope.row.unit,$store.state.dictionary.unit).title}}</span>
        </tempalte>
      </el-table-column>
    </el-table>


    <div class="price" v-for="item in tableData" :key="item.id">
      <h3>付款信息：</h3>
      <p>商品总价：￥<span>{{(item.number*item.offerTotal).toFixed(2)}}</span></p>
      <p>应付总额：￥<span>{{(item.number*item.offerTotal).toFixed(2)}}</span></p>
    </div>


  </div>
</template>
<script>
  import CommonTitle from '../common/commonTitle'
  import GoBack from './goBack'

  export default {
    name: 'logisticsDetails',//物流信息
    data() {
      return {
        active: '',//危废步骤
        hazardousSteps: ['提交订单', '确认订单', '签约', '付款', '运输中', '确认收货', '订单完成'],//步骤
        recycleActive: "",//回收步骤
        recycleSteps: ['待确定', '运输中', '待付款', '完成', '取消', '待买家付款'],//步骤
        detail: {},//订单编号
        consignee: {},//收货人
        tableData: [],//表数据
      };
    },
    components: {
      CommonTitle,//公共标题
      GoBack//返回
    },
    created() {
      let _this = this;
      _this.handleGetRoutingDictionary(); //路由词典
      _this.handleGetLogisticsInfo();  //获取物流信息数据
      _this.handleGetConsigneeInfo();   //获取收货人信息数据
      _this.handleGetConsigneeInfoTable();  //获取表数据

    },
    methods: {

      //路由词典
      handleGetRoutingDictionary() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findOneType",
          data: {
            moduleCode: "sshy"
          }
        }).then(res => {
          // _this.sourceOptions = res.data.data.hsly;
          // _this.tradeTypeOptions = res.data.data.hszl;
        })
      },

      //获取物流信息数据
      handleGetLogisticsInfo() {
        let _this = this;
        if (_this.$route.query.otherId == '1')
          _this.$axios({
            method: "post",
            url: "/order/OrderProcess",
            // url: "recProduct/list",
            data: {
              id: _this.$route.query.id,
              otherId: "1"
            }
          }).then((res) => {
            if (res.data.status == 200) switch (res.data.status) {
              case 200:
                _this.detail = res.data.data;

                if (res.data.data.selected == 'N') _this.active = 1;

                if (res.data.data.selected == 'Y') _this.active = 2;

                if ((res.data.data.orderState = '4' && res.data.data.disposalOrderState == '5') ||
                  (res.data.data.orderState = '6' && res.data.data.disposalOrderState == '6')) _this.active = 3;

                if ((res.data.data.orderState = '8' && res.data.data.disposalOrderState == '9') ||
                  (res.data.data.orderState = '11' && res.data.data.disposalOrderState == '7')) _this.active = 4;

                if (res.data.data.orderState > '8' && res.data.data.orderState < '11') _this.active = 5;

                if ((res.data.data.orderState = '13' && res.data.data.disposalOrderState == '10') ||
                  (res.data.data.orderState = '12' && res.data.data.disposalOrderState == '8')) _this.active = 6;

                if (res.data.data.orderState = '4' && res.data.data.disposalOrderState == '12') _this.active = 7;

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
        else _this.$axios({
          method: "post",
          url: "/order/OrderProcess",
          // url: "recProduct/list",
          data: {
            id: _this.$route.query.id,
            otherId: "2"
          }
        }).then((res) => {
          if (res.data.status == 200)
            switch (res.data.status) {
              case 200:
                _this.detail = res.data.data;

                if (res.data.data.orderState == 'wait_confirm') _this.recycleActive = 1;

                if (res.data.data.orderState == 'convey') _this.recycleActive = 2;

                if (res.data.data.orderState == 'wait_pay') _this.recycleActive = 3;

                if (res.data.data.orderState == 'finished') _this.recycleActive = 4;

                if (res.data.data.orderState == 'canceled') _this.recycleActive = 5;

                if (res.data.data.orderState == 'wait_buy_pay') _this.recycleActive = 6;
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

      /*查找配置项的位置*/
      findStepIndex: function (dictionary, itemCode) {
        for (var i = 0; i < dictionary.length; i++) {
          if (dictionary[i].itemCode == itemCode) {
            return i + 1;
          }
        }
        return -1;
      },

      //获取收货人信息数据
      handleGetConsigneeInfo() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/receiptOrIstribution",
          // url: "recProduct/list",
          data: {
            id: _this.$route.query.id,
            otherId: _this.$route.query.otherId
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.consignee = res.data.data;
              break;
          }
        })
      },

      //获取表数据
      handleGetConsigneeInfoTable() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/productShow",
          data: {
            id: _this.$route.query.id,
            otherId: _this.$route.query.otherId
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.tableData = res.data.data;
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

      //收藏企业
      // handleCollectionEnterprise(companyId) {
      //   let _this = this;
      //   _this.$confirm('确定收藏该企业吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     _this.$axios({
      //       method: "post",
      //       url: "/base/enterpriseCollection",
      //       data: {
      //         id: companyId//当前企业id
      //       }
      //     }).then((res) => {
      //       switch (res.data.status) {
      //         case  200:
      //           _this.$message({
      //             type: 'success',
      //             message: '成功收藏该企业!'
      //           });
      //           _this.handleGetConsigneeInfoTable();
      //           break;
      //       }
      //     });
      //   }).catch(() => {
      //     _this.$message({
      //       type: 'info',
      //       message: '已取消收藏'
      //     });
      //   });
      // },

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
        height: 180px;
        background: #f7f7f7;
        border: 1px solid #d6d6d6;
        padding: 10px 10px 0 10px;
        margin-left: 15px;
      }

      h3 {
        font-size: 14px;
        // color: #333;
      }
      p {
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
