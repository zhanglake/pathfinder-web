<template>
  <div id="all">
    <el-row>
      <el-col style="width: 80px;padding:0px;position: fixed;">
        <div v-for="tp in typeProducts" class="left-menu" :key="tp.type.typeId">
          <a href="javascript:void(0)" @click="goAnchor('#anchor-' + tp.type.typeId)">{{ tp.type.typeName }}</a>
        </div>
      </el-col>
      <el-col :span="18" style="position: absolute;left: 90px;">
        <el-row>
          <el-col :span="24" v-for="tp in typeProducts" :key="tp.type.typeId">
            <div :id="'anchor-' + tp.type.typeId" :name="tp.type.typeId" class="product-type">{{ tp.type.typeName }}</div>
            <el-col :span="24" v-for="p in tp.products" :key="p.productId">
              <el-card :body-style="{ padding: '0px' }" style="height: 120px;">
                <a @click="showOne(p.productId)">
                  <img :src="'/pf/' + p.pictures[0].path" class="image">
                  <div class="card-div">
                    <span style="display: block;height: 20px;margin: 5px 0 0 0;line-height: 20px;">{{ p.productName }}</span>
                    <div class="bottom clearfix">
                      <label class="description">{{ p.description }}</label>
                    </div>
                    <div style="height: 30px;margin-top: 5px;">
                      <el-button type="text" class="button" @click.stop="addToCart(p)" style="float: right;margin:0 20px 10px 0;font-size: 30px;color: #ff8400;">
                        <i class="el-icon-circle-plus-outline"></i>
                      </el-button>
                      <label style="color: #FF3333;font-weight: 900;"><font style="font-size: 12px;">￥</font>{{ p.salePrice }}</label>
                      <label v-show="p.discount<1" style="color: #aaa;font-weight: 900;font-size: 10px;">
                        <s>￥{{ p.price }}</s>
                      </label>
                    </div>
                  </div>
                </a>
              </el-card>
            </el-col>
          </el-col>
        </el-row>
        <div style="height: 60px;display: block;"></div>
      </el-col>
    </el-row>

    <el-popover ref="popover4" placement="top-start" title="购物车"
      width="300" trigger="click" :visible-arrow="true" @show="popShow" @hide="popHide">
      <div v-show="!cart.selected || cart.selected.length == 0" class="last-cart-div">您还未选购商品</div>
      <el-row>
        <el-col :span="24" v-for="(s, index) in cart.selected" :key="s.id">
          <div :class="index == cart.selected.length - 1 ? 'last-cart-div' : 'cart-div'">
            <span class="cart-name">{{ s.name }}</span>
            <span class="cart-price">
              <font style="color: #FF3333;font-weight: 900;font-size: 16px;"><font style="font-size: 12px;">￥</font>{{ s.countSalePrice }}</font>
              <font v-show="s.countPrice>s.countSalePrice" style="font-size: 12px;"><s>￥{{ s.countPrice }}</s></font>
            </span>
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
      <div class="total-price">￥{{ cart.totalSalePrice}} <font v-show="cart.totalPrice>cart.totalSalePrice" style="font-size: 12px;color: #ccc;"><s>￥{{ cart.totalPrice }}</s></font></div>
      <el-button class="submitBtn" @click="submit">去下单</el-button>
    </footer>
    <div id="cover"></div>

    <el-dialog v-loading="detailDialogLoading" top="5vh" :visible.sync="detailDialogVisible" width="80%">
      <div style="margin: -55px -20px -30px -20px;">
        <el-carousel :interval="2000" indicator-position="none" :arrow="productDetail.pictures && productDetail.pictures.length > 1 ? 'always' : 'never'" height="300px">
          <el-carousel-item v-for="pic in productDetail.pictures" :key="pic.fileId">
            <img :src="'/pf/' + pic.path" style="width: 300px;height: 300px;" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div style="margin: 30px 0 0 0;">
        <div style="line-height: 40px;font-size: 18px;font-weight: 900;vertical-align: middle;">
          {{ productDetail.productName }}
        </div>
        <div style="max-height: 60px;line-height: 20px;font-size: 14px;color: #aaa;">
          <label v-show="productDetail.discount<1" class="discount-label">{{ productDetail.discountName }}</label>
          {{ productDetail.description }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="line-height: 40px;color: #FF3333;font-size: 18px;font-weight: 900;float: left;">
          <font style="font-size: 14px;">￥</font>{{ productDetail.salePrice }}
          <font style="font-size: 12px;color: #aaa;font-weight: 500;"><s>￥{{ productDetail.price }}</s></font>
        </div>
        <el-button type="primary" @click="addToCart(productDetail)">添加至购物车</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data: function () {
    return {
      detailDialogVisible: false,
      detailDialogLoading: false,
      currentDate: new Date(),
      typeProducts: [],
      selected: [],
      cart: this.$route.params.cart ? this.$route.params.cart :{
        totalPrice: 0,
        totalSalePrice: 0,
        totalCount: 0,
        selected: this.selected
      },
      productDetail: {}
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
      var loading = this.$loading();
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
    // 获取单个产品详细信息
    showOne: function (productId) {
      var me = this;
      me.detailDialogVisible = true;
      me.detailDialogLoading = true;
      $.ajax({
        url: "/pf/product/one/" + productId,
        type: "get",
        contentType: "application/json",
        success: function (data) {
          console.log(data.data);
          me.productDetail = data.data;
          switch (me.productDetail.discount) {
            case 0.95: me.productDetail.discountName = '9.5折';break;
            case 0.9: me.productDetail.discountName = '9折';break;
            case 0.85: me.productDetail.discountName = '8.5折';break;
            case 0.8: me.productDetail.discountName = '8折';break;
            case 0.75: me.productDetail.discountName = '7.5折';break;
            case 0.7: me.productDetail.discountName = '7折';break;
            case 0.65: me.productDetail.discountName = '6.5折';break;
            case 0.6: me.productDetail.discountName = '6折';break;
            case 0.55: me.productDetail.discountName = '5.5折';break;
            case 0.5: me.productDetail.discountName = '5折';break;
            case 1: me.productDetail.discountName = '10折';break;
          }
          me.detailDialogLoading = false;
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
          this.selected[i].countSalePrice = this.selected[i].salePrice * this.selected[i].count;
          this.selected[i].countPrice = this.selected[i].price * this.selected[i].count;
          break;
        }
      }
      if (!isSelected) {
        var count = 1;
        var countSalePrice = product.salePrice * count;
        var countPrice = product.price * count;
        var s = {
          id: product.productId,
          name: product.productName,
          count: count,
          salePrice: product.salePrice,
          price: product.price,
          countSalePrice: countSalePrice,
          countPrice: countPrice
        }
        this.selected.push(s);
      }
      this.cart.selected = this.selected;
      this.cart.totalCount = 0;
      this.cart.totalPrice = 0;
      this.cart.totalSalePrice = 0;
      for (var i = 0; i < this.selected.length; i ++) {
        this.cart.totalCount += this.selected[i].count;
        this.cart.totalPrice += this.selected[i].countPrice;
        this.cart.totalSalePrice += this.selected[i].countSalePrice;
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
        selected.countSalePrice = selected.salePrice * selected.count;
        this.cart.totalCount --;
        this.cart.totalSalePrice -= selected.salePrice;
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
      selected.countSalePrice = selected.salePrice * selected.count;
      this.cart.totalCount ++;
      this.cart.totalSalePrice += selected.salePrice;
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
    top: -20px;
    left: 60px;
    z-index: 999;
  }
  .cart, .cart:active, .cart:focus, .cart:hover {
    width: 60px !important;
    height: 60px !important;
    position: absolute !important;
    left: 20px !important;
    bottom: 10px !important;
    border-radius: 100% !important;
    padding: 5px !important;
    text-align: center !important;
    color: #ffffff !important;
    background-color: #FF8400 !important;
    border-color: #FF8400 !important;
    font-size: 25px !important;
    line-height: 25px !important;
    z-index: 998 !important;
  }
  .submitBtn, .submitBtn:hover {
    width: 100px !important;
    height: 40px !important;
    position: absolute !important;
    right: 20px !important;
    bottom: 5px !important;
    color: #ffffff !important;
    background-color: #FF8400 !important;
    border-color: #FF8400 !important;
    padding: 0px !important;
    line-height: 40px !important;
    text-align: center !important;
    font-size: 18px !important;
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
    width: 30%;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 5px;
  }
  .cart-btn, .cart-btn:hover {
    width: 25px !important;
    height: 25px !important;
    margin-top: 8px !important;
    padding: 0px !important;
    color: #fff !important;
    background-color: #FF8400 !important;
    border-radius: 100% !important;
    border-width: 0px !important;
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
    height: 40px;
    display: inline-block;
    overflow: hidden;
    width: 120px;
  }
  .bottom {
    line-height: 20px;
    height: 40px;
    margin-top: 5px;
  }
  .button {
    padding: 0px !important;
    float: right !important;
    width: 30px !important;
    height: 30px !important;
    font-size: 24px !important;
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
  .discount-label {
    width: 40px;
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    display: inline-block;
    margin: 0;
    text-align: center;
    background-color: #ff8300;
    color: #fff;
    border-radius: 5px;
  }
</style>