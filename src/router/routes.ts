import { RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        title: '首页',
        redirect: '/music',
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
        component: () => import('@/components/music/index.vue'),
        children:[
            {
                path:'mainPage',
                name:'mainPage',
                component:()=>import('@/components/music/content/mainPage.vue')
            },
            {
                path:'search',
                name:'search',
                component:()=>import('@/components/music/content/searchResult.vue')
            },
            {
                path:'songSheet',
                name:'songSheet',
                component:()=>import('@/components/music/content/songSheet.vue')
            }
        ]
    }
]
export default routes
