<template>
  <n-layout has-sider>
    <n-layout-sider content-style="padding: 24px;"> <left-side></left-side> </n-layout-sider>
    <n-layout>
      <n-layout-header>颐和园路</n-layout-header>
      <n-layout-content content-style="padding: 24px;"> 平山道 </n-layout-content>
      <n-layout-footer>成府路</n-layout-footer>
    </n-layout>
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
import { FlashOutline } from "@vicons/ionicons5";
import axios from "axios";
import { ref } from "vue";
import LeftSide from "./leftSide/index.vue";
const albums = ref([]);
const artists = ref([]);
const songs = ref([]);
const handleKeyup = (e: KeyboardEvent) => {
  console.log(e);
  if (e.key === "Enter") {
    console.log("回车", e.target.value);
    axios.get("/api/search/multimatch?keywords=" + e.target.value).then((res) => {
      console.log(res);
      albums.value = res.data.result.album;
      artists.value = res.data.result.artist;
    });
    axios.get("/api/search?keywords=" + e.target.value).then((res) => {
      console.log(res.data);
      songs.value = res.data.result.songs;
    });
  }
};
</script>

<style scoped>
.n-card {
  width: 200px;
}
</style>
