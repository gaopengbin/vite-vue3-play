<template>
  <div class="songList">
    <n-data-table v-if="show" :columns="columns" :data="songs" :bordered="false" :max-height="400" :row-class-name="rowClassName" />
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, watchEffect, watch, ref } from "vue";
import { NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import moment from "moment";
import { storeToRefs } from "pinia";
import { musicStore } from "../../../store/music";
const music = musicStore();
type Song = {
  no: number;
  title: string;
  length: string;
  id: string;
};
const show = ref(true);
const rowClassName = (row: Song) => {
  return row.id === music.songs[music.currentIndex].id ? "current" : "";
};
const createColumns = ({ play }: { play: (row: Song) => void }): DataTableColumns<Song> => {
  return [
    {
      title: "封面",
      key: "cover",
      width: 80,
      render(row) {
        return h("img", { src: row.cover, class: "songcover" });
      },
    },
    {
      title: "标题",
      key: "title",
    },
    {
      title: "歌手",
      key: "singer",
    },
    {
      title: "时长",
      key: "length",
      render(row) {
        return h("span", moment(row.time).format("mm:ss"));
      },
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render(row) {
        return [
          h(
            NButton,
            {
              size: "small",
              onClick: () => {
                play(row);
              },
            },
            { default: () => "播放" }
          ),
          h(
            NButton,
            {
              size: "small",
              onClick: () => {
                remove(row);
              },
            },
            { default: () => "移除" }
          ),
        ];
      },
    },
  ];
};
// const { currentIndex, songs } = storeToRefs(musicStore());
const songs = ref(music.songs);
const currentIndex = ref(music.currentIndex);
music.$subscribe((mutation, state) => {
  songs.value = state.songs;
  show.value = false;
  setTimeout(() => {
    show.value = true;
  }, 0);
  //   currentIndex.value = state.currentIndex;
});
console.log(songs.value);
watch(songs, (val) => {
  console.log(val);
});
const play = (row) => {
  let index = songs.value.findIndex((item) => item.id === row.id);
  currentIndex.value = index;
  music.currentIndex = index;
  console.log(index, songs.value.length);
};
const remove = (row) => {
  console.log(row);
  let index = songs.value.findIndex((item) => item.id === row.id);
  songs.value.splice(index, 1);
  console.log(index, songs.value.length);
};
const columns = createColumns({ play });
</script>

<style lang="scss">
.songcover {
  width: 40px;
  height: 40px;
}
.n-data-table-tr.current {
  .n-data-table-td {
    background-color: #e9a6a6;
  }
}
:deep(.n-data-table-tr.current) {
  background-color: #c71d1d;
}
</style>
