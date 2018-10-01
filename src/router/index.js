import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

Vue.use(Router);

// 引入组件
import Main from '../components/main.vue'
import user from '../components/user/user.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
import forgetPassword from "../components/forgetPassword.vue";

//顶部导航
import MarketCenter from '../components/common/market/marketCenter'
import InformationRecommendation from '../components/informationRecommendation/informationRecommendation'
import InformationDetail from '../components/informationRecommendation/components/informationDetail'
import IconsDetail from '../components/common/icons/iconsDetail'
import TradingCenter from '../components/tradingCenter/tradingCenter'
import CompaniesToRecommend from '../components/common/companiesToRecommend/companiesToRecommend'
import Repository from '../components/common/repository/repository'
import MoreCompanies from '../components/common/companiesToRecommend/moreCompanies'
import wasteRubbishList from '../components/common/leftNav/components/wasteRubbishList'
import RecoverableList from '../components/common/leftNav/components/recoverableList'
//import RecoverableList from '../components/common/leftNav/components/recoverableList2'
import ClickToEnter from '../components/common/companiesToRecommend/clickToEnter'
import ChargingStandards from '../components/common/chargingStandards'
import CompanyIntroduction from '../components/common/aboutUs/companyIntroduction'
import JoinUs from '../components/common/aboutUs/joinUs'
import CommonProblem from '../components/common/aboutUs/commonProblem'
import MyTrading from '../components/myTrading/myTrading'

import NoticeOfTheSystem from '../components/common/myInform/noticeOfTheSystem'
import NoticeOfTheSystemDetail from '../components/common/myInform/noticeOfTheSystemDetail'
import basicMsg from '../components/user/basicMsg.vue'
import detailedMsg from '../components/user/detailedMsg.vue'
import AddressMessage from '../components/common/addressMessage'
import EnterpriseCollection from '../components/common/myCollect/enterpriseCollection'
import DealCollection from '../components/common/myCollect/dealCollection'

import OrderCommonAttack from '../components/wasteProductionEnterprise/orderCommonAttack';
import OrderProcessing from '../components/disposalOfEnterprise/orderProcessing'
// import WasteProductionEnterprise from '../components/wasteProductionEnterprise/wasteProductionEnterprise';
import DisposalTransactionDetail from '../components/disposalOfEnterprise/disposalTransactionDetail';
import ViewDisposalResults from '../components/wasteProductionEnterprise/viewDisposalResults';
import WasteTransactionDetail from '../components/wasteProductionEnterprise/wasteTransactionDetail'
import DisposalOfEnterprise from '../components/wasteProductionEnterprise/disposalOfEnterprise';
// import RecoveryOfTheOrder from '../components/wasteProductionEnterprise/recoveryOfTheOrder';
import TheSystemRecommended from '../components/disposalOfEnterprise/theSystemRecommended'
import theOfferSystemRecommended from '../components/wasteProductionEnterprise/theOfferSystemRecommended'
import ContractDisposalOfEnterprise from '../components/wasteProductionEnterprise/contractDisposalOfEnterprise'
import ContractWasteProductionEnterprise from '../components/disposalOfEnterprise/contractWasteProductionEnterprise'
import WasteOrderDetail from '../components/wasteProductionEnterprise/wasteOrderDetail'
import DisposalOrderDetail from '../components/disposalOfEnterprise/disposalOrderDetail'
// import ActionWasteDisposal from '../components/wasteProductionEnterprise/actionResults'

//商品
import WasteList from '../components/commodity/wasteList'
import CommodityList from '../components/commodity/commodityList'
//import SellAndBuyDetail from '../components/commodity/components/sellAndBuyDetail'  //购买出售详情
import SellAndBuyDetail from '@/components/commodity/components/sellAndBuyDetail2'
import WasteDetail from '../components/commodity/components/wasteDetail'

//合作伙伴
import Partner from '../components/partner/partner'

//物流信息
import LogisticsDetails from '../components/common/logisticsDetails'
import LogisticsDaOrderDetails from '../components/common/logisticsDaOrderDetails'


//行情
import MarketCenterMore from '../components/common/market/components/marketCenterMore'
import MarketCenterDetails from '../components/common/market/components/marketCenterDetails'

//回收订单
import RecycleOrder from '../components/orderControl/recycleOrder'

import RecBillStatus from '@/components/rec/BillStatus'


Vue.prototype.__routes = [
  {
    path: '/',
    component: App,
    desc: "首页",
    children: [
      {
        path: "/",
        component: Main,
        desc: "首页",
      },
      {
        path: '/Main',
        name: 'Main',
        component: Main,
        desc: "首页",
      },


      {
        path: '/login',
        name: 'login',
        component: login,
        desc: "登录",
      },
      {
        path: '/register',
        name: 'register',
        component: register,
        desc: "注册",
      },
      {
        path: '/forgetPassword',
        name: 'forgetPassword',
        component: forgetPassword,
        desc: "忘记密码",
      },
      {
        path: '/marketCenter',
        name: 'marketCenter',
        component: MarketCenter,//行情中心
        desc: "行情中心",
      },
      {
        path: '/marketCenterMore',
        name: 'marketCenterMore',
        component: MarketCenterMore,//行情更多
      },
      {
        path: '/marketCenterDetails',
        name: 'marketCenterDetails',
        component: MarketCenterDetails,//行情详情
        desc: "行情详情",
      },
      {
        path: '/sellAndBuyDetail',
        name: 'sellAndBuyDetail',
        component: SellAndBuyDetail, //出售--求购详情
        desc: "出售求购详情",
      },
      {
        path: '/wasteDetail',
        name: 'wasteDetail',
        component: WasteDetail, //出售--危废详情
        desc: "危废详情",
      },
      {
        path: '/informationRecommendation',
        name: 'informationRecommendation',
        component: InformationRecommendation,//资讯
      },
      {
        path: '/informationDetail',
        name: 'informationDetail',
        component: InformationDetail,//资讯详情
        desc: "资讯详情",
      },
      {
        path: '/tradingCenter',
        name: 'tradingCenter',
        component: TradingCenter,//交易中心
        desc: "交易中心",
      },
      {
        path: '/companiesToRecommend',
        name: 'companiesToRecommend',
        component: CompaniesToRecommend,//企业推荐
        desc: "企业推荐",
      },
      {
        path: '/repository',
        name: 'repository',
        component: Repository,//企业推荐
        desc: "知识库",
      },
      {
        path: '/moreCompanies',
        name: 'moreCompanies',
        component: MoreCompanies,//更多企业推荐
        desc: "更多企业推荐",
      },
      {
        path: '/iconsDetail',
        name: 'iconsDetail',
        component: IconsDetail,//流程详情
        desc: "流程详情",
      },
      {
        path: '/wasteRubbishList',
        name: 'wasteRubbishList',
        component: wasteRubbishList,//危废列表
        desc: "危废列表",
      },
      {
        path: '/recoverableList',
        name: 'recoverableList',
        component: RecoverableList,//可回收产品列表
        desc: "可回收产品列表",
      },
      {
        path: '/clickToEnter',
        name: 'clickToEnter',
        component: ClickToEnter,//点击进入当前企业详情
        desc: "当前企业详情",
      },
      {
        path: '/chargingStandards',
        name: 'chargingStandards',
        component: ChargingStandards,//知识库
        desc: "知识库",
      },
      {
        path: '/companyIntroduction',
        name: 'companyIntroduction',
        component: CompanyIntroduction,//公司介绍
        desc: "公司介绍",
      },
      {
        path: '/joinUs',
        name: 'joinUs',
        component: JoinUs,//加入我们
        desc: "加入我们",
      },
      {
        path: '/commonProblem',
        name: 'commonProblem',
        component: CommonProblem,//常见问题
        desc: "常见问题",
      },
      {
        path: '/user',
        name: 'user',
        component: user,
        children: [
          //基本信息
          {
            path: 'noticeOfTheSystem',
            name: 'noticeOfTheSystem',
            component: NoticeOfTheSystem, //系统通知
            desc: "系统通知",
          },
          {
            path: 'noticeOfTheSystemDetail',
            name: 'noticeOfTheSystemDetail',
            component: NoticeOfTheSystemDetail, //系统通知详情
            desc: "系统通知详情",
          },
          {
            path: 'basicMsg',
            name: 'basicMsg',
            component: basicMsg, //企业基本信息
            desc: "企业基本信息",
          },
          {
            path: 'detailedMsg',
            name: 'detailedMsg',
            component: detailedMsg,//企业详情
            desc: "企业commodityList" +
            "详情",
          },
          {
            path: 'addressMessage',
            name: 'addressMessage',
            component: AddressMessage, //地址信息
            desc: "地址信息",
          },
          {
            path: 'enterpriseCollection',
            name: 'enterpriseCollection',
            component: EnterpriseCollection, //企业收藏
            desc: "企业收藏",
          },
          {
            path: 'dealCollection',
            name: 'dealCollection',
            component: DealCollection, //交易收藏
            desc: "交易收藏",
          },
          {
            path: 'myTrading',
            name: 'myTrading',
            component: MyTrading //交易收藏
          },
          //产废企业
          {
            path: 'orderCommonAttack',
            name: 'orderCommonAttack',
            component: OrderCommonAttack, //产废企业--订单管理
            desc: "产废企业订单管理",
          },
          {
            path: 'logisticsDetails',
            name: 'logisticsDetails',
            component: LogisticsDetails, //产废+处置--物流信息
            desc: "物流信息",
          },
          {
            path: 'logisticsDaOrderDetails',
            name: 'logisticsDaOrderDetails',
            component: LogisticsDaOrderDetails, //产废+处置--物流信息
            desc: "物流信息",
          },

          {
            path: 'recBillStatus',
            name: 'recBillStatus',
            component: RecBillStatus,
            desc: "可回收单据详情",
          },


          {
            path: 'contractDisposalOfEnterprise',
            name: 'contractDisposalOfEnterprise',
            component: ContractDisposalOfEnterprise, //产废企业--我的合同
            desc: "产废企业我的合同",
          },
          {
            path: 'theOfferSystemRecommended',
            name: 'theOfferSystemRecommended',
            component: theOfferSystemRecommended, //产废_报价管理_合作
            desc: "产废报价管理合作",
          },
          // {
          //   path: 'wasteProductionEnterprise',
          //   name: 'wasteProductionEnterprise',
          //   component: WasteProductionEnterprise //产废企业--订单处理
          // },
          {
            path: 'wasteTransactionDetail',
            name: 'wasteTransactionDetail',
            component: WasteTransactionDetail, //产废企业--交易明细
            desc: "产废企业交易明细",
          },

          {
            path: 'wasteTransactionDetail',
            name: 'wasteTransactionDetail',
            component: WasteTransactionDetail //产废企业-->交易明细
          },
          {
            path: 'wasteOrderDetail',
            name: 'wasteOrderDetail',
            component: WasteOrderDetail, //产废企业-->订单详情
            desc: "产废企业订单详情",
          },
          {
            path: 'viewDisposalResults',
            name: 'viewDisposalResults',
            component: ViewDisposalResults, //产废企业-->处置结果
            desc: "产废企业处置结果",
          },

          //处置企业
          {
            path: 'orderProcessing',
            name: 'orderProcessing',
            component: OrderProcessing, //处置企业--订单处理
            desc: "处置企业订单处理",
          },
          {
            path: 'disposalTransactionDetail',
            name: 'disposalTransactionDetail',
            component: DisposalTransactionDetail,//处置企业-->交易明细
            desc: "处置企业交易明细",
          },
          {
            path: 'disposalOrderDetail',
            name: 'disposalOrderDetail',
            component: DisposalOrderDetail,//处置企-->订单详情
            desc: "处置企订单详情",
          },
          {
            path: 'theSystemRecommended',
            name: 'theSystemRecommended',
            component: TheSystemRecommended, //处置企业--系统推荐
            desc: "处置企业系统推荐",
          },
          {
            path: 'contractWasteProductionEnterprise',
            name: 'contractWasteProductionEnterprise',
            component: ContractWasteProductionEnterprise, //处置企业--我的合同
            desc: "处置企业我的合同",
          },
          // {
          //   path: 'actionWasteDisposal',
          //   name: 'actionWasteDisposal',
          //   component: ActionWasteDisposal //处置企业--处置结果
          // },
          {
            path: 'disposalOfEnterprise',
            name: 'disposalOfEnterprise',
            component: DisposalOfEnterprise, //处置企业
            desc: "处置企业管理",
          },//目前不知道是啥

          //商品
          {
            path: 'wasteList',
            name: 'wasteList',
            component: WasteList, //危废管理
            desc: "可回收商品管理",
          },
          {
            path: 'commodityList',
            name: 'commodityList',
            component: CommodityList, //处置企业
            desc: "可回收商品管理",
          },
          //商品
          {
            path: 'partner',
            name: 'partner',
            component: Partner, //处置企业
            desc: "合作企业",
          },
          //订单
          {
            path: 'recycleOrder',
            name: 'recycleOrder',
            component: RecycleOrder, //处置企业
            desc: "可回收订单管理",
          },
        ]
      },
    ]
  }
];

export default new Router({
  routes: Vue.prototype.__routes
})
