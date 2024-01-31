<template>
  <n-layout id="my-music">
    <n-layout-header style="background-color: red"><Header /></n-layout-header>
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 10px;" collapse-mode="width"> <left-side></left-side></n-layout-sider>
      <n-layout-content content-style="padding: 24px;background-color: white"> <RouterView /> </n-layout-content>
    </n-layout>
    <n-layout-footer style="background-color: rgb(177, 171, 171)"><Bottom /></n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import Header from "./header/index.vue";
import LeftSide from "./leftSide/index.vue";
import Bottom from "./bottom/player.vue";
import "./index.scss"
</script>

<style lang="scss" scoped>
.n-layout-sider {
  width: auto !important;
}
</style>
