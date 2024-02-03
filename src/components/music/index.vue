<template>
  <n-layout id="my-music">
    <n-layout-header class="music-header"><Header /></n-layout-header>
    <n-layout has-sider>
      <n-layout-sider class="music-left" content-style="padding: 10px;" collapse-mode="width"> <left-side></left-side></n-layout-sider>
      <n-layout-content class="music-content" content-style="padding: 24px;"> <RouterView /> </n-layout-content>
    </n-layout>
    <n-layout-footer class="music-footer"><Bottom /></n-layout-footer>
  </n-layout>
</template>

<script setup lang="ts">
import Header from "./header/index.vue";
import LeftSide from "./leftSide/index.vue";
import Bottom from "./bottom/player.vue";
import "./index.scss";
</script>

<style lang="scss" scoped>
.n-layout-sider {
  width: auto !important;
}
</style>
