<template>
  <div class="player">
    <n-image width="60" :src="cover" @click="active = true" preview-disabled />
    <span>{{ name }}</span>
    <div class="control">
      <n-button-group>
        <n-button round>
          <template #icon>
            <n-icon><PlaySkipBack /></n-icon>
          </template>
        </n-button>
        <n-button ghost>
          <template #icon>
            <n-icon><Pause /></n-icon>
          </template>
        </n-button>
        <n-button round>
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
import { ref } from "vue";
import { Pause, PlaySkipBack, PlaySkipForward } from "@vicons/ionicons5";
const active = ref(false);
const currentTime = ref(0);
const cover = "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg";
const name = "07akioni";
const length = 100;
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
