import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/index'},
    { path: '/index', name: 'index', component: () => import('@views/index/Index.vue')},
    { path: '/rank', name: 'rank', component: () => import('@views/rank/Index.vue')},
    { path: '/playlist', name: 'playlist', component: () => import('@views/playlist/Index.vue')},
    { path: '/playlist/detail', name: 'playlistdetail', component: () => import('@views/playlist/Detail.vue')},
    { path: '/user', name: 'user', component: () => import('@views/user/Index.vue')},
    { path: '/song', name: 'song', component: () => import('@views/song/Index.vue')},
    { path: '/singer', name: 'singer', component: () => import('@views/singer/Index.vue')},
    { path: '/album', name: 'album', component: () => import('@views/album/Index.vue')},
    { path: '/artist', name: 'artist', component: () => import('@views/artist/Index.vue')},
    { path: '/mvlist', name: 'mvlist', component: () => import('@views/mvlist/Index.vue')},
    { path: '/mvlist/mv', name: 'mv', component: () => import('@views/mvlist/Detail.vue')},
    { path: '/dj', name: 'dj', component: () => import('@views/dj/Index.vue')},
    { path: '/search', name: 'search', component: () => import('@views/search/Index.vue')},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router