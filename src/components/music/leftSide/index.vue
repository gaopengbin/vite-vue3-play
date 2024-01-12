<template>
  <div class="left-menu">
    <n-menu :options="menuOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { RouterLink } from "vue-router";
const menuOptions = ref([
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "mainPage",
            params: {
              // lang: "zh-CN",
            },
          },
        },
        { default: () => "为我推荐" }
      ),
    key: "recommend",
  },
  {
    label: "排行榜",
    key: "rank",
  },
  {
    label: "歌单",
    key: "songList",
  },
  {
    label: "主播电台",
    key: "radio",
  },
  {
    label: "歌手",
    key: "singer",
  },
  {
    label: "新碟上架",
    key: "newAlbum",
  },
]);
</script>

<style lang="scss" scoped>
.left-menu {
  width: 160px;
  text-align: left;
}
</style>
