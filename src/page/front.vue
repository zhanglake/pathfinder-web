<template>
  <div id="front">
    <!-- 头部导航 -->
    <header class="header" :class="{ 'header-fixed' : headerFixed }">
      <el-row>
          <el-col :span="24">
            <el-menu default-active="/c/mine" class="el-menu-demo" mode="horizontal" :router="true">
              <el-menu-item index="/c/new">新品上市</el-menu-item>
              <el-menu-item index="/c/all">选购</el-menu-item>
              <el-menu-item index="/c/mine">我的</el-menu-item>
            </el-menu>
          </el-col>
      </el-row>
    </header>

    <div v-show="headerFixed" style="position: relative;height: 60px;width: 100%;"></div>

    <router-view />
    
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data: function () {
    return {
      active: true,
      headerFixed: true
    }
  }
}
</script>

<style>
#front {
  margin: -8px;
  font-family: '微软雅黑';
}
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
  padding-left: 50px !important;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
}

/* 主内容区 */
main {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  min-height: 800px;
  border: solid 40px #E9ECF1;
  background-color: #FCFCFC;
  border-width: 20px 40px;
}
</style>
