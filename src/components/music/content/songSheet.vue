<template>
  <div>
    <h1>{{ detail.name }}</h1>
    <songList :songlist="detail.tracks" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { playListDetail } from "../../../api/api";
import songList from "./songList.vue";

// const props = defineProps<{
//   id: string;
// }>(); // 传入的歌单id

const detail: any = ref({});

const route = useRoute();

watch(
  () => route.query.id,
  (val) => {
    console.log(val);
    if (val) {
      getSongSheetDetail(val);
      // getSongListDetail(val).then((res) => {
      //   console.log(res);
      // });
    }
  }
);

const getSongSheetDetail = (id: string) => {
  playListDetail(id).then(({ data }) => {
    console.log(data);
    let tracks = data.playlist.tracks.map((item: any) => {
      return {
        cover: item.al.picUrl,
        title: item.name,
        singer: item.ar.map((subItem: any) => subItem.name).join(","),
        album: item.al.name,
        time: item.dt,
        id: item.id,
        mv: item.mv,
      };
    });
    data.playlist.tracks = tracks;
    detail.value = data.playlist;
  });
};

onMounted(() => {
  console.log(route);
  if (route.query.id) {
    getSongSheetDetail(route.query.id);
  }
});
</script>

<style scoped></style>
