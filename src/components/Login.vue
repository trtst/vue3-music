<template>
    <div class='login'>
        <el-dialog v-model="isVisible" width="30%" :before-close="handleClose">
            <div class="login-wrapper">
                <img src="@assets/img/logo.jpg" alt="" class="login-logo">
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="">
                    <el-form-item prop="phone" label-width="">
                        <el-input v-model="loginForm.phone" placeholder="请输入网易云帐号登录">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd" label-width="">
                        <el-input v-model="loginForm.pwd" placeholder="请输入密码" show-password>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { computed, getCurrentInstance, reactive, ref, toRefs } from 'vue';
import { useStore } from 'vuex'
export default {
    name: 'Login',
    setup(props) {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        const isVisible = ref(true);

        const handleClose = () => store.commit('setLoginDialog', false);

        const formInfo = reactive({
            loginForm: {
                phone: '',
                pwd: ''
            },
            loginFormRules: {
                phone: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
            }
        });

        const submitForm = () => {
            proxy.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    const { data: res } = await proxy.$http.login(formInfo['loginForm']);

                    if (res.code !== 200) {
                        proxy.$msg.error(res.msg)
                    } else {
                        getUserInfo(res.profile.userId)
                        window.localStorage.setItem('token', res.token)
                        window.localStorage.setItem('cookie', res.cookie)
                        store.commit('setLoginDialog', false);
                    }
                }
            })
        }
        
        const getUserInfo = async(uid) => {
            const { data: res } = await proxy.$http.getUserInfo({ uid: uid })

            if (res.code !== 200) {
                proxy.$msg.error(res.msg)
            } else {
                window.localStorage.setItem('isLogin', true);
                window.localStorage.setItem('userInfo', JSON.stringify(res.profile));
                store.commit('SET_LOGIN', true);
                store.commit('setUserInfo', res.profile);
            }
        }

        return {
            handleClose,
            isVisible,
            ...toRefs(formInfo),
            submitForm,

        }
    }
}
</script>
<style scoped lang="less">
.login-logo {
    display: block;
    margin: 0 auto 50px;
}
.login {

    :deep(.el-dialog__body) {
        padding: 30px 20px 0;
    }

    .dialog-footer {
        position: relative;
        z-index: 2;
        display: block;
        width: 100%;
        margin-bottom: 120px;

        .el-button {
            width: 100%;
        }
    }

    :deep(.el-dialog__footer) {
        position: relative;

        &:after {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            content: "";
            width: 100%;
            height: 100%;
            opacity: .3;
            background: url('@assets/img/login_bg2.jpg') center bottom no-repeat;
            background-size: contain;
        }
    }
}

</style>
