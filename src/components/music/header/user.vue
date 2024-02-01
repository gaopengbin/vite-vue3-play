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
import axios from "axios";

const globalstore = GlobalStore();
const router = useRouter();

const showModal = ref(false);
const qrimg = ref("");

const currentUserStatus = computed(() => globalstore.isLogin);

watch(currentUserStatus, (val) => {
  // console.log(val);
});
let timer: any = null;

const qrInfo = ref("验证");
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

// 二维码状态
async function checkStatus(key) {
  const res = await axios({
    url: `/api/login/qr/check?key=${key}&timestamp=${Date.now()}`,
  });
  return res.data;
}
// 获取登录状态
async function getLoginStatus(cookie = "") {
  const res = await axios({
    url: `/api/login/status?timestamp=${Date.now()}`,
    method: "post",
    data: {
      cookie,
    },
  });
  console.log(res.data);
}
// 二维码登录
async function login() {
  showModal.value = true;
  let timer: any;
  // const cookie: any = localStorage.getItem("cookie");
  getLoginStatus(globalstore.cookie);
  const res = await axios({
    url: `/api/login/qr/key?timestamp=${Date.now()}`,
  });
  const key = res.data.data.unikey;
  const res2 = await axios({
    url: `/api/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
  });
  qrimg.value = res2.data.data.qrimg;

  timer = setInterval(async () => {
    const statusRes = await checkStatus(key);
    if (statusRes.code === 800) {
      alert("二维码已过期,请重新获取");
      clearInterval(timer);
    }
    if (statusRes.code === 803) {
      // 这一步会返回cookie
      clearInterval(timer);
      alert("授权登录成功");
      let loginRes = await getLoginStatus(statusRes.cookie);
      console.log(loginRes);
      globalstore.isLogin = true;
      globalstore.userInfo = loginRes.data.profile;
      globalstore.cookie = statusRes.cookie;
      // localStorage.setItem("cookie", statusRes.cookie);
    }
  }, 3000);
}
// login();

const login1 = async () => {
  showModal.value = true;
  if (!globalstore.qrKey) {
    const key = await createKey();
    globalstore.qrKey = key.data.data.unikey;
  }
  const { data } = await createQR({ key: globalstore.qrKey, qrimg: true });
  qrimg.value = data.data.qrimg;
};

const getQR = async () => {
  const key = await createKey();
  console.log(key);
  globalstore.qrKey = key.data.data.unikey;
  console.log(globalstore.qrKey);
  const createQr = await createQR({ key: globalstore.qrKey, qrimg: true });
  qrimg.value = createQr.data.data.qrimg;
  console.log(createQr.data.data);
};

const vertify = async () => {
  const { data } = await checkKey({ key: globalstore.qrKey });
  console.log(data);
  qrInfo.value = data.message;
  if (data.code === 803) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    qrInfo.value = "登录成功";
    let res = await loginStatus();
    console.log(res);
    if (res.data.data.account.status == -10) {
      globalstore.isLogin = false;
    } else {
      globalstore.isLogin = true;
      globalstore.userInfo = res.data.data.profile;
    }

    showModal.value = false;
  } else if (data.code === 800) {
    getQR();
  }
};
const Logout = async () => {
  const { data } = await logout();
  console.log(data);
  if (data.code === 200) {
    globalstore.isLogin = false;
    globalstore.userInfo = {};
    globalstore.qrKey = "";
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
