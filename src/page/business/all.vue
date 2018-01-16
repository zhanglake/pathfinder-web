<template>
  <div id="all">
    <el-row>
      <el-col style="width: 80px;padding:0px;position: fixed;">
        <div v-for="tp in typeProducts" class="left-menu">
          <a href="javascript:void(0)" @click="goAnchor('#anchor-' + tp.type.typeId)">{{ tp.type.typeName }}</a>
        </div>
      </el-col>
      <el-col :span="18" style="position: absolute;left: 90px;">
        <el-row>
          <el-col :span="24" v-for="tp in typeProducts">
            <div :id="'anchor-' + tp.type.typeId" :name="tp.type.typeId" class="product-type">{{ tp.type.typeName }}</div>
            <el-col :span="24" v-for="p in tp.products" :key="p.productId">
              <el-card :body-style="{ padding: '0px' }" style="height: 120px;">
                <img :src="'/pf/' + p.pictures[0].path" class="image">
                <div class="card-div">
                  <span style="display: block;height: 30px;margin: 10px 0 0 0;line-height: 30px;">{{ p.productName }}</span>
                  <div class="bottom clearfix">
                    <label class="description">{{ p.description }}</label>
                  </div>
                  <div style="height: 20px;">
                    <el-button type="text" class="button" @click="addToCart(p)" style="float: right;margin-right: 10px;">
                      <i class="el-icon-circle-plus-outline"></i>
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div style="height: 50px;display: block;"></div>

    <el-popover ref="popover4" placement="top-start" title="购物车"
      width="300" trigger="click" :visible-arrow="true" @show="popShow" @hide="popHide">
      <div v-show="!cart.selected || cart.selected.length == 0" class="last-cart-div">您还未选购商品</div>
      <el-row>
        <el-col :span="24" v-for="(s, index) in cart.selected" :key="s.id">
          <div :class="index == cart.selected.length - 1 ? 'last-cart-div' : 'cart-div'">
            <span class="cart-name">{{ s.name }}</span>
            <span class="cart-price">￥{{ s.countPrice }}</span>
            <div style="float: right;margin-fight: 20px;">
              <el-button class="cart-btn" @click="minusOne(s)"><i class="el-icon-minus"></i></el-button>
              <span class="cart-count">{{ s.count }}</span>
              <el-button class="cart-btn" @click="addOne(s)"><i class="el-icon-plus"></i></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-popover>
    
    <footer class="footer">
      <el-badge :value="cart.totalCount" :max="99" class="badge"></el-badge>
      <el-button v-popover:popover4 class="cart">
        <i class="el-icon-goods"></i>
      </el-button>
      <div class="total-price">￥{{ cart.totalPrice }}</div>
      <el-button class="submitBtn" @click="submit">去下单</el-button>
    </footer>
    <div id="cover"></div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data: function () {
    return {
      currentDate: new Date(),
      typeProducts: [],
      selected: [],
      cart: this.$route.params.cart ? this.$route.params.cart :{
        totalPrice: 0,
        totalCount: 0,
        selected: this.selected
      }
    }
  },
  created: function () {
    this.findProducts();
    //
  },
  methods: {
    // 锚点跳转
    goAnchor: function(selector) {
      var anchor = this.$el.querySelector(selector);
      document.body.scrollTop = anchor.offsetTop;
    },
    // 获取数据
    findProducts: function () {
      const loading = this.$loading();
      var me = this;
      $.ajax({
        url: "/pf/product/c/list",
        type: "get",
        contentType: "application/json",
        success: function (data) {
          me.typeProducts = data.data;
          loading.close();
        }
      });
    },
    // 添加到购物车
    addToCart: function (product) {
      var isSelected = false;
      for (var i = 0; i < this.selected.length; i ++) {
        if (product.productId == this.selected[i].id) {
          isSelected = true;
          this.selected[i].count ++;
          this.selected[i].countPrice = this.selected[i].price * this.selected[i].count;
          break;
        }
      }
      if (!isSelected) {
        var count = 1;
        var countPrice = product.price * count;
        var s = {
          id: product.productId,
          name: product.productName,
          count: count,
          price: product.price,
          countPrice: countPrice
        }
        this.selected.push(s);
      }
      this.cart.selected = this.selected;
      this.cart.totalCount = 0;
      this.cart.totalPrice = 0;
      for (var i = 0; i < this.selected.length; i ++) {
        this.cart.totalCount += this.selected[i].count;
        this.cart.totalPrice += this.selected[i].countPrice;
      }
      this.$message({
        message: '添加成功！',
        type: 'success',
        duration: 1000
      });
    },
    // 减少一个
    minusOne: function (selected) {
      if (selected.count > 0) {
        selected.count --;
        selected.countPrice = selected.price * selected.count;
        this.cart.totalCount --;
        this.cart.totalPrice -= selected.price;
        // 最后一个删除就要把该行数据删除
        if (selected.count == 0) {
          this.cart.selected = $.grep (this.cart.selected, function (cur,i) {
            return cur.id != selected.id;
          });
          this.selected = this.cart.selected;
        }
      }
    },
    // 增加一个
    addOne: function (selected) {
      selected.count ++;
      selected.countPrice = selected.price * selected.count;
      this.cart.totalCount ++;
      this.cart.totalPrice += selected.price;
      this.selected = this.cart.selected;
    },
    popShow: function () {
      $("#cover").show();
    },
    popHide: function () {
      $("#cover").hide();
    },
    // 下单，跳转
    submit: function () {
      var me = this;
      this.$router.push({
        name: 'create',
        params: {
          cart: me.cart
        }
      })
    }
  }
}
</script>
<style>
  .footer {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: #333;
    z-index: 998;
  }
  .product-type {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    padding-left: 10px;
    border: 1px solid #ff8400;
    border-width: 0 0 0 4px;
    margin: 20px 0px 5px 0px;
  }
  .left-menu {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 5px 0px;
  }
  .left-menu > a {
    display: inline-block;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: #666;
  }
  .left-menu:hover, .left-menu:active {
    background-color: #FF8400;
  }
  .left-menu > a:hover, .left-menu > a:active {
    color: #fff;
  }
  #cover {
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(150, 150, 150, 0.6);
    z-index: 996;
    position: fixed;
    top: 0px;
    left: 0px;
  }
  .badge {
    position: absolute;
    top: -10px;
    left: 50px;
    z-index: 999;
  }
  .cart, .cart:active, .cart:focus, .cart:hover {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 20px;
    bottom: 10px;
    border-radius: 100%;
    padding: 5px;
    text-align: center;
    color: #ffffff;
    background-color: #FF8400;
    border-color: #FF8400;
    font-size: 25px;
    line-height: 25px;
    z-index: 998;
  }
  .submitBtn, .submitBtn:hover {
    width: 100px;
    height: 40px;
    position: absolute;
    right: 20px;
    bottom: 5px;
    color: #ffffff;
    background-color: #FF8400;
    border-color: #FF8400;
    padding: 0px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
  }
  .cart-div {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-width: 0 0 1px 0;
  }
  .last-cart-div {
    width: 100%;
    height: 40px;
    border: 0px;
  }
  .cart-name {
    width: 35%;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
  }
  .cart-price {
    width: 20%;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
  }
  .cart-btn, .cart-btn:hover {
    width: 20px;
    height: 20px;
    margin-top: 10px;
    padding: 0px;
    color: #fff;
    background-color: #FF8400;
    border-radius: 100%;
    border-width: 0px;
  }
  .cart-count {
    width: 20px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
  }
  .total-price {
    display: inline-block;
    position: absolute;
    left: 100px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
  }
  .description {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    line-height: 30px;
    height: 30px;
    margin-top: 5px;
  }
  .button {
    padding: 0px;
    float: right;
    width: 30px;
    height: 30px;
    font-size: 24px;
  }
  .image {
    height: 100px;
    width: 100px;
    display: inline-block;
    margin: 10px 0 0 10px;
  }
  .card-div {
    width: 60%;
    height: 100px;
    margin: 10px 0 0 10px;
    padding: 0px;
    position: absolute;
    display: inline-block;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
</style>