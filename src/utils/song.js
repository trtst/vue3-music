import utils from '@utils/util'

export default class Song {
    constructor ({
        id,
        name,
        mvId,
        singer,
        album,
        alia,
        duration,
        url,
        vip,
        license,
        publishTime
    }) {
        this.id = id
        this.name = name
        this.mvId = mvId
        this.singer = singer
        this.album = album
        this.alia = alia
        this.duration = duration
        this.url = url
        this.vip = vip
        this.license = license
        this.publishTime = publishTime
    }
}

export function formatSongInfo (params) {
    return new Song({
        id: String(params.id),
        name: params.name,
        mvId: params.mv,
        singer: params.ar,
        album: params.al,
        alia: params.alia,
        vip: params.fee === 1,
        license: params.license,
        duration: utils.formatSongTime(params.dt),
        url: `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`,
        publishTime: utils.formatMsgTime(params.publishTime)
    })
}
