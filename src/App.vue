<template>
    <el-container>
        <el-aside>
            <Sidebar />
        </el-aside>
        <el-main>
            <Header />
            <router-view></router-view>
        </el-main>
        <Login v-show="loginDialogVisible" />
        <play-bar></play-bar>
    </el-container>
</template>
<script setup>
    import Sidebar from '@components/Sidebar.vue';
    import Header from '@components/Header.vue';
    import Login from '@components/Login.vue';
    import Playbar from '@components/PlayBarTmp/PlayBar.vue';

    import { computed, ref } from 'vue'
    import { useStore } from 'vuex'

    const store = useStore();
    const loginDialogVisible = computed(() => store.getters.loginDialogVisible);
</script>
<style>

</style>
