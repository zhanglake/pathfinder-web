// 日期时间format
global.FORMAT_DATE = function getLocalTime(str) {
  var oDate = new Date(str),  
  oYear = oDate.getFullYear(),  
  oMonth = oDate.getMonth()+1,  
  oDay = oDate.getDate(),  
  oHour = oDate.getHours(),  
  oMin = oDate.getMinutes(),  
  oSen = oDate.getSeconds(),  
  oTime = oYear +'-'+ global.getzf(oMonth) +'-'+ global.getzf(oDay) +' '+ global.getzf(oHour) +':'+ global.getzf(oMin) +':'+ global.getzf(oSen);
  return oTime;
};
global.FORMAT_DAY = function getLocalTime(str) {
  var oDate = new Date(str),  
  oYear = oDate.getFullYear(),  
  oMonth = oDate.getMonth() + 1,  
  oDay = oDate.getDate(),  
  oHour = oDate.getHours(),  
  oMin = oDate.getMinutes(),  
  oSen = oDate.getSeconds(),  
  oTime = oYear +'-'+ global.getzf(oMonth) +'-'+ global.getzf(oDay);
  return oTime;
};
global.FORMAT_TIME = function getLocalTime(str) {
  var oDate = new Date(str),  
  oYear = oDate.getFullYear(),  
  oMonth = oDate.getMonth() + 1,  
  oDay = oDate.getDate(),  
  oHour = oDate.getHours(),  
  oMin = oDate.getMinutes(),  
  oSen = oDate.getSeconds(),  
  oTime = global.getzf(oHour) +':'+ global.getzf(oMin) +':'+ global.getzf(oSen);
  return oTime;
};
// 日期补0操作
global.getzf = function (num) {
  if(parseInt(num) < 10){  
    num = '0' + num;  
  }  
  return num;  
}


// 客户登录信息
global.CURRENT_CUSTOMER = {
  id: '',
  name: '',
  phone: '',
  address: ''
};


// 管理员登录信息
global.CURRENT_ADMIN = {
  id: '',
  name: ''
}