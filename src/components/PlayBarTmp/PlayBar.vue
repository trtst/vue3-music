<template>
    <div class="play-bar-main">
        <transition name="fade-bar">
            <bar 
            v-if="barType == 'Bar'"
            @changeMini="changeMini"
            @audioHandler="playSongStates" 
            @playAudioMode="playAudioMode"
            @setvolumeProgress="setvolumeProgress"
            @setAudioProgress="setAudioProgress"
            @setVolumeHandler="setVolumeHandler"></bar>
        </transition>
        <transition name="fade-mini">
            <mini-bar 
            v-if="barType == 'MiniBar'" 
            @changeMini="changeMini" 
            @audioHandler="playSongStates"
            @playAudioMode="playAudioMode"
            @setAudioProgress="setAudioProgress"></mini-bar>
        </transition>
        <audio-box ref="audioRef" @setCurrentTime="setCurrentTime"></audio-box>
    </div>
</template>

<script>
import AudioBox from '@components/PlayBarTmp/AudioBox.vue';
import MiniBar from '@components/PlayBarTmp/MiniBar.vue';
import Bar from '@components/PlayBarTmp/Bar.vue';
import { provide, ref } from 'vue';

export default {
    name:'PlayBar',
    setup() {
        const audioRef = ref(null);
        const currentTime = ref(0);
        const barType = ref('Bar');

        // 歌曲播放操作； 播放、暂停、上一首、下一首
        const playSongStates = (state) => {
            audioRef.value.playAudioType(state);
        };

        // 歌曲播放类型：循环、单曲、随机
        const playAudioMode = (mode) => {
            audioRef.value.playAudioMode(mode);
        };

        // 拖拽音量进度条
        const setvolumeProgress = (progress) => {
            audioRef.value.setvolumeProgress(progress);
        };
        // 设置音量
        const setVolumeHandler = (state) => {
            audioRef.value.setVolumeHandler(state);
        };

        // 拖拽音频进度条
        const setAudioProgress = (t) => {
            audioRef.value.setAudioProgress(t);
        };

        // 当前音频的播放时长
        const setCurrentTime = (t) => {
            currentTime.value = t;
        };

        const changeMini = (type) => {
            barType.value = type;
        }

        // 下发当前音频时间戳
        provide('currentTime', currentTime);

        return {
            barType,
            audioRef,
            changeMini,
            setCurrentTime,
            playSongStates,
            playAudioMode,
            setVolumeHandler,
            setAudioProgress,
            setvolumeProgress
        }
    },
    components: {
        AudioBox,
        MiniBar,
        Bar
    }
}
</script>
<style scoped lang="less">
.play-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 70px;
    background: #fff;
    box-shadow: 0 5px 40px -1px rgba(2,10,18,.1);
    transition: all .4s ease-out;
    transform: translateY(100%);

    &.active {
        transform: translateY(0);
    }
}
.fold {
    position: absolute;
    top: -30px;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 30px;

    .fold-btn {
        position: absolute;
        right: 200px;
        display: inline-block;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50px 50px 0px 0px;
        background: #fff;
        box-shadow: 0 5px 40px -1px rgba(2,10,18,.1);
        cursor: pointer;

        .active {
            color: var(--color-text-height)
        }
    }
}
.audioProgress {
    position: absolute;
    top: -6px;
    z-index: 9;
}
.play-bar-inside {
    display: flex;
    font-size: 0;
    line-height: 0;
    justify-content: space-between;
    align-items: center;

    .bar-l {
        display: flex;
        width: 300px;
        align-items: center;
        justify-content: center;
    }

    .bar-cover-img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        box-shadow: 0 0 15px 5px rgba(var(--color-text-height),.15);
    }

    .bar-name {
        flex: 1;
        font-size: 0;
        padding: 0 10px 6px 30px;
        overflow: hidden;

        .song_name {
            display: block;
            padding-bottom: 20px;
            line-height: 12px;
            font-size: 12px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        p {
            line-height: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .song_author {
            line-height: 12px;
            font-size: 12px;
            color: #999;
        }
    }

    .icon-collect, .icon-collect-active {
        font-size: 24px;
        line-height: 24px;
        margin: 0 15px;
        cursor: pointer;
    }

    .bar-time {
        width: 115px;
        line-height: 50px;
        font-size: 14px;
        color: #606266;
        text-align: center;
    }

    .bar-control {
        display: flex;
        padding: 10px 0;
        line-height: 1;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin: 0 20px;
            font-size: 30px;
            cursor: pointer;
            color: #666;
        }

        .icon-audio-play, .icon-audio-pause {
            font-size: 50px;
            font-weight: bold;
            color: var(--color-text-height);
        }
    }

    .volumeLine {
        width: 150px;
        margin-left: 10px;
    }

    .bar-oper {
        position: relative;
        display: flex;
        font-size: 0;
        line-height: 50px;
        padding-left: 30px;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin-left: 20px;
            font-size: 20px;
            cursor: pointer;
        }
    }

    .popver {
        position: relative;
    }

    .lyric {
        display: inline-block;
        padding: 26px 3px;
        margin-left: 20px;
        font-size: 18px;
        line-height: 18px;
        vertical-align: top;
        color: #999;
        cursor: pointer;
    }

    .playlist {
        position: relative;
        display: inline-block;
        line-height: 70px;
        height: 70px;
        color: #999;
        cursor: pointer;

        .playlist-num {
            position: absolute;
            top: 25%;
            left: 90%;
            font-size: 12px;
            line-height: 12px;
            color: #999;
        }
    }

    .volume-main {
        flex: 1;
        padding: 10px 0;
        display: flex;
        align-items: center;
    }
}

.playlist-header {
    display: flex;
    line-height: 40px;

    span {
        display: inline-block;
        flex: 1;
    }

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

    .delSonglist {
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
    }

    .icon-del {
        margin-right: 5px;
        font-size: 16px;
        color: #333;
    }
}
.lyrics-container {
    position: absolute;
    left: -200px;
    bottom: 75px;
    width: 400px;
    padding: 20px;
    height: 430px;
    border: 1px solid #EBEEF5;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    background: #fff;

    .lyrics-header {
        display: flex;
        padding: 0 0 24px;
        line-height: 16px;
        font-weight: 500;
        font-size: 16px;

        span {
            display: block;
            flex: 1;
        }

        .icon-closed {
            font-size: 20px;
        }
    }
}
.playlist-container {
    position: absolute;
    left: -250px;
    bottom: 75px;
    width: 500px;
    padding: 20px;
    border: 1px solid #EBEEF5;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    background: #fff;
}

.fade-bar-enter-active,
.fade-bar-leave-active,
.fade-mini-enter-active,
.fade-mini-leave-active {
    transition: all 0.3s ease;
}

.fade-bar-enter-from,
.fade-bar-leave-to,
.fade-mini-enter-from,
.fade-mini-leave-to  {
  opacity: 0;
}

</style>
