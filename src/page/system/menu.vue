<template>
  <div class="role">
    <el-row :gutter="100">
      <el-col :span="7" style="margin-top: 30px;">
        <el-tree v-loading="treeLoading" :data="menus" :props="defaultProps" 
          :render-content="renderContent" :highlight-current="true"
          :expand-on-click-node="false" @node-click="selectOne" style="min-width: 250px;">
        </el-tree>
      </el-col>
      <el-col :span="17">
        <el-tabs type="border-card" v-model="menuTabsValue" tab-position="top">
          <el-tab-pane label="菜单信息">
            <el-form label-width="80px" label-position="left" style="margin: 20px 50px;">
              <el-form-item label="菜单名称: ">
                <label>{{ selectedMenu.menuName }}</label>
              </el-form-item>
              <el-form-item label="菜单路径: ">
                <label>{{ selectedMenu.path }}</label>
              </el-form-item>
              <el-form-item label="排序: ">
                <label>{{ selectedMenu.sort }}</label>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="编辑菜单" :disabled="editTabDisabled">
            <el-form label-width="80px" v-loading="editTabLoading" label-position="left" style="margin: 20px 50px;">
              <el-form-item label="菜单名称">
                <el-input v-model="selectedMenu.menuName" style="width: 500px;"></el-input>
              </el-form-item>
              <el-form-item label="菜单路径">
                <el-input v-model="selectedMenu.path" style="width: 500px;"></el-input>
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="selectedMenu.sort" style="width: 500px;"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      menuTabsValue: '0',
      editTabDisabled: true,
      treeLoading: true,
      editTabLoading: false,
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedMenu: {
        menuName: '',
        path: '',
        sort: ''
      },
    }
  },
  created: function() {
    this.getMenuTree();
    this.getOne(1);
  },
  methods: {
    getMenuTree: function () {
      var me = this;
      me.treeLoading = true;
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
                label: childrenMenus[j].menuName
              }
              childMenus.push(childMenu);
            }
            topMenu = {
              id: data.data[i].menu.menuId,
              label: data.data[i].menu.menuName,
              children: childMenus
            }
          } else {
            topMenu = {
              id: data.data[i].menu.menuId,
              label: data.data[i].menu.menuName
            }
          }
          topMenus.push(topMenu);
        }
        me.menus = topMenus;
        me.treeLoading = false;
      });
    },
    edit: function (node, data) {
      this.menuTabsValue = '1';
      this.editTabDisabled = false;
      this.editTabLoading = true;
      this.getOne(data.id);
      this.editTabLoading = false;
    },
    remove: function (node, data) {
      console.log(node);
      console.log(data);
    },
    renderContent: function (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style="font-size: 12px;" type="text" size="mini" on-click={ () => this.edit(node, data) }>编辑</el-button>
            <el-button style="font-size: 12px;" type="text" size="mini" style="color: red;" on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    },
    getOne: function (id) {
      var me = this;
      $.get("/pf/menu/one/" + id, function (data) {
        me.selectedMenu = {
          menuName: data.data.menuName,
          path: data.data.path,
          sort: data.data.sort
        }
      });
    },
    selectOne: function(data) {
      this.getOne(data.id);
    }
  }
}
</script>