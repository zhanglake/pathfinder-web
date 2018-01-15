<template>
  <div class="customer">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="addBtnClick">新增客户</el-button>
    <el-tabs v-model="editableTabsValue" tab-position="top">
      <el-tab-pane label="客户列表">
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%;margin: 15px auto;">
          <el-table-column prop="customerName" label="客户名称">
          </el-table-column>
          <el-table-column prop="contact" label="联系人">
          </el-table-column>
          <el-table-column prop="phone" label="固定电话">
          </el-table-column>
          <el-table-column prop="mobile" label="手机">
          </el-table-column>
          <el-table-column prop="province" label="省份">
          </el-table-column>
          <el-table-column prop="address" label="地址">
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
      <el-tab-pane label="新增客户" :disabled="addTabDisabled">
        <el-form ref="addCustomerForm" :model="newCustomer" :rules="customerRules" label-width="120px" label-position="left" size="small" style="width: 80%;margin: 20px;">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="newCustomer.customerName" placeholder="请输入客户名称" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="newCustomer.contact" placeholder="请输入联系人" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="固定电话" prop="phone">
            <el-input v-model="newCustomer.phone" placeholder="请输入固定电话" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="newCustomer.mobile" placeholder="请输入手机" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-select v-model="newCustomer.province" filterable placeholder="请选择省份" style="width: 500px;">
              <el-option v-for="item in provinces" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="newCustomer.address" placeholder="请输入地址" type="textarea" :rows="3" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAdd()">提交</el-button>
            <el-button @click="resetAdd()">重置</el-button>
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
      editableTabsValue: '0',
      tableLoading: false,
      tableData: [],
      addTabDisabled: true,
      tablePage: 1,
      param: null,
      provinces: [
        {name: '北京市', value: 0},{name: '天津市', value: 1},{name: '上海市', value: 2},{name: '重庆市', value: 3},{name: '河北省', value: 4},
        {name: '山西省', value: 5},{name: '辽宁省', value: 6},{name: '吉林省', value: 7},{name: '黑龙江省', value: 8},{name: '江苏省', value: 9},
        {name: '浙江省', value: 10},{name: '安徽省', value: 11},{name: '福建省', value: 12},{name: '江西省', value: 13},{name: '山东省', value: 14},
        {name: '河南省', value: 15},{name: '湖北省', value: 16},{name: '湖南省', value: 17},{name: '广东省', value: 18},{name: '海南省', value: 19},
        {name: '四川省', value: 20},{name: '贵州省', value: 21},{name: '云南省', value: 22},{name: '陕西省', value: 23},{name: '甘肃省', value: 24},
        {name: '青海省', value: 25},{name: '台湾省', value: 26},{name: '内蒙古自治区', value: 27},{name: '广西壮族自治区', value: 28},
        {name: '西藏自治区', value: 29},{name: '宁夏回族自治区', value: 30},{name: '新疆维吾尔自治区', value: 31},
        {name: '香港特别行政区', value: 32},{name: '澳门特别行政区', value: 33}
      ],
      newCustomer: {
        customerName: '',
        contact: '',
        phone: '',
        mobile: '',
        province: '',
        address: ''
      },
      customerRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.findList(this.tablePage, this.param);
  },
  methods: {
    findList: function (pageNumber, param) {
      var me = this;
      me.tableLoading = true;
      var param = {
        pageNumber: pageNumber,
        pageSize: 10,
        param: param
      }
      $.ajax({
        url: "/pf/customer/list",
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
            obj.customerName = data.results[i].customerName;
            obj.contact = data.results[i].contact;
            obj.phone = data.results[i].phone;
            obj.mobile = data.results[i].mobile;
            obj.province = data.results[i].provinceName;
            obj.address = data.results[i].address;
            result[i] = obj
          }
          me.tableData = result;
          me.tableLoading = false;
        }
      });
    },
    // 分页
    handleCurrentChange: function (current) {
      this.tablePage = current;
      this.findList(current, this.param);
    },
    addBtnClick: function () {
      this.addTabDisabled = false;
      this.editableTabsValue = '1';
    },
    resetAdd: function () {
      this.$refs.addCustomerForm.resetFields();
    },
    submitAdd: function () {
      var me = this;
      me.$refs.addCustomerForm.validate((valid) => {
        if (valid) {
          $.ajax({
            url: '/pf/customer/addorupdate',
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(me.newCustomer),
            success: function (data) {
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              });
              me.editableTabsValue = '0';
              me.findList(1, null);
            },
            error: function () {

            }
          });
        }
      })
    }
  }
}
</script>