<template>
  <div id="new">
    <div id="card-head">
      <el-carousel :interval="3000" height="300px" arrow="never" indicator-position="outside">
        <el-carousel-item v-for="item in new5" :key="item.productId">
          <img :src="'/pf/' + item.pictures[0].path" @click="showOne(item.productId)" />
          <label class="new-label">{{ item.productName }}</label>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data: function () {
    return {
      new5: []
    }
  },
  created: function () {
    this.showNew5();
  },
  methods: {
    showNew5: function () {
      var me = this;
      $.ajax({
          url: "/pf/product/c/new5",
          type: "get",
          contentType: "application/json",
          success: function (data) {
            console.log(data);
            me.new5 = data.data;
          }
      });
    },
    showOne: function (id) {
      console.log(id);
    }
  }
}
</script>

<style>
#card-head {
  margin-top: 10px;
}
.new-label {
  color: #fff;
  position: absolute;
  bottom: 0px;
  display: inline-block;
  width: 100%;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  z-index: 99;
}
.el-carousel__item img {
  height: 300px;
  width: 100%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>