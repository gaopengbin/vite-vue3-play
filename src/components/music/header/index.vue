<template>
  <div class="music-header">
    <n-avatar round :size="48" :src="logo" /> <span class="title">网易云音乐</span>
    <n-input placeholder="搜索" @keyup="handleKeyup">
      <template #prefix>
        <n-icon :component="FlashOutline" />
      </template>
    </n-input>
    <User />
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { FlashOutline } from "@vicons/ionicons5";
import axios from "axios";
import { ref } from "vue";
import User from "./user.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    console.log(router.currentRoute);
    if (router.currentRoute.value.path === "/music/search") {
      router.push({ query: { keywords: e.target.value } });
      return;
    }
    router.push({ path: "music/search", query: { keywords: e.target.value } });
  }
};
</script>

<style lang="scss" scoped>
.music-header {
  display: flex;
  align-items: center;
  padding: 5px;
  .title {
    font-size: 20px;
    margin-left: 10px;
  }
  .n-input {
    margin-left: 120px;
    width: 300px;
  }
}
</style>
