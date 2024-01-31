<template>
  <div>
    <n-card v-for="item in artists">
      <template #cover>
        <img :src="item.img1v1Url" />
      </template>
    </n-card>
    <SongList :songlist="songs" />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch, watchEffect } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import SongList from "./songList.vue";
import { cloudsearch } from "@/api/api";
const route = useRoute();
const albums = ref([]);
const artists = ref([]);
const songs = ref([]);
let keywords = route.query.keywords;

onBeforeRouteUpdate((to, from, next) => {
  keywords = to.query.keywords;
  searth();
  next();
});

const searth = () => {
  cloudsearch({ keywords: keywords, offset: 0, limit: 30, type: "1" }).then((res) => {
    songs.value = res.data.result.songs.map((item: any) => {
      const names = item.ar.map((subItem: any) => subItem.name).join(",");
      return {
        cover: item.al.picUrl,
        title: item.name,
        singer: names,
        album: item.al.name,
        time: item.dt,
        id: item.id,
        mv: item.mv,
      };
    });
  });
  axios.get("/api/search/multimatch?keywords=" + keywords).then((res) => {
    albums.value = res.data.result.album;
    artists.value = res.data.result.artist;
  });
  //   axios.get("/api/search?keywords=" + keywords).then((res) => {
  //     console.log(res.data);
  //     songs.value = res.data.result.songs;
  //   });
};
searth();
</script>

<style scoped>
.n-card {
  width: 100px;
}
</style>
