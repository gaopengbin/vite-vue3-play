<template>
  <div class="songList">
    <n-data-table :columns="columns" :data="songs" :bordered="false" :max-height="250" />
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent } from "vue";
import { NButton, useMessage } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import moment from "moment";
import { songUrl, lyric } from "@/api/api";

type Song = {
  no: number;
  title: string;
  length: string;
};
const props = defineProps<{
  songs: any[];
}>(); // 传入的歌曲列表

const createColumns = ({ play }: { play: (row: Song) => void }): DataTableColumns<Song> => {
  return [
    {
      title: "#",
      key: "index",
      width: 50,
      render(row) {
        return h("span", props.songs.indexOf(row) + 1);
      },
    },
    {
      title: "封面",
      key: "cover",
      width: 80,
      render(row) {
        return h("img", { src: row.al.picUrl, class: "songcover" });
      },
    },
    {
      title: "标题",
      key: "name",
    },
    {
      title: "时长",
      key: "length",
      render(row) {
        return h("span", moment(row.dt).format("mm:ss"));
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
const play = (row) => {
  console.log("play");
  songUrl(row).then((res) => {
    console.log(res);
    // const audio = new Audio(res.data.data[0].url);
    // audio.play();
  });
  lyric(row.id).then((res) => {
    console.log(res);
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
