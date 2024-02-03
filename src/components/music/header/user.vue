<template>
  <div class="user">
    <n-button quaternary v-if="!currentUserStatus" @click="login"> 登录 </n-button>

    <n-popover width="trigger" v-if="currentUserStatus">
      <template #trigger>
        <div>
          <n-avatar round :size="24" :src="globalstore.userInfo.avatarUrl" /> <span class="username">{{ globalstore.userInfo.nickname }}</span>
        </div>
      </template>
      <n-button size="small" @click="Logout"> 退出登录 </n-button>
    </n-popover>

    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="登录" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra> X </template>
        <img :src="qrimg" alt="" />
        <template #footer>
          {{ qrInfo }}
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { logout } from "@/api/api";
import { onMounted, ref, inject } from "vue";
import { GlobalStore } from "../../../store";
import axios from "axios";

const reload: any = inject("reload");
const globalstore = GlobalStore();
const showModal = ref(false);
const qrimg = ref("");
const { isLogin, cookie } = globalstore;
const currentUserStatus = ref(isLogin);
const qrInfo = ref("扫码登录");

onMounted(async () => {
  const { data } = await getLoginStatus(cookie);
  if (!data.account || data.account.status == -10) {
    globalstore.isLogin = false;
  } else {
    currentUserStatus.value = true;
    globalstore.isLogin = true;
    globalstore.userInfo = data.profile;
  }
});

// 二维码状态
async function checkStatus(key) {
  const res = await axios({
    url: import.meta.env.VITE_API_URL + `/login/qr/check?key=${key}&timestamp=${Date.now()}`,
  });
  return res.data;
}
// 获取登录状态
async function getLoginStatus(cookie = "") {
  const res = await axios({
    url: import.meta.env.VITE_API_URL + `/login/status?timestamp=${Date.now()}`,
    method: "post",
    data: {
      cookie,
    },
  });
  return res.data;
}
// 二维码登录
async function login() {
  showModal.value = true;
  let timer: any;
  getLoginStatus(globalstore.cookie);
  const res = await axios({
    url: import.meta.env.VITE_API_URL + `/login/qr/key?timestamp=${Date.now()}`,
  });
  const key = res.data.data.unikey;
  const res2 = await axios({
    url: import.meta.env.VITE_API_URL + `/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
  });
  qrimg.value = res2.data.data.qrimg;

  timer = setInterval(async () => {
    const statusRes = await checkStatus(key);
    qrInfo.value = statusRes.msg;
    if (statusRes.code === 800) {
      qrInfo.value = "二维码已过期,请重新获取";
      clearInterval(timer);
    }
    if (statusRes.code === 803) {
      // 这一步会返回cookie
      clearInterval(timer);
      qrInfo.value = "登录成功";
      let loginRes = await getLoginStatus(statusRes.cookie);
      globalstore.isLogin = true;
      globalstore.userInfo = loginRes.data.profile;
      globalstore.cookie = statusRes.cookie;
      showModal.value = false;
      reload();
    }
  }, 3000);
}

const Logout = async () => {
  const { data } = await logout();
  console.log(data);
  if (data.code === 200) {
    globalstore.isLogin = false;
    globalstore.userInfo = {};
    globalstore.qrKey = "";
    globalstore.cookie = "";
    reload();
  }
};
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
