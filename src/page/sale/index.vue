<template>
  <main>
    <div class="main-left">
      <el-menu default-active="/sale/list" class="el-menu-vertical-demo" :router="true">
        <el-menu-item v-for="item in menus" :key="item.menuId" :index="item.path">
          {{ item.menuName }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-right">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
import $ from 'jquery'

export default {
  data: function () {
    return {
      menus: []
    }
  },
  created: function () {
    this.getMenus(1, 3);
  },
  methods: {
    getMenus: function (roleId, menuId) {
      var me = this;
      $.get("/pf/menu/secondary/" + roleId + "/" + menuId, function (data) {
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
main .main-left {
  text-align: center;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 200px;
  flex: 0 0 200px;
}
main .main-right {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  background-color: #fff;
  padding: 20px 50px 50px 50px;
}
main .el-menu {
  background-color: transparent!important;
}
</style>