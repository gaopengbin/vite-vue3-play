<template>
  <div class="user">
    <n-avatar round :size="24" :src="logo" /> <span class="username">{{ username }}</span>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
const username = "laogao";
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  margin-left: auto;
  .username {
    margin-left: 10px;
  }
}
</style>
