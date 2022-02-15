<template>
    <header class="header">
        <div class="menu">

        </div>
        <Search />
        <div :class="isLogin ? 'user-avatar' : 'login'">
            <div class="logined" v-if="isLogin">
                <el-image :src="userInfo.avatarUrl" class="avatar">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
                <span class="nickname">{{userInfo.nickname}}</span>
                <span class="set"><i class="iconfont icon-set"></i></span>
                <span class="quit" @click="logout"><i class="iconfont icon-quit"></i></span>
            </div>
            <span class="login-btn" @click="loginDialog" v-else>登录</span>
        </div>
    </header>
</template>
<script setup>
    import Search from '@components/Search.vue';
    import { computed, getCurrentInstance } from 'vue';
    import { useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    
    const store = useStore();
    const route = useRoute();
    const { proxy } = getCurrentInstance();

    // 是否显示登录弹窗
    const loginDialog = () => store.commit('setLoginDialog', true);
    // 登录成功后，获取用户信息
    const isLogin = computed(() => {
        return store.getters.isLogin
    });
    const userInfo = computed(() => {
        return store.getters.userInfo
    });

    const logout = async() => {
        const { data: res } = await proxy.$http.logout()

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        ElMessage.success('退出成功')
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('cookie')
        window.localStorage.removeItem('userInfo');
        window.localStorage.removeItem('isLogin');
        store.commit('setUserInfo', {});
        store.commit('SET_LOGIN', false);

        if (route.path.indexOf('/my') >= 0) {
            router.push({ path: '/' })
        }
    };

</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
}
.menu {
    flex: 1;
}
.user-avatar {
    padding: 5px 0 5px 20px;
    text-align: center;

    .avatar {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 100%;
        overflow: hidden;
        cursor: pointer;
    }

    .logined {
        display: flex;
        align-items: center;

        span {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            font-weight: 300;
            padding: 0 10px;
            cursor: pointer;
        }

        .iconfont {
            color: var(--color-text-main);
            vertical-align: top;
        }
    }
}
.login {
    padding: 0 20px;
    text-align: center;

    .login-btn {
        font-size: 16px;
        cursor: pointer;
    }
}
</style>