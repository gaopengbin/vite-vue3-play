<template>
  <div class="player">
    <n-image width="60" :src="cover" @click="active = true" preview-disabled />
    <span>{{ name }}</span>
    <div class="control">
      <n-button-group>
        <n-button round @click="prev">
          <template #icon>
            <n-icon><PlaySkipBack /></n-icon>
          </template>
        </n-button>
        <n-button ghost @click="play">
          <template #icon>
            <n-icon><Pause v-show="isPlaying" /><Play v-show="!isPlaying" /></n-icon>
          </template>
        </n-button>
        <n-button round @click="next">
          <template #icon>
            <n-icon><PlaySkipForward /></n-icon>
          </template>
        </n-button>
      </n-button-group>
      <n-slider v-model:value="currentTime" :min="0" :max="length" :step="0.01" />
    </div>
    <n-drawer v-model:show="active" :width="502" placement="bottom" to="#my-music">
      <n-drawer-content title="歌词页"> 歌词页 </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive } from "vue";
import { Pause, PlaySkipBack, PlaySkipForward, Play } from "@vicons/ionicons5";
// const active = ref(false);
// const currentTime = ref(0);
// const cover = "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg";
// const name = "07akioni";
// const length = 100;

const playerState = reactive({
  isPlaying: false,
  active: false,
  currentTime: 0,
  cover: "",
  name: "",
  length: 0,
});

const { isPlaying, active, currentTime, cover, name, length } = toRefs(playerState);

const play = () => {
  console.log("play");
  playerState.isPlaying = !playerState.isPlaying;
};
const prev = () => {
  console.log("prev");
};
const next = () => {
  console.log("next");
};
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  align-items: center;
  padding: 5px;
  .control {
    width: 50%;
    margin-left: 100px;
    margin-top: 30px;
  }
}
</style>
