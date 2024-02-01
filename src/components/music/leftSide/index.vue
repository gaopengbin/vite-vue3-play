<template>
  <div class="left-menu">
    <n-menu :options="menuOptions" :indent="10" />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import { GlobalStore } from "../../../store";
import { userPlaylist } from "../../../api/api";

const globalstore = GlobalStore();
const list: any = ref([]);
watch(
  () => globalstore.userInfo.userId,
  (val) => {
    if (val) {
      userPlaylist(globalstore.userInfo.userId).then((res) => {
        console.log(res.data.playlist);
      });
    }
  }
);

onMounted(() => {
  if (globalstore.userInfo.userId) {
    userPlaylist(globalstore.userInfo.userId).then((res) => {
      res.data.playlist.forEach((item: any) => {
        list.value.push({
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "songSheet",
                  query: {
                    id: item.id,
                  },
                },
              },
              { default: () => item.name }
            ),
          key: item.id,
          icon: () => h("img", { src: item.coverImgUrl + "?param=40y40", class: "listcover" }),
        });
      });
    });
  }
});

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
    label: "收藏",
    key: "songList",
    children: list,
  },
]);
</script>

<style lang="scss">
.left-menu {
  width: 160px;
  text-align: left;
  height: 500px;
  .listcover {
    width: 25px;
    height: 25px;
    border-radius: 10%;
    margin-right: 10px;
  }
}
</style>
