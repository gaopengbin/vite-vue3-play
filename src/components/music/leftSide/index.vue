<template>
  <div>
    <n-avatar round :size="48" :src="logo" /> <span>网易云音乐</span>
    <n-anchor :show-rail="false" :show-background="false">
      <n-anchor-link title="演示" href="#演示">
        <n-anchor-link title="基础用法" href="#basic.vue" />
        <n-anchor-link title="忽略间隔" href="#ignore-gap.vue" />
        <n-anchor-link title="固定" href="#affix.vue" />
        <n-anchor-link title="滚动到" href="#scrollto.vue" />
      </n-anchor-link>
      <n-anchor-link title="API" href="#API" />
    </n-anchor>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
</script>

<style scoped></style>
