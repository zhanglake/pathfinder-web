<template>
  <div id="create">
    <div class="order-header">
      <a @click="back"><i class="el-icon-arrow-left"></i>返回</a>
      <span>提交订单</span>
    </div>
    <div class="order-body">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>已选择</span>
        </div>
        <div v-for="s in cart.selected" :key="s.id" class="text s">
          <el-row>
            <el-col :span="14">{{ s.name }}</el-col>
            <el-col :span="2"><span class="money">x</span> {{ s.count }}</el-col>
            <el-col :span="8" style="text-align: right;">
              <font v-show="s.countPrice>s.countSalePrice" style="font-size: 10px;"><s>￥{{ s.countPrice }}</s></font>
              <font style="color: #FF3333;font-weight: 900;font-size: 16px;"><span class="money">￥</span>{{ s.countSalePrice }}</font>
            </el-col>
          </el-row>
        </div>
        <div class="total">
          <el-row>
            <el-col :span="18">小计</el-col>
            <el-col :span="6" style="text-align: right;">
              <font style="color: #FF3333;font-weight: 900;font-size: 16px;"><span class="money">￥</span>{{ cart.totalSalePrice }}</font>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>收货信息</span>
        </div>
        <el-form ref="customerForm" :model="customer" label-position="left" size="small"
          :rules="customerRules" label-width="80px">
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="customer.phone" @change="getCustomer" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="customer.name" :disabled="nameDisabled" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="送货地址" prop="address">
            <el-input v-model="customer.address" :disabled="addressDisabled" style="width: 200px;"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div style="height: 50px;display: block;"></div>

    <footer class="footer">
      <div class="order-price">￥{{ cart.totalPrice }}</div>
      <el-button class="submitBtn" @click="submitOrder">确认提交</el-button>
    </footer>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data: function () {
    return {
      nameDisabled: false,
      addressDisabled: false,
      customer: global.CURRENT_CUSTOMER ? global.CURRENT_CUSTOMER : {
        id: '',
        name: '',
        phone: '',
        address: ''
      },
      cart: this.$route.params.cart,
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
    console.log(this.cart);
  },
  methods: {
    // 返回，跳转
    back: function () {
      var me = this;
      this.$router.push({
        name: 'all',
        params: {
          cart: me.cart
        }
      })
    },
    // 获取客户信息
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
    submitOrder: function () {
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
                customerLoading.close();
                // 保存订单信息
                me.postOrder();
              },
              error: function () {
                customerLoading.close();
              }
            });
          } else {
            // 保存订单信息
            me.postOrder();
          }
        }
      });
    },
    postOrder: function () {
      var me = this;
      // 保存订单信息
      var orderLoading = this.$loading({
        lock: true,
        text: '正在保存订单信息...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var ods = [];
      for (var i = 0; i < me.cart.selected.length; i ++) {
        var od = {
          productId: me.cart.selected[i].id,
          count: me.cart.selected[i].count,
          price: me.cart.selected[i].price,
          salePrice: me.cart.selected[i].salePrice,
          countPrice: me.cart.selected[i].countPrice,
          countSalePrice: me.cart.selected[i].countSalePrice
        }
        ods.push(od);
      }
      console.log(ods);
      var o = {
        phone: me.customer.phone,
        order: {
          customerId: me.customer.id,
          totalPrice: me.cart.totalPrice,
          totalSalePrice: me.cart.totalSalePrice,
          orderDetails: ods
        }
      }
      console.log(o);
      $.ajax({
        url: "/pf/order/add",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(o),
        success: function (data) {
          orderLoading.close();
          global.CURRENT_CUSTOMER = me.customer;
          me.$router.push({
            name: 'mine',
            params: {
              customer: me.customer
            }
          });
          me.$message({
            showClose: true,
            message: data.message,
            type: data.status.toLowerCase()
          });
        },
        error: function () {
          orderLoading.close();
        }
      });
    }
  }
}
</script>
<style>
.order-header {
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-width: 0 0 1px 0;
  position: fixed;
  width: 100%;
  top: 60px;
  z-index: 99;
  background-color: #fff;
}
.order-header > span {
  font-size: 18px;
  display: inline-block;
  width: 100px;
  margin: 0 auto;
  margin-left: 80px;
  text-align: center;
}
.order-body {
  margin-top: 40px;
}
.order-price {
  display: inline-block;
  position: absolute;
  left: 20px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  font-size: 20px;
}
.money {
  font-size: 12px;
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
</style>