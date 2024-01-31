<template>
  <div class="player">
    <audio ref="audio" :src="currentSong.src" @timeupdate="handleTimeUpdate" @durationchange="handleDurationChange" @ended="handleEnded"></audio>
    <n-image width="60" :src="currentSong.cover" @click="active = true" preview-disabled />
    <span>{{ currentSong.title }}</span>
    <div class="control">
      <n-button-group>
        <n-button round @click="prev">
          <template #icon>
            <n-icon>
              <PlaySkipBack />
            </n-icon>
          </template>
        </n-button>
        <n-button ghost @click="playOrPause">
          <template #icon>
            <n-icon>
              <Pause v-show="isPlaying" />
              <Play v-show="!isPlaying" />
            </n-icon>
          </template>
        </n-button>
        <n-button round @click="next">
          <template #icon>
            <n-icon>
              <PlaySkipForward />
            </n-icon>
          </template>
        </n-button>
      </n-button-group>
      <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      <n-slider v-model:value="progress" :min="0" :max="100" :step="0.01" @dragend="seek" :format-tooltip="formatToolTip" />
      <div class="vol">
        <n-icon>
          <VolumeHigh />
        </n-icon>
        <n-slider v-model:value="volume" :min="0" :max="100" :step="0.01" @update:value="changeVolumes" />
        <n-icon @click="activeList = true">
          <List />
        </n-icon>
      </div>
    </div>
    <n-drawer v-model:show="active" :width="502" placement="bottom" to="#my-music">
      <n-drawer-content title="歌词页"> 歌词页 </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="activeList" :width="502" placement="right" to="#my-music">
      <n-drawer-content title="播放列表"> <playList /> </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, computed, watchEffect } from "vue";
import { Pause, PlaySkipBack, PlaySkipForward, Play, VolumeHigh, List } from "@vicons/ionicons5";
import { musicStore } from "../../../store/music";
import { watch } from "vue";
import { nextTick } from "vue";
import playList from "./playList.vue";

const music = musicStore();
console.log("music", music);

const playerState = reactive({
  isPlaying: false,
  active: false,
  activeList: false,
  currentTime: 0,
  cover: "",
  name: "",
  length: 0,
  progress: 0,
  duration: 0,
  volume: 30,
});

const { isPlaying, active, activeList, currentTime, cover, name, length, progress, duration, volume } = toRefs(playerState);

const currentSong = ref(music.songs[music.currentIndex]);
watch(currentSong, (val) => {
  console.log("currentSong", val);
  play();
});
music.$subscribe((mutation, state) => {
  currentSong.value = state.songs[state.currentIndex];
});
const audio: any = ref(null);
const handleTimeUpdate = (e: any) => {
  // console.log("timeupdate", e);
  playerState.currentTime = Math.floor(audio.value.currentTime);
  playerState.progress = (playerState.currentTime / playerState.duration) * 100;
};
const handleDurationChange = (e: any) => {
  playerState.duration = Math.floor(audio.value.duration);
  console.log("durationchange", playerState.duration);
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
  console.log("play", currentSong.value, music.currentIndex);
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
// 格式化时间
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(0);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const formatToolTip = (val) => {
  return formatTime((val * playerState.duration) / 100);
};
watch(progress, (val) => {
  // console.log("progress", val);
  // seek();
});
// 改变进度
const seek = () => {
  let ct = (playerState.progress * playerState.duration) / 100;
  if (!isNaN(ct)) {
    audio.value.currentTime = ct;
  }
};
// 控制音量
const changeVolumes = (val) => {
  audio.value.volume = val / 100;
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
  .vol {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    .n-icon {
      margin: 0 10px;
      font-size: large;
    }
  }
}
</style>
