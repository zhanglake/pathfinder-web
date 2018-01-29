<template>
  <div id="login">
    <el-form :model="user" label-width="80px" size="small" label-position="left">
      <el-form-item label="用户名">
        <el-input v-model="user.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密 码">
        <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <div id="login_message"></div>
      </el-form-item>
      <el-form-item>
        <el-button v-loading.fullscreen.lock="loginLoading" type="primary" @click="login()">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import $ from 'jquery'
import '../global/global.js'
export default {
  data: function () {
    return {
      CURRENT_ADMIN: global.CURRENT_ADMIN,
      user: {
        name: '',
        password: ''
      },
      loginLoading: false
    }
  },
  created: function () {
    global.CURRENT_ADMIN = {
      id: '',
      name: ''
    }
  },
  methods: {
    login: function () {
      this.loginLoading = true;
      var me = this;
      $.ajax({
        url: "/pf/login/back",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(me.user),
        success: function (data) {
          if (data.code == 200) {
            global.CURRENT_ADMIN.id = data.data.userId;
            global.CURRENT_ADMIN.name = data.data.userName;
            me.$router.push({
              name: 'home'
            });
            $("#login_message").html("");
            me.loginLoading = false;
          } else {
            // me.$message({
            //   showClose: true,
            //   message: data.message,
            //   type: data.status.toLowerCase()
            // });
            $("#login_message").html(data.message);
            me.loginLoading = false;
          }
        }
      });
    }
  }
}
</script>
<style>
  #login {
    width: 300px;
    margin: 15% auto;
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  #login_message {
    color: #FF4D00;
    line-height: 14px;
    font-size: 12px;
  }
</style>