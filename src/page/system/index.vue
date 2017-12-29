<template>
  <main>
    <div class="main-left">
      <el-menu default-active="/system/aa" class="el-menu-vertical-demo" :router="true">
        <el-menu-item index="/system/user">用户管理</el-menu-item>
        <el-menu-item index="/system/role">角色管理</el-menu-item>
      </el-menu>
    </div>
    <div class="main-right">
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
export default {
  name: 'system'
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
  padding: 50px 50px;
}
main .el-menu {
  background-color: transparent!important;
}
</style>