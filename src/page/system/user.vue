<template>
  <div class="user">
    <el-tabs v-model="editableTabsValue" tab-position="top">
      <el-tab-pane label="用户列表">
        <el-table @filter-change="statusFilterChange" v-loading="tableLoading" :data="tableData" style="width: 80%;margin: 15px auto;">
          <el-table-column prop="userName" label="用户名">
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人">
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间">
          </el-table-column>
          <el-table-column prop="locked" label="状态"
            :filters="[{ text: '使用中', value: false }, { text: '锁定中', value: true }]"
            filter-placement="bottom" :filter-multiple="false">
            <template slot-scope="scope">
              <el-tag :type="scope.row.locked === true ? 'danger' : 'success'">
                {{scope.row.locked === true ? '锁定中' : '使用中'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="editRow(scope)" type="text" size="small">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button @click.native.prevent="deleteRow(scope)" type="text" size="small">
                <i class="el-icon-delete"></i> 移除
              </el-button>
          </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" style="width: 80%;margin: auto;padding:20px 0;">
            <el-pagination @current-change="handleCurrentChange" :current-page="tablePage" :page-size="10" layout="total, prev, pager, next, jumper" :total="tableTotal">
            </el-pagination>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="编辑用户" v-loading="editTabLoading" :disabled="editTabDisabled">
        <el-form ref="userForm" :rules="userValidateRules" :model="user" label-width="120px" label-position="left" size="small" style="width: 80%;margin: 20px;">
          <el-form-item label="用户编号" style="display: none;">
            <el-input v-model="user.userId" size="small" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="user.userName" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="user.password" :disabled="true" style="width: 500px;"></el-input>
            <el-button @click="resetPwd" type="danger" style="margin-left: 20px;">重置密码</el-button>
          </el-form-item>
          <el-form-item label="是否锁定">
            <el-switch v-model="user.locked" active-text="锁定" inactive-text="解锁"></el-switch>
          </el-form-item>
          <el-form-item label="拥有角色">
            <el-select v-model="user.roles" filterable multiple :loading="roleLoading" placeholder="请选择角色" style="width: 500px;">
              <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #ccc; font-size: 12px; padding-right: 20px;">{{ item.description }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织">
            <el-select v-model="user.organization" filterable clearable :loading="orgLoading" placeholder="请选择组织"  style="width: 500px;">
              <el-option v-for="item in organizations" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      tableLoading: false,
      tablePage: 1,
      tableTotal: 10,
      tableData: [],
      dialogVisible: false,
      editTabDisabled: true,
      editableTabsValue: '0',
      editTabLoading: false,
      statusFilter: null,
      user: {
        userId: '',
        userName: '',
        password: '********',
        locked: false,
        organization: [],
        roles: []
      },
      organizations: [],
      roles: [],
      orgLoading: false,
      roleLoading: false,
      userValidateRules: {
        userName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  created: function() {
    // 初始化用户表格
    this.findList(1);
    // 获取可展示的组织列表
    this.findOrgList();
    // 获取可展示的角色列表
    this.findRoleList();
  },
  methods: {
    // 用户列表
    findList: function (pageNumber, statusFilter) {
      var me = this;
      me.tableLoading = true;
      var param = {
        pageNumber: pageNumber,
        pageSize: 10,
        param: statusFilter
      }
      $.ajax({
        url: "/pf/user/list",
        type: "post",
        data: JSON.stringify(param),
        contentType: "application/json",
        success: function (data) {
          me.tablePage = data.pageNo;
          me.tableTotal = data.totalRecord;
          var result = [];
          for (let i = 0; i < data.results.length; i++) {
            var obj = {};
            obj.id = data.results[i].userId;
            obj.userName = data.results[i].userName;
            obj.createdBy = data.results[i].createdBy;
            obj.createdDate = data.results[i].createdDate;
            obj.locked = data.results[i].locked;
            result[i] = obj
          }
          me.tableData = result;
          me.tableLoading = false;
        },
        error: function() {
          me.tableLoading = false;
        }
      });
    },
    // 过滤 -- 服务器过滤
    statusFilterChange: function (filters) {
      var me = this;
      $.map(filters, function (item, index) {
        if (item.length > 0) {
          me.statusFilter = item[0];
        } else {
          me.statusFilter = null;
        }
      });
      me.findList(1, me.statusFilter);
    },
    // 切换表格页码
    handleCurrentChange: function (current) {
      this.findList(current, this.statusFilter);
    },
    // 编辑用户
    editRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.editableTabsValue = '1';
      me.editTabLoading = true;
      $.get("/pf/user/one/" + id, function(data) {
        me.editTabDisabled = false;
        me.user.userId = data.data.userId;
        me.user.userName = data.data.userName;
        me.user.locked = data.data.locked;
        if (data.data.organization.orgId) {
          me.user.organization = data.data.organization.orgId;
        }
        var myRoles = [];
        for (var i = 0;i < data.data.roles.length;i ++) {
          myRoles.push(data.data.roles[i].roleId);
        }
        me.user.roles = myRoles;
        me.editTabLoading = false;
      });
    },
    // 删除用户
    deleteRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.$confirm("确认删除用户？").then(_ => {
        me.tableLoading = true;
        $.get("/pf/user/delete/" + id, function (data) {
          me.findList(me.tablePage, me.statusFilter);
          me.$message({
            showClose: true,
            message: data.message,
            type: data.status.toLowerCase()
          });
          me.tableLoading = false;
        });
      }).catch(_ => {});
    },
    // 重置密码
    resetPwd: function () {
      var me = this;
      me.$confirm("确定重置密码？").then(_ => {
        me.editTabLoading = true;
        $.get("/pf/user/resetPwd", function (data) {
          me.$message({
            showClose: true,
            message: data.message,
            type: data.status.toLowerCase()
          })
          me.editTabLoading = false;
        });
      }).catch(_ => {});
    },
    // 获取组织列表
    findOrgList: function () {
      var me = this;
      me.orgLoading = true;
      $.get("/pf/organization/select", function (data) {
        var orgs = data.data;
        for (var i = 0; i < orgs.length; i++) {
          var obj = {
            value: orgs[i].orgId,
            label: orgs[i].orgName
          };
          me.organizations.push(obj);
        }
        me.orgLoading = false;
      });
    },
    // 获取角色列表
    findRoleList: function () {
      var me = this;
      $.get("/pf/role/select", function (data) {
        var myRoles = data.data;
        for (var i = 0; i < myRoles.length; i++) {
          var obj = {
            value: myRoles[i].roleId,
            label: myRoles[i].roleName,
            description: myRoles[i].description
          };
          me.roles.push(obj);
        }
      });
    },
    // 确认保存修改用户
    onSubmit: function () {
      var me = this;
      // 表单验证
      me.$refs.userForm.validate((valid) => {
        if (valid) {
          var myUser = {
            userId: me.user.userId,
            userName: me.user.userName,
            locked: me.user.locked,
            organizationId: me.user.organization,
            roleIds: me.user.roles
          };
          me.editTabLoading = true;
          $.ajax({
            url: "/pf/user/update",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(myUser),
            success: function (data) {
              me.editTabLoading = false;
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              })
            },
            error: function () {
              me.editTabLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style>
.user {
  height: 800px;
}
</style>