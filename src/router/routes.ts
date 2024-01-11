import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'index',
        title: '首页',
        component: () => import('@/components/HelloWorld.vue'), //.vue不能省略
    },
    {
        path: '/color',
        name: 'color',
        title: '关于',
        component: () => import('@/components/color.vue'),
    },
    {
        path: '/music',
        name: 'music',
        title: '音乐',
        component: () => import('@/components/music/index.vue')
    }
]
export default routes
