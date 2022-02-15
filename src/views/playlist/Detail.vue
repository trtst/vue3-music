<template>
    <div class="detail">
        <div class="detail-container">
            <div class="detail-main">
                <div class="cover">
                    <div class="cover-img">
                        <el-image :src="details.coverImgUrl">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="cover-info">
                        <div class="cover-header">
                            <div class="cover-title">
                                {{details.name}}
                            </div>
                            <div class="cover-collect-author">
                                <router-link class="collect-author" :to="{ path: '/singer', query: { id: item.userId }}" v-for="item in collects" :key="item.userId">
                                    <el-image :src="item.avatarUrl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                </router-link>
                            </div>
                        </div>
                        <div class="cover-author-tags">
                            <div class="cover-author" v-if="details.creator">
                                <el-image :src="details.creator.avatarUrl" class="cover-avatar">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                                <div class="cover-name">{{details.creator.nickname}}</div>
                                <div class="cover-date">{{$utils.formartDate(details.createTime, 'yyyy-MM-dd')}}</div>
                            </div>
                            <div class="cover-tags" v-if="details.tags">
                                <router-link :to="{ path: '/playlist', query: { cat: tag }}" class="tag" v-for="(tag, index) in details.tags" :key="index">#{{tag}}</router-link>
                            </div>
                        </div>
                        <div class="cover-digital">
                            <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{$utils.formartNum(details.playCount)}}次</span>
                            <span class="cover-collect"><i class="iconfont icon-collect"></i> {{$utils.formartNum(details.subscribedCount)}}</span>
                            <span class="cover-comment"><i class="iconfont icon-comment"></i> {{$utils.formartNum(details.commentCount)}}</span>
                        </div>
                        <div class="cover-desc">
                            <h5>歌单简介<em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false"><i class="iconfont icon-closed"></i></em></h5>
                            <p v-html="details.description" @click="showAllDesc"></p>
                            <pre class="cover-desc-all" v-if="isShowDesc">
                                {{details.description}}
                            </pre>
                        </div>
                    </div>
                </div>
                <div class="song-main">
                    <div class="song-header">
                        <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
                        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                        <span :class="['collect', details.subscribed ? 'active' : '']" @click="subPlayList(details)"><i :class="['iconfont', 'icon-collect' + (details.subscribed ? '-active' : '')]"></i> {{ details.subscribed ? '已收藏' : '收藏'}}</span>
                    </div>
                    <template v-if="isLoading">
                        <Loading />
                    </template>
                    <template v-else>
                        <song-list :songList="songList" :stripe="true"></song-list>
                        <div class="showAllSongsTips" v-if="!isLogin">
                            <span @click="loginDialog">登录后查看全部歌曲</span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="aside-box">
                <div class="playlist-recom">
                    <h3 class="aside-title">相关歌单推荐</h3>
                    <div class="aside-main recom-main">
                        <router-link class="recom-item" :to="{ path: '/playlist/detail', query: { id: item.id }}" v-for="item in playlists" :key="item.id">
                            <el-image :src="item.coverImgUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <div class="recom-info">
                                <div class="recom-name">{{item.name}}</div>
                                <div class="recom-author">
                                    By. <router-link :to="{ path: '/user', query: { id: item.creator.userId }}">{{ item.creator.nickname }}</router-link>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div class="playlist-comment">
                    <h3 class="aside-title">歌单评论</h3>
                    <div class="aside-main comment-main">
                        <div class="comment-item" v-for="item in comments" :key="item.commentId">
                            <router-link :to="{ path: '/user', query: { id: item.commentId }}">
                                <el-image :src="item.user.avatarUrl">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                            </router-link>
                            <div class="comment-info">
                                <div class="comment-userInfo"><router-link :to="{ path: '/user', query: { id: item.commentId }}" class="comment-name">{{item.user.nickname}}</router-link><span class="comment-date">{{$utils.formatMsgTime(item.time)}}</span></div>
                                <div class="comment-desc">{{item.content}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, computed, onMounted } from 'vue';
import Loading from '@components/Loading.vue';
import SongList from '@components/SongList.vue';
import { formatSongInfo } from '@utils/song';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
    name:'PlayListDetail',
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const store = useStore();
        const info = reactive({
            id: '',
            details: {},
            isShowDesc: false,
            songList: [],
            collects: [],
            playlists: [],
            comments: [],
            total: 0,
            isLoading: true,
        });

        const isLogin = computed(() => store.getters.isLogin);

        // 登录及未登录下获取歌单中歌曲的列表
        const getDetail = async(params) => {
            info['isLoading'] = true;
            const { data: res } = await proxy.$http.playlistdetail(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info['details'] = res.playlist;

            if (isLogin.value) {
                const ids = res.playlist.trackIds;

                getAllSongs(ids);
            } else {
                info['songList'] = _formatSongs(res.playlist.tracks)
                info['total'] = info['songList'].length
                info['isLoading'] = false
            }
        };

        // 登录后根据ids获取所有歌曲列表
        const getAllSongs = async(ids) => {
            const sliceArr = []
            const num = 500
            let idsArr = []

            // 数组过长 每500份一组
            for (let index = 0; index < ids.length; index += num) {
                sliceArr.push(ids.slice(index, index + num))
            }

            for (let i = 0; i < sliceArr.length; i++) {
                const arrs = []
                sliceArr[i].map(d => {
                    arrs.push(d.id)
                });
                info['isLoading'] = true;
                const { data: res } = await proxy.$http.songDetail({ ids: arrs.join(','), timestamp: new Date().valueOf() + i })

                idsArr = idsArr.concat(_formatSongs(res.songs, res.privileges))
            }

            info['songList'] = idsArr;
            info['total'] = idsArr.length;
            info['isLoading'] = false;
        };

        // 歌单简介查看更多
        const showAllDesc = () => {
            if (info.details.description.length > 120) {
                info.isShowDesc = !info.isShowDesc
            }
        };

        // 未登录状态，点击登录按钮，显示登录框
        const loginDialog = () => {
            store.dispatch('loginSuc', true);
        };

        // 订阅该歌单的用户列表
        const getCollect = async(params) => {
            const { data: res } = await proxy.$http.playlistSCollect(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.collects = res.subscribers
        };

        // 相关歌单推荐
        const getRecom = async(params) => {
            const { data: res } = await proxy.$http.playlistRelated(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.playlists = res.playlists
        };

        // 歌单精彩评论
        const getComment = async(params) => {
            const { data: res } = await proxy.$http.playlistComment(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.comments = res.comments
        };

        // 播放列表为当前歌单的全部歌曲
        const playAllSongs = () => {
            store.dispatch('playAll', {
                list: info.songList
            });
            store.commit('SET_PLAYLISTTIPS', true);
        };
        
        // 收藏、取消歌单
        const subPlayList = async(item) => {
            const { data: res } = await proxy.$http.subPlayList({ id: item.id, t: (item.subscribed ? 2 : 1) })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.details.subscribed = !info.details.subscribed
        };

        // 处理歌曲
        const _formatSongs = (list, privileges) => {
            const ret = []
            list.map((item, index) => {
                if (item.id) {
                    // 是否有版权播放
                    if (privileges) {
                        item.license = !privileges[index].cp
                    }
                    
                    ret.push(formatSongInfo(item))
                }
            })
            return ret
        }

        onMounted(() => {
            info.id = route.query.id;
            _initialize(info.id);
        });

        const _initialize = (id) => {
            // 歌单详情
            getDetail({ id: id, s: 8 });
            // 歌单收藏者
            getCollect({ id: id, limit: 8 });
            // 相关歌单推荐
            getRecom({ id: id });
            // // 歌单评论
            getComment({ id: id, limit: 9 });
        };

        onBeforeRouteUpdate((to) => {
            info.songList = [];
            info.total = 0;
            info.id = to.query.id;
            _initialize(info.id);
        });

        return {
            ...toRefs(info),
            playAllSongs,
            subPlayList,
            isLogin,
            loginDialog,
            showAllDesc
        }
    },
    components: {
        Loading,
        SongList,
    }
}
</script>
<style lang="less" scoped>
.detail-container {
    display: flex;
    padding: 40px 0 0 0;
}
.detail-main {
    flex: 1;
    padding-bottom: 45px;
}
.aside-box {

    .playlist-recom, .playlist-comment {
        padding: 20px;
        margin-bottom: 20px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    }

    .aside-title {
        position: relative;
        font-size: 16px;
        line-height: 24px;

        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 18px;
            margin: 3px 5px 0 0;
            border-radius: 2px;
            background: var(--color-text-height);
            vertical-align: top;
        }
    }
}

.cover {
    display: flex;
}
.cover-img {
    display: flex;
    align-items: center;
    width: 250px;
    height: 250px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    flex-shrink: 0;

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: '';
        transform: scale(.95) translateX(5%);
        background: #f0f0f0;
    }
}

.cover-info {
    flex: 1;
    padding: 20px;
    margin-left: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

    .cover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cover-title {
        flex: 1;
        font-size: 24px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }

    .cover-collect-author {
        width: 200px;
        text-align: right;
    }

    .collect-author {
        position: relative;
        display: inline-block;
        width: 25px;
        height: 25px;
        border-radius: 100%;
        overflow: hidden;
        margin: 3px 0 0 -15px;
        border: 1px solid #fff;
        vertical-align: top;

        &:hover {
            z-index: 1;
            border: 1px solid var(--color-text-height);
        }
    }
}
.cover-author-tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.cover-author {
    padding: 15px 0 10px;

    .cover-avatar {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        vertical-align: top;
    }

    .cover-name, .cover-date {
        display: inline-block;
        padding: 0 10px;
        line-height: 32px;
    }

    .cover-date {
        color: var(--color-text);
    }
}
.cover-tags {

    .tag {
        display: inline-block;
        margin-right: 5px;
        font-size: 12px;
        color: var(--color-text-height);
    }
}
.cover-playCount, .cover-collect, .cover-comment {
    display: inline-block;
    padding: 0 20px 5px 0;
    line-height: 16px;
    font-size: 14px;
    color: var(--color-text);

    i {
        vertical-align: top;
    }
}
.cover-desc {
    position: relative;

    h5 {
        padding: 30px 0 5px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
    }

    .desc-close {
        position: absolute;
        top: 30px;
        right: 0;
        cursor: pointer;
    }

    p {
        line-height: 22px;
        font-size: 14px;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
    }

    .cover-desc-all {
        position: absolute;
        top: 70px;
        left: 10px;
        z-index: 1;
        width: calc(~'100% - 20px');
        padding: 10px;
        margin: -10px;
        max-height: 250px;
        line-height: 22px;
        font-size: 14px;
        white-space: pre-line;
        font-family: inherit;
        color: var(--color-text);
        background: #fff;
        overflow-y: scroll;
        box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
    }
}

.song-header {
    display: flex;
    padding: 30px 0 10px;

    h4 {
        flex: 1;
        font-size: 20px;
        line-height: 40px;

        em {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            line-height: 14px;
            font-style: normal;
            font-weight: normal;
            color: #666;
            vertical-align: baseline;
        }
    }

    span {
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        cursor: pointer;
        margin: 5px 0 5px 15px;
        transition: all .4s;
        background: #f0f0f0;
        color: #333;

        i {
            margin-right: 3px;
        }
    }

    .play-all {
        color: #fff;
        background: var(--color-text-height);

        i {
            color: #fff;
        }
    }

    .collect.active, .collect.active i {
        color: var(--color-text-height);
    }
}
.showAllSongsTips {
    text-align: center;
    padding: 40px 0;

    span {
        display: inline-block;
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        color: #fff;
        background: var(--color-text-height);
        cursor: pointer;
    }
}

.song-main {
    position: relative;
    padding: 0 20px;
    margin-top: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgba(0,0,0,.05)
}
.recom-main {
    .el-image {
        width: 60px;
        height: 60px;
        border-radius: 4px;
        overflow: hidden;
    }

    .recom-item {
        display: flex;
        padding: 10px 0;
    }

    .recom-info {
        flex: 1;
        padding-left: 10px;
    }

    .recom-name {
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
    }

    .recom-author {
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
        font-size: 12px;
        color: var(--color-text);

        a {
            color: #666;
        }
    }
}

.comment-main {
    font-size: 0;

    .el-image {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        overflow: hidden;
    }

    .comment-item {
        display: flex;
        padding: 10px 0;
    }

    .comment-info {
        flex: 1;
        padding-left: 10px;
    }

    .comment-userInfo {
        width: 100%;
        font-size: 0;
    }

    .comment-name {
        font-size: 14px;
        line-height: 14px;
        font-weight: bold;
    }

    .comment-desc {
        font-size: 12px;
        color: #666;
        line-height: 1.6;
        padding: 5px 10px;
        background: #f5f5f5;
        margin: 5px 0;
        border-radius: 3px;
    }

    .comment-date {
        display: inline-block;
        padding-left: 5px;
        font-size: 12px;
        color: #666;
    }
}
</style>