<template>
  <div class="app">
    <search></search>
    <Header></Header>
    <router-view v-if="isRouterAlive"></router-view>
    <myFooter></myFooter>
  </div>
</template>

<script> import search from "./components/common/search";
import Header from './components/common/header'

import myFooter from './components/footer'

export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  components: {
    search,
    Header,//页头
    myFooter,
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    }
  }
};
</script>
<style>

</style>



