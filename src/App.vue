<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data: function () {
    return {}
  },
  created: function () {
    $("html").prepend('<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />');
  }
}
</script>
<style>
/* Montserrat */
@import url(http://fonts.googleapis.com/css?family=Montserrat:400,700);
/* Open Sans */
@import url(http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,600,700,800,300);
/* Icons */
/* @import url(https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css); */
</style>