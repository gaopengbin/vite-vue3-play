<template>
  <div class="songList">
    <n-data-table :columns="columns" :data="songlist" :bordered="false" :max-height="400" />
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, watchEffect, watch } from "vue";
import { NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import moment from "moment";
import { songUrl, lyric } from "@/api/api";
import { musicStore } from "../../../store/music";
import { computed } from "vue";
import { storeToRefs } from "pinia";

type Song = {
  no: number;
  title: string;
  length: string;
};
const props = defineProps<{
  songlist: any[];
}>(); // 传入的歌曲列表

const createColumns = ({ play }: { play: (row: Song) => void }): DataTableColumns<Song> => {
  return [
    {
      title: "#",
      key: "index",
      width: 50,
      render(row) {
        return h("span", props.songlist.indexOf(row) + 1);
      },
    },
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
      title: "专辑",
      key: "album",
    },
    {
      title: "时长",
      key: "length",
      render(row) {
        return h("span", moment(row.time).format("mm:ss"));
      },
    },
    {
      title: "Action",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => play(row),
          },
          { default: () => "Play" }
        );
      },
    },
  ];
};
const { songs, currentIndex } = storeToRefs(musicStore());

const play = (row) => {
  const isExisting = songs.value.findIndex((item) => item.id == row.id);
  if (isExisting != -1) {
    currentIndex.value = isExisting;
  } else {
    songUrl(row).then((res) => {
      // console.log(row, res);
      songs.value.push({
        title: row.title,
        singer: row.singer,
        cover: row.cover,
        src: res.data.data[0].url,
        time: row.time,
        album: row.album,
        id: row.id,
        mv: row.mv,
        Lyric: "",
      });
      currentIndex.value = songs.value.length - 1;

      // const audio = new Audio(res.data.data[0].url);
      // audio.play();
    });
  }
  lyric(row.id).then((res) => {
    // console.log(res);
  });
};
const columns = createColumns({ play });
</script>

<style>
.songcover {
  width: 40px;
  height: 40px;
}
</style>
