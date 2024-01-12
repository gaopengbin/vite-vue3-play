<template>
  <n-layout id="my-music">
    <n-layout-header style="background-color: red"><Header /></n-layout-header>
    <n-layout has-sider>
      <n-layout-sider content-style="padding: 10px;" collapse-mode="width"> <left-side></left-side></n-layout-sider>
      <n-layout-content content-style="padding: 24px;background-color: pink"> <RouterView /> </n-layout-content>
    </n-layout>
    <n-layout-footer style="background-color: rgb(177, 171, 171)"><Bottom /></n-layout-footer>
  </n-layout>

  <!-- <div>
    <n-input placeholder="搜索" @keyup="handleKeyup">
      <template #prefix>
        <n-icon :component="FlashOutline" />
      </template>
    </n-input>
    <n-card :title="item.name" v-for="item in artists">
      <template #cover>
        <img :src="item.img1v1Url" />
      </template>
    </n-card>
    <n-virtual-list style="max-height: 240px" :item-size="42" :items="songs">
      <template #default="{ item }">
        <div :key="item.id" class="item" style="height: 42px">
          <span> {{ item.name }}</span>
        </div>
      </template>
    </n-virtual-list>
  </div> -->
</template>

<script setup lang="ts">
import Header from "./header/index.vue";
import LeftSide from "./leftSide/index.vue";
import Bottom from "./bottom/player.vue";
</script>

<style scoped>
.n-layout-sider {
  width: auto !important;
}
</style>
