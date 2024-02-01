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
    <n-drawer v-model:show="active" class="lyric-drawer" placement="top" to="#my-music" :mask-closable="false" :show-mask="false">
      <n-drawer-content title="歌词页" closable>
        <div class="showMusicBox">
          <!-- 封面 -->
          <div style="margin-right: 150px">
            <div style="position: relative">
              <img class="vinyl rotate" :style="{ animationPlayState: animationPlayState }" src="../static/img/vinyl.png" alt="" />
              <n-image width="250" :style="{ animationPlayState: animationPlayState }" :src="currentSong.cover + '?param=350y350'"></n-image>
            </div>
          </div>
          <!-- 歌词 -->
          <div class="lyrics-container">
            <ul>
              <li v-for="(line, index) in lyric" :key="index" :class="{ active: currentLine === index }">
                {{ line.text }}
              </li>
            </ul>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="activeList" :width="502" placement="right" to="#my-music">
      <n-drawer-content title="播放列表">
        <playList />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, computed, watchEffect, onMounted } from "vue";
import { Pause, PlaySkipBack, PlaySkipForward, Play, VolumeHigh, List } from "@vicons/ionicons5";
import { musicStore } from "../../../store/music";
import { watch } from "vue";
import { nextTick } from "vue";
import playList from "./playList.vue";

const music = musicStore();

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
  lyric: [] as any,
  currentLine: -1,
  animationPlayState: "paused",
});

const { isPlaying, active, activeList, currentTime, cover, name, length, progress, duration, volume, lyric, currentLine, animationPlayState } = toRefs(playerState);

const currentSong = ref(music.songs[music.currentIndex]);

onMounted(() => {
  audio.value.volume = volume.value / 100;
  audio.value.src = currentSong.value.src;
  playerState.lyric = parseLyric(currentSong.value.Lyric);
});

watch(currentSong, (val) => {
  console.log("currentSong", val);
  playerState.lyric = parseLyric(val.Lyric);
  console.log("lyric", playerState.lyric);
  play();
});
music.$subscribe((mutation, state) => {
  currentSong.value = state.songs[state.currentIndex];
});
const audio: any = ref(null);
const handleTimeUpdate = (e: any) => {
  playerState.currentTime = Math.floor(audio.value.currentTime);
  playerState.progress = (playerState.currentTime / playerState.duration) * 100;

  // 歌词时间
  if (!lyric.value) return;
  for (let i = 0; i < lyric.value.length; i++) {
    if (i === lyric.value.length - 1 || currentTime.value < lyric.value[i + 1].time) {
      currentLine.value = i;
      break;
    }
  }
  // 侦听歌词滚动的位置
  const activeLine: any = document.querySelector(".lyrics-container li.active");
  if (activeLine) {
    const container: any = document.querySelector(".lyrics-container ul");
    container.scrollTop = activeLine.offsetTop - container.clientHeight / 2 + activeLine.clientHeight;
  }
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
  playerState.animationPlayState = "running";
  nextTick(() => {
    audio.value.play();
  });
};

const pause = () => {
  playerState.isPlaying = false;
  playerState.animationPlayState = "paused";
  nextTick(() => {
    audio.value.pause();
  });
};

const playOrPause = () => {
  playerState.isPlaying = !playerState.isPlaying;
  if (playerState.isPlaying) {
    play();
  } else {
    pause();
  }
};
const prev = () => {
  if (music.currentIndex == 0) {
    music.currentIndex = music.songs.length - 1;
  } else {
    music.currentIndex--;
  }
  play();
};
const next = () => {
  if (music.currentIndex == music.songs.length - 1) {
    music.currentIndex = 0;
  } else {
    music.currentIndex++;
  }
  play();
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
watch(progress, (val) => {});
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
const parseLyric = (lyric) => {
  if (!lyric) return;
  const lines = lyric.split("\n");
  return lines
    .map((line) => {
      const matches = line.match(/^\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/);
      if (matches) {
        const minutes = parseInt(matches[1]);
        const seconds = parseFloat(matches[2]);
        const text = matches[3].trim();
        return { time: minutes * 60 + seconds, text };
      } else {
        return null;
      }
    })
    .filter((line) => line !== null);
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

.rotate {
  animation-name: rotate;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.showMusicBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}
.lyrics-container {
  width: 350px;
  height: 500px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
    z-index: 2;
    pointer-events: none;
    /* make sure the overlay doesn't interfere with mouse events */
    opacity: 1;
    /* set initial opacity to 1 */
    transition: opacity 0.5s ease-in-out;
    /* add a transition for the opacity property */
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
    z-index: 2;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }

  ul {
    overflow: auto;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 1;

    .active {
      color: var(--el-color-primary);
      font-size: 20px;
      font-weight: bold;
    }

    /* 自定义滚动条样式 */
    // 隐藏滚动条
    &::-webkit-scrollbar {
      width: 0;
    }

    li {
      text-align: center;
      padding: 15px 0px;
      // opacity: 0.75;
      /* 过渡动画，可根据需要调整 */
      transition: all 0.3s ease-out;
    }
  }
}

.lyrics-container.fade-out::before,
.lyrics-container.fade-out::after {
  opacity: 0;
}
</style>
<style lang="scss">
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.lyric-drawer {
  height: calc(100% - 100px) !important;
  .n-image {
    border-radius: 125px;
    // 旋转
    animation-name: rotate;
    animation-duration: 50s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
}
</style>
