// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './assets/css/common.css'
import './assets/css/index.css'
import store from './store/index'
import 'babel-polyfill'
import {
  findConfigItem,
  loadProvince,
  dateToStr,
  loadDictionary,
  dateToStrMinue,
  makeAddr,
  dictionaryToFilter,
  checkImgType, checkLogin, checkAddr
} from './util/util.js'
import ECharts from 'echarts'

Vue.prototype.$echarts = ECharts;

Vue.config.productionTip = false;
Vue.prototype.findConfigItem = findConfigItem;
Vue.prototype.loadProvince = loadProvince;
Vue.prototype.dateToStr = dateToStr;
Vue.prototype.loadDictionary = loadDictionary;
Vue.prototype.dateToStrMinue = dateToStrMinue;
Vue.prototype.makeAddr = makeAddr;
Vue.prototype.dictionaryToFilter = dictionaryToFilter;
Vue.prototype.checkImgType = checkImgType;
Vue.prototype.checkLogin = checkLogin;
Vue.prototype.checkAddr = checkAddr;

// 引入element-ui
Vue.use(ElementUI);

// 引入axios
import axios from 'axios'

//axios.defaults.baseURL = 'http://230/wf';
axios.defaults.baseURL = 'http://134.175.0.94/wf';

// axios.defaults.baseURL = 'http://192.168.5.192:8080/wf';
// axios.defaults.baseURL = 'http://192.168.5.180/wf'
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;

//新增一个cookie
//document.cookie="u=23";
//alert(document.cookie)

new Vue({
  data() {
    return {
      routerDesc: [],
    };
  },
  router,
  store,
  created() {
    this.loadDictionary("REC_LOGISTICS_COMPANY,def_img_type,ORDER_STATUS,ORDER_STATUS_QUOTE,bjzt,qdzt,cxsj,unit,zycp,hslb,sshy,hyly,sszl,sscp,zycp,sshy,hszl,ddzt,hsly,hyly,hszl,hslb,gsxz,qylx,rec_order_status_for_buyer,order_status_for_seller");
    for (var i = 0; i < this.__routes[0].children.length; i++) {
      this.processRouter("", this.__routes[0].children[i]);
    }
  },
  methods: {
    processRouter: function (path, child) {
      var spt = "/";
      if (child.path.substr(0, 1) == "/") {
        spt = "";
      }
      this.routerDesc[path + spt + child.path] = child.desc;
      if (!!child.children) {
        for (var i = 0; i < child.children.length; i++) {
          this.processRouter(path + child.path, child.children[i]);
        }
      }
    }
  },
  watch: {
    '$route': function (to, from) {

      if (!this.routerDesc[to.path]) {
        return;
      }

      this.$axios({
        method: "post",
        url: "/user/saveRouter",
        data: {
          fromUrl: from.path,
          toUrl: to.path,
          desc: this.routerDesc[to.path]
        }
      })
    },
  },
}).$mount('#app');
