<template>
    <div v-if="videoOptions.src" class='mv-detail'>
        <div class="mv-main">
            <div class="mv-info-hd">
                <div class="info-name"><i class="iconfont icon-mv"></i>{{mvDetail.name}}</div>
                <router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in mvDetail.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
            </div>
            <div class="video-main">
                <videoPlay 
                width="100%" 
                height="100%"
                :poster="videoOptions.poster"
                :src="videoOptions.src" />
            </div>
            <div class="mv-comment">
                <comment-list :type="type" :sId="mId"></comment-list>
            </div>
        </div>
        <div class="aside-box">
            <div class="mv-info">
                <h3 class="aside-title">MV简介</h3>
                <div class="mv-info-count">
                    <div class="info-time">发布时间：{{mvDetail.publishTime}}</div>
                    <div class="info-count">播放量：{{$utils.formartNum(mvDetail.playCount)}}</div>
                </div>
                <div class="mv-desc">
                    {{mvDetail.desc ? mvDetail.desc : '暂无简介'}}
                </div>
            </div>
            <div class="simi-mv">
                <h3 class="aside-title">相似MV</h3>
                <div class="aside-main mv-main">
                    <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiMv">
                        <router-link :to="{ path: '/mvlist/mv', query: { id: item.id }}" class="faceImg">
                            <i class="iconfont icon-play"></i>
                            <el-image :src="item.cover || item.imgurl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                        </router-link>
                        <div class="info">
                            <router-link :to="{ path: '/mvlist/mv', query: { id: item.id }}" class="mv-name">{{item.name}}</router-link>
                            <router-link :to="{ path: '/singer', query: { id: item.artistId }}" class="mv-author" v-if="!item.publishTime">{{item.artistName}}</router-link>
                            <div class="mv-playCount"><i class="iconfont icon-mvlist"></i> {{$utils.formartNum(item.playCount)}}</div>
                            <div class="mv-time" v-if="item.publishTime">发布时间：{{item.publishTime}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CommentList from '@components/Comments.vue'

import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play'

export default {
    name: 'mvDetail',
    components: {
        CommentList,
        videoPlay
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const store = useStore();
        const info = reactive({
            mId: '0',
            mvDetail: {},
            type: 1, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                src: "", //视频源
                poster: "",
            },
            simiMv: [],
        });

        const getMvDetail = async() => {
            const { data: res } = await proxy.$http.mvDetail({ id: info.mId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.mvDetail = res.data;
            info.videoOptions.poster = res.data.cover;
        };

        const getMvUrl = async(r) => {
            const { data: res } = await proxy.$http.mvUrl({ id: info.mId, r })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.videoOptions.src = res.data.url;
        };

        const getSimiMv = async() => {
            const { data: res } = await proxy.$http.simiMv({ id: info.mId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.simiMv = res.mvs
        };

        const init = () => {
            getMvDetail();
            getMvUrl();
            getSimiMv()
        };

        onBeforeRouteUpdate((to) => {
            info['mId'] = to.query.id;
            init();
        });

        onMounted(() => {
            info['mId'] = route.query.id;
            init();
            store.commit('SET_PLAYSTATUS', false);
        });

        return {
            ...toRefs(info),
        }
    }
}
</script>
<style scoped lang="less">
.mv-detail {
    display: flex;
    padding-top: 40px;

    .mv-main {
        flex: 1;
    }
}

.mv-info-hd {
    display: flex;
    padding: 0 0 20px 0;

    .info-name {
        padding-right: 20px;
        font-size: 24px;
        line-height: 24px;

        .icon-mv {
            margin-right: 5px;
            vertical-align: top;
            color: var(--color-text-height);
        }
    }
    .song-author {
        line-height: 24px;
        color: #666;
    }
}
.video-main {
    position: relative;
    height: 500px;
    font-size: 0;
}

.mv-info {
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

.mv-info-count {
    padding: 10px 0;
    font-size: 12px;
    color: var(--color-text);
}

.simi-mv {
    .aside-title {
        padding: 20px;
        margin-bottom: 5px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    }

    .item {
        padding: 20px;
        margin-bottom: 10px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

        &:hover {
            .el-image {
                transform: scale(1.1);
            }

            .icon-play {
                opacity: 1;
                transform: scale(1);
            }
        }
    }

    .faceImg {
        display: block;
        position: relative;
        border-radius: 6px;
        overflow: hidden;
    }

    .icon-play {
        position: absolute;
        top: 50%;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        margin-top: -30px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.4s linear;
        text-shadow: 2px 2px 10px #000;
    }

    .el-image {
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all .4s linear;

        /deep/ img {
            height: auto;
        }
    }

    .info {
        position: relative;
        padding: 15px 0 0;

        .mv-name {
            display: block;
            font-size: 14px;
        }

        .mv-author, .mv-playCount, .mv-time {
            display: block;
            line-height: 24px;
            font-size: 14px;
            color: #999;
        }

        .icon-video {
            font-size: 24px;
            color: #999;
            vertical-align: top;
        }
    }
}
</style>
