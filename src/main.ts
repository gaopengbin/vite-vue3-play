import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import 'vfonts/Lato.css'
import pinia from './store'
createApp(App).use(pinia).use(router).use(naive).mount('#app')
