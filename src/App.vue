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