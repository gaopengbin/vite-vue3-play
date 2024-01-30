<template>
  <div class="player">
    <audio ref="audio" :src="currentSong.src" @timeupdate="handleTimeUpdate" @durationchange="handleDurationChange" @ended="handleEnded"></audio>
    <n-image width="60" :src="cover" @click="active = true" preview-disabled />
    <span>{{ name }}</span>
    <div class="control">
      <n-button-group>
        <n-button round @click="prev">
          <template #icon>
            <n-icon><PlaySkipBack /></n-icon>
          </template>
        </n-button>
        <n-button ghost @click="playOrPause">
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
import { ref, toRefs, reactive, computed, watchEffect } from "vue";
import { Pause, PlaySkipBack, PlaySkipForward, Play } from "@vicons/ionicons5";
import { musicStore } from "../../../store/music";
import { watch } from "vue";
import { nextTick } from "vue";

const music = musicStore();
console.log("music", music);

const playerState = reactive({
  isPlaying: false,
  active: false,
  currentTime: 0,
  cover: "",
  name: "",
  length: 0,
});

const { isPlaying, active, currentTime, cover, name, length } = toRefs(playerState);

const currentIndex = computed(() => music.currentIndex);
// const currentSong = music.songs[music.currentIndex];
const currentSong = ref(music.songs[music.currentIndex]);
watch(currentSong, (val) => {
  console.log("currentSong", val);
  play();
});
music.$subscribe((mutation, state) => {
  console.log("mutation", state);
  currentSong.value = state.songs[state.currentIndex];
});
const audio: any = ref(null);
const handleTimeUpdate = (e: any) => {
  playerState.currentTime = e.target.currentTime;
};
const handleDurationChange = (e: any) => {
  playerState.length = e.target.duration;
};
const handleEnded = () => {
  console.log("ended");
};

const play = () => {
  playerState.isPlaying = true;
  nextTick(() => {
    audio.value.play();
  });
};

const pause = () => {
  playerState.isPlaying = false;
  nextTick(() => {
    audio.value.pause();
  });
};

const playOrPause = () => {
  // console.log("play", currentSong.value, music.currentIndex);
  playerState.isPlaying = !playerState.isPlaying;
  if (playerState.isPlaying) {
    play();
  } else {
    pause();
  }
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
