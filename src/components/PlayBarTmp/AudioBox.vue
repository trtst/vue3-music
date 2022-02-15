<template>
    <audio
        v-if="curSongInfo"
        ref="myAudio"
        preload="auto"
        @canplay="canplaySong"
        @playing="playSong"
        @ended="endedSong"
        @error="errorSong"
        @timeupdate="updateSongTime"
        :src="curSongInfo.url"></audio>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex';
export default {
    name:'Audio',
    setup(props, { emit }) {
        const store = useStore();
        const myAudio = ref(null);
        const info = reactive({
            initAudioReady: false, // 初始化音频准备
            playMode: 0, // 播放模式  0循环播放、1单曲循环、2随机播放
        });

        // 获取播放列表
        const playIndex = computed(() => store.getters.playIndex);
        const playList = computed(() => store.getters.playList);
        const isPlayed = computed(() => store.getters.isPlayed);

        // 获取当前播放歌曲信息
        const curSongInfo = computed(() => playList.value[playIndex.value]);

        // 音乐 播放/暂停/上一首/下一首
        const playAudioType = (type) => {
            if (type === 'play') {
                store.commit('SET_PLAYSTATUS', !isPlayed.value);
                store.commit('SET_PLAYINDEX', playIndex.value);
            } else {
                changeSong(type);
            }
        };

        // 播放模式：随机、循环、单曲
        const playAudioMode = (type) => {
            info['playMode'] = type;
        };

        // 音量禁音及取消操作
        const setVolumeHandler = (Volume) => {
            const $myAudio = myAudio.value;
            $myAudio.muted = Volume;
        };
        const setvolumeProgress = (val) => {
            const $myAudio = myAudio.value;
            $myAudio.volume = val
            $myAudio.muted = val ? 0 : 1;
        }

        // 点击拖拽进度条，设置当前时间
        const setAudioProgress = (t) => {
            const $myAudio = myAudio.value;
            $myAudio.currentTime = t;
        }

        // 解决刷新页面时候，音频准备就绪
        const canplaySong = (e) => {
            info['initAudioReady'] = true;
        };

        // 音频播放时候 初始化状态，获取音频总时长
        const playSong = (e) => {
            info['initAudioReady'] = true;
            store.commit('SET_PLAYSTATUS', true);
        };

        // 音频播放结束 自动播放下一首
        const endedSong = (e) => {
            if (info['playMode'] === 1) {
                loopSong()
            } else {
                changeSong('next')
            }
        };

        // 手动切换歌曲
        const changeSong = (type) => { // type: prev/next  上一首/下一首
            if (playList.value.length !== 1) { // 若播放列表只有一首歌则单曲循环
                let index = playIndex.value
                if (info['playMode'] === 2) { // 随机模式
                    index = Math.floor(Math.random() * playList.value.length - 1) + 1
                } else {
                    if (type === 'prev') {
                        index = index === 0 ? playList.value.length - 1 : --index
                    } else {
                        index = index >= playList.value.length - 1 ? 0 : ++index
                    }
                }

                info['initAudioReady'] = false;
                store.commit('SET_PLAYSTATUS', false);
                store.commit('SET_PLAYINDEX', index);
            } else {
                loopSong()
            }
        };

        // 单曲循环歌曲
        const loopSong = () => {
            const $myAudio = myAudio.value;

            $myAudio.currentTime = 0;
            $myAudio.play();
            store.commit('SET_PLAYSTATUS', true);
        };

        // 监听音频时间， 实时更新当前播放时间
        const updateSongTime = (e) => {
            if (!info.initAudioReady) {
                return
            }
            emit('setCurrentTime', e.target.currentTime);
        };

        watch(curSongInfo, (newSong, oldSong) => {
            if (!newSong || (oldSong && newSong.id === oldSong.id)) {
                return
            }
            // 当前播放歌曲变化的时候  重置状态及当前播放的时长
            info['initAudioReady'] = false;
            info['currentTime'] = 0;
            emit('setCurrentTime', 0);
            
            nextTick(() => {
                const $myAudio = myAudio.value;

                if ($myAudio) {
                    $myAudio.play();
                }
            })
        }, { deep:true });

        watch(() => isPlayed.value, (playing) => {
            // 等待音频加载成功完成后播放
            if (!info.initAudioReady) {
                return
            };

            nextTick(() => {
                const $myAudio = myAudio.value;

                if ($myAudio) {
                    playing ? $myAudio.play() : $myAudio.pause()
                }
            })
        });

        return {
            ...toRefs(info),
            myAudio,
            curSongInfo,
            canplaySong,
            playSong,
            endedSong,
            loopSong,
            updateSongTime,
            playAudioType,
            playAudioMode,
            setVolumeHandler,
            setvolumeProgress,
            setAudioProgress,
        }
    },
}
</script>
<style scoped>
</style>