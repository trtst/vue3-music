<template>
    <div class="playbar-mini">
        <div class="wrapper" :class="{'active': isMini}">
            <div class="play-l"></div>
            <div class="play-circle" :class="[isPlayed ? 'active' : '']" @click="changeWrapper">
                <el-image :src="curSongInfo.album.picUrl" class="bar-cover-img">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="play-main">
                <div class="play-name">
                    <router-link :to="{ path: '/song', query: { id: curSongInfo.id }}" class="song_name">{{curSongInfo.name}}</router-link>
                    <span class="play-closed">
                        <i class="iconfont icon-closed" @click="changeBar"></i>
                    </span>
                </div>
                <div class="play-singer"><router-link :to="{ path: '/singer', query: { id: author.id }}" class="song_author" v-for="(author, k) in curSongInfo.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></div>
                <div class="play-time">
                    <span>{{ $utils.formatSongTime(($utils.formatSongSecond(curSongInfo.duration) - currentTime) * 1000)}}</span>
                </div>
                <div class="audioProgress">
                    <progress-line :progressWidth="audioProgressWidth" :isShowBtn="false" @setProgressLine="setAudioProgress"></progress-line>
                </div>
                <div class="play-footer">
                    <div class="play-control">
                        <i class="iconfont icon-audio-prev" title="上一首" @click.stop="audioHandler('prev')"></i>
                        <i :class="['iconfont', playIcon]" @click.stop="audioHandler('play')"></i>
                        <i class="iconfont icon-audio-next" title="下一首" @click.stop="audioHandler('next')"></i>
                    </div>
                    <i class="iconfont" :class="modeIcon.className" :title="modeIcon.title" @click.stop="changePlayMode"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProgressLine from '@components/ProgressLine.vue';

import { computed, getCurrentInstance, inject, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
export default {
    name:'MiniBar',
    setup(props, { emit }) {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        const info = reactive({
            currentTime: inject('currentTime'), // 音频当前时长
            playMode: 0, // 播放模式  0循环播放、1单曲循环、2随机播放
            isMini: false //
        })

        // 获取播放列表
        const playIndex = computed(() => store.getters.playIndex);
        const playList = computed(() => store.getters.playList);
        const isPlayed = computed(() => store.getters.isPlayed);

        // 获取当前播放歌曲信息
        const curSongInfo = computed(() => playList.value[playIndex.value]);

        // 音频播放/暂停/上一首/下一首事件
        const audioHandler = (type) => {
            emit('audioHandler', type);
        };

        // 切换播放模式
        const changePlayMode = () => {
            info['playMode'] = info['playMode'] >= 2 ? 0 : info['playMode'] + 1;

            emit('playAudioMode', info['playMode']);
        };

        // 音频播放进度条
        const audioProgressWidth = computed(() => { // 音频进度条长度
            return info['currentTime'] / proxy.$utils.formatSongSecond(curSongInfo.value.duration) * 100 + '%'
        });
        // 点击拖拽进度条，设置当前时间
        const setAudioProgress = (params) => {
            info['currentTime'] = params.val * proxy.$utils.formatSongSecond(curSongInfo.value.duration);

            // 拖拽的时候，不实时更改音频的时间
            if (params.flag) {
                emit('setAudioProgress', info['currentTime']);
            }
        };

        // 播放暂停按钮
        const playIcon = computed(() => {
            return !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause'
        });

        // 播放模式
        const modeIcon = computed(() => {
            const params = [{
                className: 'icon-loop',
                title: '循环模式'
            }, {
                className: 'icon-single-cycle',
                title: '单曲循环'
            }, {
                className: 'icon-shuffle',
                title: '随机播放'
            }]
            return params[info.playMode]
        });

        const changeWrapper = () => {
            info['isMini'] = !info['isMini'];
        }


        const changeBar = () => {
            emit('changeMini', 'Bar');
        }

        return {
            ...toRefs(info),
            isPlayed,
            modeIcon,
            audioHandler,
            changePlayMode,
            audioProgressWidth,
            setAudioProgress,
            curSongInfo,
            changeBar,
            playIcon,
            changeWrapper
        }
    },
    components: {
        ProgressLine,
    }
}
</script>
<style lang="less" scoped>
.playbar-mini {
    position: fixed;
    right: 20px;
    bottom: 65px;
    z-index: 99;
    border-radius: 12px;
    box-shadow: 0 0px 10px rgb(0 0 0 / 40%);
}
.wrapper {
    position: relative;
    display: flex;
    max-width: 350px;
    border-radius: 12px;
    overflow: hidden;
    
    &.active {
        .play-l, .play-main {
            width: 0;
        }
    }
}
.play-l {
    position: relative;
    width: 20px;
    height: 100px;
    border-radius: 12px 0 0 12px;
    background: #fff;
    flex-shrink: 0;
    transition: width .4s ease-in;

    &::after {
        position: absolute;
        top: -5px;
        right: -110px;
        display: inline-block;
        content: '';
        width: 110px;
        height: 110px;
        background: -webkit-radial-gradient(transparent 55px, #fff 55px);
        pointer-events: none; /* send mouse events beneath this layer */
        -webkit-clip-path: polygon(50% 0%, 100% 0%, 100% 3600%, 50% 50%);
        transform:scaleX(-1);
    }
}
.play-circle {
    width: 94px;
    height: 94px;
    margin: 0px 5px;
    border-radius: 100%;
    background: #fff;
    box-shadow: 0 0px 30px rgb(0 0 0 / 40%);
    padding: 3px;
    flex-shrink: 0;
    cursor: pointer;
    
    .bar-cover-img {
        border-radius: 100%;
        overflow: hidden;
    }

    .el-image {
        animation: soundPaying 15s linear infinite;
        animation-play-state: paused;
    }

    &.active {
        .el-image {
            animation-play-state: running;
        }
    }
}

@keyframes soundPaying {
    from {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg)
    }

    to {
        -webkit-transform: rotate(370deg);
        transform: rotate(370deg)
    }
}

.play-name {
    display: flex;
    font-size: 0;
    padding: 8px 10px 0;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;

    .song_name {
        display: inline-block;
        max-width: 80%;
        padding-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .play-closed {
        margin-top: -8px;
        cursor: pointer;
    }
}
.play-singer {
    display: block;
    padding: 0 10px;
    max-width: 50%;
    line-height: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
        line-height: 12px;
        font-size: 12px;
        color: var(--color-text);
    }
}
.audioProgress {
    margin: 0 10px;
}
.play-main {
    position: relative;
    width: 220px;
    padding: 5px 0;
    border-radius: 0 12px 12px 0;
    background: #fff;
    transition: width .4s ease-in;

    &::after {
        position: absolute;
        top: -5px;
        left: -110px;
        display: inline-block;
        content: '';
        width: 110px;
        height: 110px;
        background: -webkit-radial-gradient(transparent 55px, #fff 55px);
        pointer-events: none; /* send mouse events beneath this layer */
        -webkit-clip-path: polygon(50% 0%, 100% 0%, 100% 3600%, 50% 50%);
    }
}
.play-time {
    display: flex;
    justify-content: flex-end;
    font-size: 0;
    padding-right: 10px;
    margin-top: -5px;
    overflow: hidden;

    span {
        display: inline-block;
        line-height: 12px;
        font-size: 12px;
        transform: scale(.9);
        color: var(--color-text);
    }
}
.play-footer {
    display: flex;
    padding: 0 10px 0 5px;
    justify-content: space-between;
    align-items: center;
}
.play-control {
    font-size: 0;
    text-align: center;

    .iconfont {
        font-size: 24px;
        cursor: pointer;
    }
}

</style>