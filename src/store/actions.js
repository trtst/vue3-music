import * as types from './mutation-types'
import utils from '@/utils/util'

// 合并歌曲到播放列表查重
const concatPlayList = (list, playList = []) => {
    // filter过滤无版权及vip歌曲
    return utils.concatPlayList(list.filter(item => { return !item.license && !item.vip }), playList)
}
// 当前歌曲在播放列表的索引
const findIndex = (list, playList) => {
    return playList.findIndex(d => { return d.id === list.id })
}
export default {
    loginSuc (context, val) {
        context.commit('setLoginDialog', val)
    },
    // 播放歌曲列表里全部歌曲（清空当前播放列表）
    playAll ({ commit }, { list }) {
        commit(types.SET_PLAYLIST, concatPlayList(list))
        commit(types.SET_PLAYSTATUS, true)
        commit(types.SET_PLAYINDEX, 0)
    },
    // 播放当前选中的歌曲
    selectPlay ({ commit, state }, { list }) {
        const playList = concatPlayList(list, state.playList)

        commit(types.SET_PLAYLIST, playList)
        commit(types.SET_PLAYSTATUS, true)
        commit(types.SET_PLAYINDEX, findIndex(list[0], playList))
    },
    // 添加歌曲到当前播放列表
    addList ({ commit, state }, { list }) {
        const playList = concatPlayList(list, state.playList)

        commit(types.SET_PLAYLIST, playList)
    }
}
