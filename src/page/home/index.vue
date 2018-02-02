<template>
  <main>
    <div id="home">
      <el-row>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-tickets"></i> 待处理</span>
            <a href="/#/sale/order"><h3 id="order1" style="color: #ef4836;"></h3></a>
            <span class="diff">
              今日待处理 <b id="today-to-deal" style="color: #ef4836;"></b> 单
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-check"></i> 待确认</span>
            <a href="/#/sale/order"><h3 id="order2" style="color: #26a65b;"></h3></a>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-sold-out"></i> 待发货</span>
            <a href="/#/sale/order"><h3 id="order3" style="color: #333333;"></h3></a>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-date"></i> 今日订单数</span>
            <h3 id="order4" style="color: #ef4836;"></h3>
            <span class="diff">
              <font id="count-rate-color"><i id="count-rate-icon"></i><b id="count-rate"></b></font> 较昨日
            </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-edit-outline"></i> 今日成交额</span>
            <h3 id="order5" style="color: #f39c12;"></h3>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="order-div">
            <span class="div-title"><i class="el-icon-time"></i> 昨日订单数</span>
            <h3 id="order6" style="color: #33577b;"></h3>
          </div>
        </el-col>
        <el-col :span="14" style="border-top: 10px solid #E9ECF1;">
          <div id="calendar" style="width: 100%;height: 500px;margin: auto;padding-top: 20px;"></div>
        </el-col>
        <el-col :span="10" style="border-top: 10px solid #E9ECF1;">
          <el-table v-loading="tableLoading" :data="topOrders" style="width: 100%;margin-top: 20px;padding: 0 0 0 20px;font-size: 12px;">
            <el-table-column prop="code" label="订单编号"></el-table-column>
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span :class="'status status-' + scope.row.statusInt">{{ scope.row.status }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </main>
</template>
<script>
import $ from 'jquery'
import '../../global/global.js'
export default {
  data: function () {
    return {
      reportData: {},
      calendarData: [],
      topOrders: [],
      tableLoading: false
    }
  },
  created: function () {
    this.getReportData();
    this.getTableData();
  },
  mounted: function () {},
  methods: {
    getTableData: function () {
      var me = this;
      me.tableLoading = true;
      $.get("/pf/order/ten", function (data) {
        console.log(data.data);
        var orders = [];
        for (var i = 0; i < data.data.length; i ++) {
          orders.push({
            code: data.data[i].orderCode,
            date: global.FORMAT_DATE(data.data[i].createdDate),
            statusInt: data.data[i].statusInt,
            status: global.CHANGE_STATUS(data.data[i].statusInt)
          });
        }
        me.topOrders = orders;
        me.tableLoading = false;
      });
    },
    getReportData: function () {
      var me = this;
      $.get("/pf/report/countprice", function (data) {
        me.reportData = data.data;
        var cd = data.data.calendarDatas;
        var calendar = [];
        var range = '';
        for (var i = 0; i < cd.length; i ++) {
          calendar.push([cd[i].year + '-' +  cd[i].month + '-' + cd[i].day, cd[i].day, cd[i].count]);
          range = cd[i].year + '-' +  cd[i].month;
        }
        me.calendarData = calendar;

        me.drawCalendar(range, me.calendarData);
        me.showStatusOrders();
        me.showTodayOrders();
      });
    },
    drawCalendar: function (range, calendarData) {
      var myChart = this.$echarts.init(document.getElementById('calendar'), 'light');
      myChart.setOption({
        tooltip: {
          formatter: function (params) {
            return '订单数量：' + params.value[2];
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 5,
          calculable: true,
          seriesIndex: [2],
          orient: 'horizontal',
          left: 'center',
          bottom: 20,
          inRange: {
            color: ['#e0ffff', '#006edd'],
            opacity: 0.5
          },
          controller: {
            inRange: {
              opacity: 0.5
            }
          }
        },
        calendar: [{
          left: 'center',
          top: 'middle',
          range: range,
          orient: 'vertical',
          width: '90%',
          height: '80%',
          dayLabel: {
            nameMap: 'cn',
            color: '#333',
            fontWeight: '700',
            fontFamily: 'Microsoft YaHei',
            fontSize: 16,
            margin: 20
          },
          monthLabel: { show: false },
          yearLabel: { show: false },
          splitLine: { show: false },
          itemStyle: { borderColor: '#fff', borderWidth: '4' }
        }],
        series: [{
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                return params.value[1] + '\n\n\n';
              },
              textStyle: {
                fontSize: 14,
                color: '#000'
              }
            }
          },
          data: calendarData
        }, {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          label: {
            normal: {
              show: true,
              formatter: function (params) {
                var str = '';
                if (params.value[2]) {
                  str = params.value[2] + '单';
                }
                return '\n' + str;
              },
              textStyle: {
                fontSize: 14,
                fontWeight: 700,
                color: '#ff8400'
              }
            }
          },
          data: calendarData
        }, {
          name: '订单数量',
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: calendarData
        }]
      });
    },
    showStatusOrders: function () {
      var statusOrder = this.reportData.statusOrder;
      var toDealOrders = 0;
      var toConfirmOrders = 0;
      var toDeliverOrders = 0;
      for (var i = 0; i < statusOrder.length; i ++) {
        if (statusOrder[i].status < 3) {
          toDealOrders += statusOrder[i].count;
        }
        if (statusOrder[i].status < 2) {
          toConfirmOrders += statusOrder[i].count;
        }
        if (statusOrder[i].status == 2) {
          toDeliverOrders += statusOrder[i].count;
        }
      }
      var todayToDealOrderCount = this.reportData.todayToDealOrderCount;
      $("#today-to-deal").html(todayToDealOrderCount);
      $("#order1").html(toDealOrders);
      $("#order2").html(toConfirmOrders);
      $("#order3").html(toDeliverOrders);
    },
    showTodayOrders: function () {
      var toc = this.reportData.todayOrderData.orderCount;
      var yoc = this.reportData.yesterdayOrderData.orderCount;
      var rate = 0;
      if (yoc > 0 && toc > yoc) {
        rate = (((toc - yoc) / yoc) * 100).toFixed(2) + '%';
        $("#count-rate-icon").removeClass('el-icon-caret-bottom').addClass('el-icon-caret-top');
        $("#count-rate-color").removeClass('color-down').addClass('color-up');
      } else if (yoc > 0 && toc < yoc) {
        rate = (((yoc - toc) /  yoc) * 100).toFixed(2) + '%';
        $("#count-rate-icon").removeClass('el-icon-caret-top');
        $("#count-rate-icon").addClass('el-icon-caret-bottom');
        $("#count-rate-color").removeClass('color-up').addClass('color-down');
      } else {
        rate = '0%'
        $("#count-rate-icon").removeClass('el-icon-caret-top').removeClass('el-icon-caret-bottom');
        $("#count-rate-color").removeClass('color-up').removeClass('color-down');
      }
      $("#count-rate").html(rate);
      $("#order4").html(toc);
      $("#order5").html('￥' + this.reportData.todayOrderData.orderPrice);
      $("#order6").html(yoc);
    },
    setCircleOption: function (item, name, value, color) {
      item.setOption({
        legend: { show: false },
        series: [{
          name: name,
          type: 'pie',
          radius: ['70%', '80%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function () { return name + '\n\n' + value; },
              textStyle: { fontSize: 18 }
            }
          },
          itemStyle: { color: color },
          data:[{value: value, name:name}]
        }]
      });
    }
  }
}
</script>
<style>
#home {
  width: 100%;
  background-color: #fff;
}
.span1 {
  display: inline-block;
  width: 100%;
  font-size: 30px;
  font-weight: 100;
  font-family: '微软雅黑';
  line-height: 100px;
  text-align: center;
}
.a {
  display: inline-block;
  color: #FB3301;
  width: 50px;
}
.order-div {
  padding: 10px 5px;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}
.div-title {
  color: #37363e;
  display: block;
  text-align: center;
  margin: 10px 0 5px 0;
}
.order-div a {
  text-decoration: none;
}
.order-div h3 {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -1px;
  line-height: normal;
  margin: 1px 0 5px 0;
}
.diff {
  color: #76747a;
  font-size: 14px;
}
.color-down {
  color: #26a65b;
}
.color-up {
  color: #ef4836;
}
.status {
  display: inline-block !important;
  height: 20px !important;
  font-size: 13px !important;
  border-radius: 4px !important;
  line-height: 20px !important;
  text-align: center !important;
  color: #fff !important;
  margin-left: -10px !important;
  padding: 1px 6px !important;
  font-weight: 200 !important;
}
.status-0 { background-color: #ef4836}
.status-1 { background-color: #f39c12}
.status-2 { background-color: #51b7a3}
.status-3 { background-color: #399bff}
.status-4 { background-color: #33577b}
</style>