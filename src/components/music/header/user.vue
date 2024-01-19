<template>
  <div class="user">
    <n-button quaternary v-if="!currentUserStatus" @click="login"> 登录 </n-button>
    <div v-if="currentUserStatus">
      <n-avatar round :size="24" :src="globalstore.userInfo.avatarUrl" /> <span class="username">{{ globalstore.userInfo.nickname }}</span>
    </div>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="登录" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra> X </template>
        <img :src="qrimg" alt="" />
        <template #footer>
          <n-button size="small" @click="vertify"> 已扫描，点击验证 </n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { loginStatus, createKey, createQR, checkKey, logout } from "@/api/api";
import { onMounted, ref, watch, computed } from "vue";
import { GlobalStore } from "../../../store";
import { useRouter } from "vue-router";

const globalstore = GlobalStore();
const router = useRouter();

const showModal = ref(false);
const qrimg = ref("");

const currentUserStatus = computed(() => globalstore.isLogin);
console.log(currentUserStatus);

watch(currentUserStatus, (val) => {
  console.log(val);
});

onMounted(async () => {
  const { data } = await loginStatus();
  console.log(data);
  if (!data.data.account || data.data.account.status == -10) {
    globalstore.isLogin = false;
  } else {
    console.log(data.data.profile);
    // currentUserStatus.value = true;
    globalstore.isLogin = true;
    globalstore.userInfo = data.data.profile;
  }
});

const login = async () => {
  showModal.value = true;
  if (!globalstore.qrKey) {
    const key = await createKey();
    console.log(key);
    globalstore.qrKey = key.data.data.unikey;
  }
  const { data } = await createQR({ key: globalstore.qrKey, qrimg: true });
  qrimg.value = data.data.qrimg;
};

const vertify = async () => {
  const { data } = await checkKey({ key: globalstore.qrKey });
  console.log(data);
  if (data.code === 803) {
    loginStatus().then((res: any) => {
      if (res.data.data.account.status == -10) {
        globalstore.isLogin = false;
      } else {
        globalstore.isLogin = true;
        globalstore.userInfo = res.data.data.profile;
      }
    });
    showModal.value = false;
  } else if (data.code === 800) {
    console.log("二维码失效");
    const key = await createKey();
    globalstore.qrKey = key.data.data.unikey;
    const createQr = await createQR({ key: globalstore.qrKey, qrimg: true });
    qrimg.value = createQr.data.data.qrimg;
  }
};

const username = "laogao";
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  align-items: center;
  margin-left: auto;
  .username {
    margin-left: 10px;
  }
}
</style>
