export default {
    // 数字过万的处理
    formartNum (val) {
        let num = 0
        if (val > 9999) {
            num = Math.round(val / 10000 * 10) / 10 + '万'
        } else {
            num = val
        }

        return num
    },
    // 时间毫秒格式化处理 2020-10-30 09:30:00
    formartDate (originVal, fmt) {
        const dt = new Date(originVal)
        const opt = {
            yyyy: dt.getFullYear(),
            MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
            dd: (dt.getDate() + '').padStart(2, '0'),
            HH: (dt.getHours() + '').padStart(2, '0'),
            mm: (dt.getMinutes() + '').padStart(2, '0'),
            ss: (dt.getSeconds() + '').padStart(2, '0')
        }

        for (const k in opt) {
            const ret = new RegExp('(' + k + ')').exec(fmt)
            if (ret) {
                fmt = fmt.replace(ret[1], opt[k])
            }
        }

        return fmt
    },
    // 歌曲转毫秒格式化处理 03:30 => (3*60+30) * 1000
    formatSongSecond (duration) {
        let arr = duration.split(':'),
            second = 0;

        for(let i = 0; i < arr.length; i++) {
            second += arr[i] * 60 * (arr.length - 1 - i)
        }

        second += arr[arr.length - 1] * 1;

        return second;
    },
    // 歌曲毫秒格式化处理 03:30
    formatSongTime (duration = 0) {
        duration = duration >= 0 ? duration / 1000 : 0;
        const m = (Math.floor(duration / 60) + '').padStart(2, '0')
        const s = (Math.floor(duration % 60) + '').padStart(2, '0')
        return `${m}:${s}`
    },
    // 评论时间格式化处理
    formatMsgTime (duration) {
        let result = ''
        const NOW = new Date()
        const PAST = new Date(duration)

        // 判断是当天的时间 显示格式 10：30
        if (NOW.toDateString() === PAST.toDateString()) {
            result = this.formartDate(duration, 'HH:mm')
        // 时间为当年 显示月日 时间戳
        } else if (PAST.getFullYear() === NOW.getFullYear()) {
            result = this.formartDate(duration, 'MM月dd日 HH:mm')
        } else {
            result = this.formartDate(duration, 'yyyy年MM月dd日')
        }

        return result
    },
    // 添加歌曲到播放列表，过滤重复的歌曲
    concatPlayList (newList = [], oldList = []) {
        const arr = [...oldList, ...newList]
        const map = new Map()

        for (const item of arr) {
            if (!map.has(item.id)) {
                map.set(item.id, item)
            }
        }

        return [...map.values()]
    }
}
