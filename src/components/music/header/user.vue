<template>
  <div class="user">
    <n-button quaternary v-if="!currentUserStatus" @click="login"> 登录 </n-button>

    <n-popover width="trigger" v-if="currentUserStatus">
      <template #trigger>
        <div>
          <n-avatar round :size="24" :src="globalstore.userInfo.avatarUrl" /> <span class="username">{{ globalstore.userInfo.nickname }}</span>
        </div></template
      >
      <n-button size="small" @click="Logout"> 退出登录 </n-button>
    </n-popover>

    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="登录" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra> X </template>
        <img :src="qrimg" alt="" />
        <template #footer>
          <n-button size="small" @click="vertify"> {{ qrInfo }} </n-button>
          {{ qrInfo }}
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

watch(currentUserStatus, (val) => {
  // console.log(val);
});
let interval: any = null;
const qrInfo = ref("扫码登录");
onMounted(async () => {
  const { data } = await loginStatus();
  if (!data.data.account || data.data.account.status == -10) {
    globalstore.isLogin = false;
  } else {
    // currentUserStatus.value = true;
    globalstore.isLogin = true;
    globalstore.userInfo = data.data.profile;
  }
});

const login = async () => {
  showModal.value = true;
  if (!globalstore.qrKey) {
    const key = await createKey();
    globalstore.qrKey = key.data.data.unikey;
  }
  const { data } = await createQR({ key: globalstore.qrKey, qrimg: true });
  qrimg.value = data.data.qrimg;
  debugger;
  interval = setInterval(async () => {
    await vertify();
  }, 1000);
};

const vertify = async () => {
  const { data } = await checkKey({ key: globalstore.qrKey });
  console.log(data);
  qrInfo.value = data.message;
  if (data.code === 803) {
    if (interval) {
      clearInterval(interval);
    }
    qrInfo.value = "登录成功";
    let res = await loginStatus();

    if (res.data.data.account.status == -10) {
      globalstore.isLogin = false;
    } else {
      globalstore.isLogin = true;
      globalstore.userInfo = res.data.data.profile;
    }

    showModal.value = false;
  } else if (data.code === 800) {
    const key = await createKey();
    globalstore.qrKey = key.data.data.unikey;
    const createQr = await createQR({ key: globalstore.qrKey, qrimg: true });
    qrimg.value = createQr.data.data.qrimg;
  }
};
const Logout = async () => {
  const { data } = await logout();
  if (data.code === 200) {
    globalstore.isLogin = false;
    globalstore.userInfo = {};
    // router.push({ name: "mainPage" });
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
