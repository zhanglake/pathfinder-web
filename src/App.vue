<template>
  <div id="app">
    <!-- 头部导航 -->
    <header class="header" :class="{ 'header-fixed' : headerFixed }">
      <el-row>
          <el-col :span="24">
            <el-menu default-active="/system" class="el-menu-demo" mode="horizontal" @select="">
              <el-menu-item index="/system">系统管理</el-menu-item>
              <el-menu-item index="2">在线商城</el-menu-item>
              <el-menu-item index="3">客户管理</el-menu-item>
              <el-menu-item index="4">系统设置</el-menu-item>
              <el-menu-item index="5">活动发布</el-menu-item>
            </el-menu>
          </el-col>
      </el-row>
    </header>

    <div v-show="headerFixed" style="position: relative;height: 60px;width: 100%;"></div>

    <router-view />
    
  </div>
</template>

<script>
// import Vue from 'vue'
// import Element from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import $ from 'jquery'

// Vue.use(Element)

export default {
  name: 'app',
  data: function () {
    return {
      active: true,
      headerFixed: true
    }
  }
}
</script>

<style>
/* 头部导航 */
header {
  z-index: 1000;
  min-width: 1200px;
  transition: all 0.5s ease;
  border-top: solid 4px #3091F2;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04);
}
header.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
header .el-menu-demo {
  padding-left: 50px!important;
}

/* 主内容区 */
main {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  min-height: 800px;
  border: solid 40px #E9ECF1;
  background-color: #FCFCFC;
}
</style>
