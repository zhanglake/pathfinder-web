<template>
  <div class="order">
    <el-collapse value="1">
      <el-collapse-item name="1">
        <template slot="title">
          <span style="font-size: 18px;padding-left: 10px;font-weight: 900;"><i class="el-icon-search"></i> 查询条件</span>
        </template>
        <el-form ref="searchForm" :model="searchParam" size="small" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="订单编号">
                <el-input v-model="searchParam.orderCode" style="width: 300px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单状态">
                <el-select v-model="searchParam.statusInt" clearable placeholder="请选择" style="width: 300px;">
                  <el-option value="" label="全部"></el-option>
                  <el-option value="0" label="已创建"></el-option>
                  <el-option value="1" label="已付款"></el-option>
                  <el-option value="2" label="已确认"></el-option>
                  <el-option value="3" label="发货中"></el-option>
                  <el-option value="4" label="已完成"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="订单日期">
                <el-date-picker v-model="searchParam.createdDate" type="datetimerange" :picker-options="timePickerOptions"
                  range-separator="--" start-placeholder="查询开始日期" end-placeholder="查询结束日期" align="right"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" @click="findOrderTable">查 询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 订单列表和分页 -->
    <el-table v-loading="tableLoading" :data="orderTable" @row-click="showOne" style="width: 100%;margin: 15px auto;">
      <el-table-column prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column prop="createdDate" label="订单日期" :formatter="formatDay"></el-table-column>
      <el-table-column prop="createdDate" label="订单时间" :formatter="formatTime"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :class="'status status-' + scope.row.statusInt">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="width: 80%;margin: auto;padding:20px 0;">
      <el-pagination @current-change="handleCurrentChange" :current-page="searchParam.pageNumber" 
        :page-size="searchParam.pageSize" layout="total, prev, pager, next, jumper" :total="tableTotal">
      </el-pagination>
    </el-row>
    
    <!-- 订单详情弹出框 -->
    <el-dialog title="订单详情" v-loading="detailDialogLoading" :visible="detailDialogVisble">
      <el-row>
        <el-col :span="24" style="font-size: 16px;line-height: 20px;border: 1px solid #ff8400;border-width: 0 0 0 4px;padding-left: 30px;margin: 10px 0;">
          订单信息
          <span :class="'status-dialog status-' + order.statusInt" style="margin-left: 10px;">{{ order.status }}</span>
        </el-col>
        <el-col :span="12">
          <div style="height: 30px;line-height: 30px;">
            订单编号：
            <span style="margin-left: 10px;">{{ order.orderCode }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="height: 30px;line-height: 30px;">
            订单时间：
            <span style="margin-left: 10px;">{{ order.createdDate }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="font-size: 16px;line-height: 20px;border: 1px solid #ff8400;border-width: 0 0 0 4px;padding-left: 30px;margin: 10px 0;">客户信息</el-col>
        <el-col :span="12">
          <div style="height: 30px;line-height: 30px;">
            客户姓名：
            <span style="margin-left: 10px;">{{ customer.customerName }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="height: 30px;line-height: 30px;">
            联系方式：
            <span style="margin-left: 10px;">{{ customer.phone }}</span>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="height: 30px;line-height: 30px;">
            收货地址：
            <span style="margin-left: 10px;">{{ customer.address }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="font-size: 16px;line-height: 20px;border: 1px solid #ff8400;border-width: 0 0 0 4px;padding-left: 30px;margin: 10px 0;">商品信息</el-col>
        <el-col :span="24">
          <el-table :data="orderDetailTable">
            <el-table-column prop="product.productName" label="商品名称"></el-table-column>
            <el-table-column prop="count" label="订购数量" :formatter="formatCount"></el-table-column>
            <el-table-column prop="price" label="售价" :formatter="formatPrice"></el-table-column>
            <el-table-column prop="countPrice" label="小计" :formatter="formatPrice"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="order.statusInt < 2" type="success" @click="confirmOrder(order.orderId)">确认订单</el-button>
        <el-button v-show="order.statusInt == 2" type="success" @click="deliverOrder(order.orderId)">发 货</el-button>
        <el-button type="primary" @click="detailDialogVisble = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import '../../global/global.js'
export default {
  data () {
    return {
      tableLoading: false,
      detailDialogLoading: false,
      detailDialogVisble: false,
      searchParam: {
        pageSize: 10,
        pageNumber: 1,
        orderCode: '',
        createdDate: '',
        statusInt: ''
      },
      tableTotal: 10,
      timeRange: [],
      orderTable: [],
      customer: {},
      order: {},
      orderDetailTable: [],
      timePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created: function () {
    this.findOrderTable();
  },
  methods: {
    findOrderTable: function () {
      this.tableLoading = true;
      var param = {
        pageSize: this.searchParam.pageSize,
        pageNumber: this.searchParam.pageNumber,
        orderCode: this.searchParam.orderCode,
        createdDateStart: this.searchParam.createdDate && this.searchParam.createdDate.length > 1 ? this.searchParam.createdDate[0] : null,
        createdDateEnd: this.searchParam.createdDate && this.searchParam.createdDate.length > 1 ? this.searchParam.createdDate[1] : null,
        statusInt: this.searchParam.statusInt
      };
      var me = this;
      $.ajax({
        url: "/pf/order/list",
        type: "post",
        data: JSON.stringify(param),
        contentType: "application/json",
        success: function (data) {
          me.tableTotal = data.totalRecord;
          me.searchParam.pageNumber = data.pageNo + 1;
          console.log(me.searchParam);
          me.orderTable = data.results;
          for (var i = 0; i < me.orderTable.length; i ++) {
            me.orderTable[i].status = me.formatStatus(me.orderTable[i].statusInt);
          }
          me.tableLoading = false;
        },
        error: function () {
          me.tableLoading = false;
        }
      });
    },
    formatDay: function (row, column, cellValue) {
      return global.FORMAT_DAY(row.createdDate);
    },
    formatTime: function (row, column, cellValue) {
      return global.FORMAT_TIME(row.createdDate);
    },
    formatStatus: function (statusInt) {
      switch (statusInt) {
        case 0: return '已创建';break;
        case 1: return '已付款';break;
        case 2: return '已确认';break;
        case 3: return '发货中';break;
        case 4: return '已完成';break;
      }
    },
    showOne: function (row, event, column) {
      var orderId = row.orderId;
      this.detailDialogLoading = true;
      this.detailDialogVisble = true;
      var me = this;
      $.ajax({
        url: "/pf/order/one/" + orderId,
        type: "get",
        contentType: "application/json",
        success: function (data) {
          me.customer = data.data.customer;
          me.order = data.data;
          me.order.createdDate = global.FORMAT_DATE(me.order.createdDate);
          me.order.status = me.formatStatus(me.order.statusInt);
          me.orderDetailTable = data.data.orderDetails;
          me.detailDialogLoading = false;
        }
      });
    },
    showOneByOrderId: function (orderId) {
      this.detailDialogLoading = true;
      this.detailDialogVisble = true;
      var me = this;
      $.ajax({
        url: "/pf/order/one/" + orderId,
        type: "get",
        contentType: "application/json",
        success: function (data) {
          me.customer = data.data.customer;
          me.order = data.data;
          me.order.createdDate = global.FORMAT_DATE(me.order.createdDate);
          me.order.status = me.formatStatus(me.order.statusInt);
          me.orderDetailTable = data.data.orderDetails;
          me.detailDialogLoading = false;
        }
      });
    },
    formatCount: function (row, column, cellValue) {
      return 'x ' + cellValue
    },
    formatPrice: function (row, column, cellValue) {
      return '￥ ' + cellValue
    },
    confirmOrder: function (orderId) {
      var me = this;
      if (orderId) {
        this.$confirm('确认此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: "/pf/order/changestatus/" + orderId + "/2",
            type: "get",
            contentType: "application/json",
            success: function (data) {
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              });
              me.findOrderTable();
              me.showOneByOrderId(orderId);
            }
          });
        }).catch(() => {});
      }
    },
    deliverOrder: function (orderId) {
      var me = this;
      if (orderId) {
        this.$confirm('发货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: "/pf/order/changestatus/" + orderId + "/3",
            type: "get",
            contentType: "application/json",
            success: function (data) {
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              });
              me.findOrderTable();
              me.showOneByOrderId(orderId);
            }
          });
        }).catch(() => {});
      }
    },
    handleCurrentChange: function (current) {
      this.searchParam.pageNumber = current;
      this.findOrderTable();
    }
  }
}
</script>
<style>
.status {
  display: inline-block !important;
  width: 60px !important;
  height: 30px !important;
  font-size: 12px !important;
  border-radius: 15px !important;
  line-height: 30px !important;
  text-align: center !important;
  color: #fff !important;
  margin-left: -10px !important;
}
.status-0 { background-color: #1ab394}
.status-1 { background-color: #1ab394}
.status-2 { background-color: #FB3301}
.status-3 { background-color: #ff8400}
.status-4 { background-color: #818385}

.status-dialog {
    display: inline-block !important;
    width: 50px !important;
    height: 20px !important;
    font-size: 10px !important;
    border-radius: 10px !important;
    line-height: 20px !important;
    text-align: center !important;
    color: #fff !important;
}
</style>