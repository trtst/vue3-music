export default {
    isLogin (state) {
        return state.isLogin || JSON.parse(window.localStorage.getItem('isLogin'));
    },
    isPlayed (state) {
        return state.isPlayed;
    },
    loginDialogVisible (state) {
        return state.loginDialogVisible;
    },
    userInfo (state) {
        return state.userInfo || JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    },
    playList (state) {
        return state.playList.length ? state.playList : JSON.parse(window.localStorage.getItem('playList')) || []
    },
    playIndex (state) {
        return state.playIndex || JSON.parse(window.localStorage.getItem('playIndex')) || 0
    },
    isShowPlayListTips (state) {
        return state.isShowPlayListTips
    }
}