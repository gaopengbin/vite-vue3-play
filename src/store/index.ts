import { createPinia, defineStore } from 'pinia'
import piniaPluginPersist from "pinia-plugin-persist";


export const GlobalStore = defineStore({
    id: 'GlobalState',
    state: () => {
        return {
            userInfo: {
                id: 1,
                nickname: 'test',
                avatarUrl: 'https://img2.baidu.com/it/u=2979343759,1090469389&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
            },
            isLogin: false,
            qrKey: '',
            themeConfig: {},
            cookie: '',
        }
    },
    persist: {
        enabled: true,
        // If you want to change the key name
        // key:'pinia',
    }
})
const pinia = createPinia()
pinia.use(piniaPluginPersist);
export default pinia