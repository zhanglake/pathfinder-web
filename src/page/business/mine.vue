<template>
  <div id="mine">
    <div class="mine-header">
      <el-card class="box-card">
        <div class="card-head">我的信息</div>
        <div style="height: 30px;line-height: 30px;">姓名：<span style="margin-left: 10px;">{{ customer.name }}</span></div>
        <div style="height: 30px;line-height: 30px;">联系方式：<span style="margin-left: 10px;">{{ customer.phone }}</span></div>
        <div style="height: 30px;line-height: 30px;">送货地址：<span style="margin-left: 10px;">{{ customer.address }}</span></div>
      </el-card>
    </div>
    <div class="mine-body">
      <el-card class="box-card">
        <div class="card-head">我的订单</div>
        <div style="line-height: 40px;">
          <el-row>
            <el-col :span="9" style="font-size: 12px;font-weight: 900;">订单编号</el-col>
            <el-col :span="8" style="font-size: 12px;font-weight: 900;">创建时间</el-col>
            <el-col :span="3" style="font-size: 12px;font-weight: 900;">金额</el-col>
            <el-col :span="4" style="font-size: 12px;font-weight: 900;">状态</el-col>
          </el-row>
        </div>
        <div v-for="o in orders" :key="o.orderId" style="border: 1px solid #ccc;border-width: 1px 0 0 0;">
          <a @click="showOneOrder(o.orderId)">
            <el-row>
              <el-col :span="9" style="font-size: 10px;line-height: 50px;">{{ o.orderCode }}</el-col>
              <el-col :span="8" style="font-size: 10px;line-height: 50px;">{{ o.createdDate }}</el-col>
              <el-col :span="3" style="font-size: 10px;line-height: 50px;">￥{{ o.totalPrice }}</el-col>
              <el-col :span="4" style="font-size: 10px;line-height: 50px;">
                <span :class="'status-c status-' + o.statusInt">{{ o.status }}</span>
              </el-col>
            </el-row>
          </a>
        </div>
      </el-card>
    </div>

    <el-dialog title="订单详情" :visible.sync="orderDialogVisible" :modal="true" width="80%">
      <div v-for="od in order.orderDetails" :key="od.orderDetailId" class="text s">
        <el-row>
          <el-col :span="16">{{ od.product.productName }}</el-col>
          <el-col :span="2"><span class="money">x</span> {{ od.count }}</el-col>
          <el-col :span="6" style="text-align: right;"><span class="money">￥</span>{{ od.countPrice }}</el-col>
        </el-row>
      </div>
      <div class="total">
        <el-row>
          <el-col :span="18">小计</el-col>
          <el-col :span="6" style="text-align: right;"><span class="money">￥</span>{{ order.totalPrice }}</el-col>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog title="绑定用户" :show-close="false" :close-on-click-modal="false" :visible="customerDialogVisible" :modal="true" width="80%">
      <el-form ref="customerForm" :model="customer" label-position="left" size="small"
        :rules="customerRules" label-width="80px">
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="customer.phone" @change="getCustomer" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="customer.name" :disabled="nameDisabled" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="送货地址" prop="address">
          <el-input v-model="customer.address" :disabled="addressDisabled" style="width: 150px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindCustomer">绑 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import '../../global/global.js'
import './customer.js'
export default {
  data: function () {
    return {
      orderDialogVisible: false,
      customerDialogVisible: false,
      nameDisabled: false,
      addressDisabled: false,
      customer: this.$route.params.customer ? this.$route.params.customer : global.CURRENT_CUSTOMER ? global.CURRENT_CUSTOMER : {
        id: '',
        name: '',
        phone: '',
        address: ''
      },
      orders: [],
      order: {},
      customerRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入送货地址', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    if (!this.customer.id) {
      this.customerDialogVisible = true;
    } else {
      this.findOrderList();
    }
  },
  methods: {
    getCustomer: function () {
      var me = this;
      if (me.customer.phone) {
        $.ajax({
          url: "/pf/customer/one/" + me.customer.phone,
          type: "get",
          contentType: "application/json",
          success: function (data) {
            if (data.data) {
              me.customer.id = data.data.customerId;
              me.customer.name = data.data.customerName;
              me.customer.address = data.data.address;
              me.nameDisabled = true;
              me.addressDisabled = true;
              me.findOrderList();
            } else {
              me.customer.id = '';
              me.customer.name = '';
              me.customer.address = '';
              me.nameDisabled = false;
              me.addressDisabled = false;
            }
            global.CURRENT_CUSTOMER = me.customer;
          }
        });
      } else {
        me.customer.id = '';
        me.customer.name = '';
        me.customer.address = '';
        me.nameDisabled = false;
        me.addressDisabled = false;
      }
    },
    // 绑定用户
    bindCustomer: function () {
      var me = this;
      me.$refs.customerForm.validate((valid) => {
        if (valid) {
          if (!me.customer.id) {
            // 没有客户信息就要先保存客户信息
            var customerLoading = this.$loading({
              lock: true,
              text: '正在保存新客户信息...',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            var c = {
              customerId: null,
              customerName: me.customer.name,
              phone: me.customer.phone,
              address: me.customer.address
            }
            $.ajax({
              url: "/pf/customer/addorupdate",
              type: "post",
              contentType: "application/json",
              data: JSON.stringify(c),
              success: function (data) {
                me.customer.id = data.data.customerId;
                me.customer.name = data.data.customerName;
                me.customer.phone = data.data.phone;
                me.customer.address = data.data.address;
                global.CURRENT_CUSTOMER = me.customer;
                me.findOrderList();
                me.$message({
                  showClose: true,
                  message: data.message,
                  type: data.status.toLowerCase()
                });
                customerLoading.close();
                me.customerDialogVisible = false;
              },
              error: function () {
                customerLoading.close();
              }
            });
          } else {
            me.customerDialogVisible = false;
          }
        }
      });
    },
    // 获取列表
    findOrderList: function () {
      var loading = this.$loading();
      var me = this;
      if (me.customer.id) {
        $.ajax({
          url: "/pf/order/c/list/" + me.customer.id,
          type: "get",
          contentType: "application/json",
          success: function (data) {
            me.orders = data.data;
            // 改时间格式和状态
            for (var i = 0; i < me.orders.length; i ++) {
              me.orders[i].createdDate = global.FORMAT_DATE(me.orders[i].createdDate);
              switch (me.orders[i].statusInt) {
                case 0: me.orders[i].status = '已创建';break;
                case 1: me.orders[i].status = '待付款';break;
                case 2: me.orders[i].status = '已确认';break;
                case 3: me.orders[i].status = '已发货';break;
                case 4: me.orders[i].status = '已完成';break;
              }
            }
            loading.close();
          },
          error: function () {
            loading.close();
          }
        });
      }
    },
    // 显示订单详情
    showOneOrder: function (orderId) {
      this.orderDialogVisible = true;
      var loading = this.$loading();
      var me = this;
      $.ajax({
          url: "/pf/order/c/one/" + orderId,
          type: "get",
          contentType: "application/json",
          success: function (data) {
            me.order = data.data;
            loading.close();
          },
          error: function () {
            loading.close();
          }
      });
    }
  }
}
</script>
<style>
.card-head {
  height: 30px;
  line-height: 30px;
  border: 1px solid #ff8400;
  border-width: 0 0 0 4px;
  padding: 0 0 0 10px;
  margin: 10px 0 10px -10px;
}
.status {
  display: inline-block;
  width: 40px;
  height: 20px;
  font-size: 10px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  color: #fff;
}
.status-0 { background-color: #1ab394}
.status-1 { background-color: #1ab394}
.status-2 { background-color: #FB3301}
.status-3 { background-color: #ff8400}
.status-4 { background-color: #818385}
.money {
  font-size: 10px;
}
.s {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin: 5px 0;
}
.total {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-width: 1px 0 0 0;
  margin: 10px 0;
  padding: 10px 0;
}
.status-c {
    display: inline-block !important;
    width: 40px !important;
    height: 20px !important;
    font-size: 10px !important;
    border-radius: 10px !important;
    line-height: 20px !important;
    text-align: center !important;
    color: #fff !important;
}
</style>