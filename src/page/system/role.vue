<template>
  <div class="role">
    <el-tabs v-model="editableTabsValue" tab-position="top">
      <el-tab-pane label="角色列表">
        <el-table @filter-change="statusFilterChange" v-loading="tableLoading" :data="tableData" style="width: 80%;margin: 15px auto;">
          <el-table-column prop="roleName" label="角色名称">
          </el-table-column>
          <el-table-column prop="description" label="描述">
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间">
          </el-table-column>
          <el-table-column prop="available" label="状态" 
            :filters="[{ text: '使用中', value: true }, { text: '已停用', value: false }]"
            filter-placement="bottom-start" :filter-multiple="false">
            <template slot-scope="scope">
              <el-tag :type="scope.row.available === false ? 'danger' : 'success'">
                {{scope.row.available === false ? '已停用' : '使用中'}}
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
      <el-tab-pane label="编辑角色" v-loading="editTabLoading" :disabled="editTabDisabled">
        <el-form ref="roleForm" :rules="roleValidateRules" :model="role" label-width="120px" label-position="left" size="small" style="width: 80%;margin: 20px;">
          <el-form-item label="角色编号" style="display: none;">
            <el-input v-model="role.roleId" size="small" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="role.description" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-switch v-model="role.available" active-text="可用" inactive-text="禁用"></el-switch>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox-group v-model="disabledChecked">
              <el-checkbox label="首页" disabled>首页</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-for="item1 in menus" v-model="role.menus">
              <el-checkbox v-for="item2 in item1.children" :label="item2.id">
                {{ item2.label }}
              </el-checkbox>
            </el-checkbox-group>
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
      disabledChecked: ['首页'],
      editableTabsValue: '0',
      tableLoading: false,
      tablePage: 1,
      tableTotal: 10,
      tableData: [],
      statusFilter: null,
      editTabDisabled: true,
      editTabLoading: false,
      role: {
        roleId: '',
        roleName: '',
        description: '',
        available: true,
        menus: []
      },
      roleValidateRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur' }
        ],
        description: [
          { min: 0, max: 50, message: '长度在50个字符以内', trigger: 'blur' }
        ]
      },
      menus: []
    }
  },
  created: function() {
    // 初始化角色列表
    this.findRoleList(1);
    // 初始化菜单列表
    this.findMenuList();
  },
  methods: {
    // 查找列表
    findRoleList: function (pageNumber, param) {
      var me = this;
      me.tableLoading = true;
      var param = {
        pageNumber: pageNumber,
        pageSize: 10,
        param: param
      }
      $.ajax({
        url: "/pf/role/list",
        type: "post",
        data: JSON.stringify(param),
        contentType: "application/json",
        success: function (data) {
          me.tablePage = data.pageNo;
          me.tableTotal = data.totalRecord;
          var result = [];
          for (let i = 0; i < data.results.length; i++) {
            var obj = {};
            obj.id = data.results[i].roleId;
            obj.roleName = data.results[i].roleName;
            obj.description = data.results[i].description;
            obj.createdDate = data.results[i].createdDate;
            obj.available = data.results[i].available;
            result[i] = obj
          }
          me.tableData = result;
          me.tableLoading = false;
        }
      });
    },
    findMenuList: function () {
      var me = this;
      $.get("/pf/menu/tree", function (data) {
        var topMenus = [];
        for (var i = 0; i < data.data.length; i ++) {
          var topMenu = null;
          // 子菜单
          var childrenMenus = data.data[i].childrenMenus;
          if (childrenMenus && childrenMenus.length > 0) {
            var childMenus = [];
            for (var j = 0; j < childrenMenus.length; j ++) {
              var childMenu = {
                id: childrenMenus[j].menuId,
                label: childrenMenus[j].fullName
              }
              childMenus.push(childMenu);
            }
            topMenu = {
              id: data.data[i].menu.menuId,
              label: data.data[i].menu.fullName,
              children: childMenus
            }
          } else {
            topMenu = {
              id: data.data[i].menu.menuId,
              label: data.data[i].menu.fullName
            }
          }
          topMenus.push(topMenu);
        }
        me.menus = topMenus;
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
      me.findRoleList(1, me.statusFilter);
    },
    // 切换表格页码
    handleCurrentChange: function (current) {
      this.findRoleList(current, this.statusFilter);
    },
    // 查询角色
    editRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.editableTabsValue = '1';
      me.editTabLoading = true;
      $.get("/pf/role/one/" + id, function(data) {
        me.editTabDisabled = false;
        me.role.roleId = data.data.roleId;
        me.role.roleName = data.data.roleName;
        me.role.description = data.data.description;
        me.role.available = data.data.available;
        var myMenus = [];
        var dataMenus = data.data.menus;
        for (var i = 0; i < dataMenus.length; i ++) {
          if (dataMenus[i].parentId) {
            myMenus.push(dataMenus[i].menuId);
          } 
        }
        me.role.menus = myMenus;
        me.editTabLoading = false;
        console.log(me.menus);
        console.log(me.role.menus);
      });
    },
    // 删除角色
    deleteRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.$confirm("确认删除角色？").then(_ => {
        me.tableLoading = true;
        $.get("/pf/role/delete/" + id, function (data) {
          me.findRoleList(me.tablePage, me.statusFilter);
          me.$message({
            showClose: true,
            message: data.message,
            type: data.status.toLowerCase()
          });
          me.tableLoading = false;
        });
      }).catch(_ => {});
    },
    // 保存修改角色
    onSubmit: function () {
      var me = this;
      // 表单验证
      me.$refs.roleForm.validate((valid) => {
        if (valid) {
          var myRole = {
            roleId: me.role.roleId,
            roleName: me.role.roleName,
            description: me.role.description,
            available: me.role.available,
            menus: me.role.menus
          };
          // 首页 权限默认添加
          myRole.menus.push(1);
          me.editTabLoading = true;
          $.ajax({
            url: "/pf/role/update",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(myRole),
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