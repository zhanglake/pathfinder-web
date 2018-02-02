<template>
  <div id="back">
    <!-- 头部导航 -->
    <header class="header" :class="{ 'header-fixed' : headerFixed }">
      <el-row>
          <el-col :span="24">
            <el-menu default-active="/home" class="el-menu-demo" mode="horizontal" :router="true">
              <el-menu-item v-for="item in menus" :index="item.path">
                {{ item.menuName }}
              </el-menu-item>
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
import '../global/global.js'

export default {
  data: function () {
    return {
      CURRENT_ADMIN: global.CURRENT_ADMIN,
      active: true,
      headerFixed: true,
      menus: []
    }
  },
  created: function () {
    if (!global.CURRENT_ADMIN.id) {
      this.$router.push({
        name: 'login',
        params: {}
      })
    }
    this.getMenus(1);
  },
  methods: {
    getMenus: function (roleId) {
      var me = this;
      $.get("/pf/menu/top/" + roleId, function (data) {
        var myMenus = [];
        for (var i = 0; i < data.data.length; i ++) {
          var myMenu = {
            menuId: data.data[i].menuId,
            menuName: data.data[i].menuName,
            path: data.data[i].path,
            sort: data.data[i].sort
          }
          myMenus.push(myMenu);
        }
        me.menus = myMenus;
      });
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
  border: solid 20px #E9ECF1;
  background-color: #FCFCFC;
  border-width: 10px 20px 0 20px;
}
</style>
