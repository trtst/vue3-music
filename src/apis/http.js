import api from './instance'
// 首页轮播图
const getBanner = () => { return api.get('/banner', {}) }
// 搜索
const search = ({ keywords = '' }) => { return api.get(`/search?keywords=${keywords}`, {}) }
// 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
const cloudsearch = ({ keywords = '', limit = 30, offset = 0, type = '1' }) => { return api.get(`/cloudsearch?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`, {}) }
// 热门搜索
const serachHot = () => { return api.get('/search/hot', {}) }
// 热门搜索详细
const serachHotDetail = () => { return api.get('/search/hot/detail', {}) }
const serachSuggest = ({ keywords = '' }) => { return api.get(`/search/suggest?keywords=${keywords}`, {}) }
const serachMatch = ({ keywords = '' }) => { return api.get(`/search/multimatch?keywords=${keywords}`, {}) }
// 登录
const login = ({ phone = '', pwd = '', realIP = '43.241.243.255' }) => { return api.post(`/login/cellphone`, {phone, password :pwd, realIP}) }
// 退出登录
const logout = () => { return api.get('/logout', {}) }
// 获取用户详情
const getUserInfo = ({ uid = '' }) => { return api.get(`/user/detail?uid=${uid}`, {}) }
// 音乐是否可用
const checkSong = ({ id = '' }) => { return api.get(`/check/music?id=${id}`, {}) }

/* ********* 歌单 ********* */
// 热门歌单分类
const hotList = () => { return api.get('/playlist/hot', {}) }
// 歌单列表
const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => { return api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {}) }
// 推荐歌单
const personalized = (limit = 30) => { return api.get(`/personalized?limit=${limit}`, {}) }
// 精品歌单
const highquality = (limit = 20, before = 0) => { return api.get(`/top/playlist/highquality?limit=${limit}&before=${before}`, {}) }
// 精品歌单标签
const highqualitytag = () => { return api.get('/playlist/highquality/tags', {}) }
// 歌单分类
const catlist = () => { return api.get('/playlist/catlist', {}) }
// 歌单详情
const playlistdetail = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }
// 歌单收藏用户
const playlistSCollect = ({ id = '', limit = 20, offset = 0 }) => { return api.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 相关歌单推荐
const playlistRelated = ({ id = '' }) => { return api.get(`/related/playlist?id=${id}`, {}) }
// 歌单评论
const playlistComment = ({ id = '', limit = 20, offset = 0, before = 0 }) => { return api.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&before=${before}`, {}) }
// 收藏、取消歌单 1：收藏 2取消
const subPlayList = ({ t = 1, id = '' }) => { return api.get(`/playlist/subscribe?t=${t}&id=${id}`, {}) }
// 获取用户歌单
const playlistUser = ({ uid = '', limit = 30, offset = 0 }) => { return api.get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`, {}) }
// 添加歌曲到歌单
const addPlayList = ({ op = 'add', pid = '', tracks = '' }) => { return api.get(`/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}`, {}) }

/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
const songDetail = ({ ids = '', timestamp = 0 }) => { return api.post(`/song/detail?timestamp=${timestamp}`, { ids: ids }) }
// 获取音乐URL
const songUrl = ({ id = '' }) => { return api.get(`/song/url?id=${id}`, {}) }
// 喜欢歌曲
const likeSong = ({ id = '', like = false }) => { return api.get(`/like?id=${id}&like=${like}`, {}) }
// 歌词
const lyrics = ({ id = '' }) => { return api.get(`/lyric?id=${id}`, {}) }
// 获取相似音乐
const simiSong = ({ id = '' }) => { return api.get(`/simi/song?id=${id}`, {}) }
// 包含这首歌的歌单
const simiPlayList = ({ id = '' }) => { return api.get(`/simi/playlist?id=${id}`, {}) }

/* ********* 歌曲评论 ********* */
// 歌曲评论
const commentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
/*
    * 发送/删除评论
    * t: 0删除 1发送 2回复
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    * id: 对应资源id
    * content: 发送的内容/对应内容的id
    * commentId: 回复的评论id
*/
const comment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => { return api.get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {}) }
/*
    * 给评论点赞
    * id: 对应资源id
    * cid: 评论id
    * t: 是否点赞 1: 是  0: 取消
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
*/
const commentLike = ({ id = '', cid = '', t = 1, type = 0 }) => { return api.get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`, {}) }

/* ********* 专辑 ********* */
// 获取专辑内容
const album = ({ id = '' }) => { return api.get(`/album?id=${id}`, {}) }
const albumDynamic = ({ id = '' }) => { return api.get(`/album/detail/dynamic?id=${id}`, {}) }
const albumSub = ({ id = '', t = 1 }) => { return api.get(`/album/sub?id=${id}&t=${t}`, {}) }
// 专辑评论
const albumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }

/* ********* 歌手 ********* */
// 歌手介绍
const artistDesc = ({ id = '' }) => { return api.get(`/artist/desc?id=${id}`, {}) }
// 歌手热门歌曲
const artists = ({ id = '' }) => { return api.get(`/artists?id=${id}`, {}) }
// 收藏/取消收藏歌手
const artistSub = ({ id = '', t = '1' }) => { return api.get(`/artist/sub?id=${id}&t=${t}`, {}) }
// 获取歌手专辑
const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => { return api.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌手 mv
const artistMv = ({ id = '', limit = 50, offset = 0 }) => { return api.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌手列表
/*
    * 给评论点赞
    * type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
    * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
    * initial: 按首字母索引查找参数, 热门传-1, #传0
    * limit: 30
    * offset: 0
*/
const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => { return api.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`, {}) }
// 收藏的歌手列表
const subArtist = () => { return api.get('/artist/sublist', {}) }

/* ********* MV ********* */
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => { return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {}) }
// 获取 mv详情
const mvDetail = ({ id = '' }) => { return api.get(`/mv/detail?mvid=${id}`, {}) }
// 获取 地址
const mvUrl = ({ id = '', r = 1080 }) => { return api.get(`/mv/url?id=${id}&r=${r}`, {}) }
// 获取mv评论
const commentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
// 相似mv
const simiMv = ({ id = '' }) => { return api.get(`/simi/mv?mvid=${id}`, {}) }

/* ********* 排行榜 ********* */
// 排行榜
const toplist = () => { return api.get('/toplist', {}) }
// 排行榜歌单列表
const topRankList = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }
// 所有榜单内容摘要
const topListDetail = () => { return api.get('/toplist/detail', {}) }
// 歌单详情
const listDetail = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }

/* ********* video ********* */
// 视频播放地址
const videoUrl = ({ id = '', r = 1080 }) => { return api.get(`/video/url?id=${id}&r=${r}`, {}) }
// 获取 video 详情
const videoDetail = ({ id = '' }) => { return api.get(`/video/detail?id=${id}`, {}) }
// 相似video
const simiVideo = ({ id = '' }) => { return api.get(`/related/allvideo?id=${id}`, {}) }
// 获取video评论
const commentVideo = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/video?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }

// 热门话题
const hotTopic = (limit = 20, offset = 0) => { return api.get(`/hot/topic?limit=${limit}&offset=${offset}`, {}) }
// 新碟上架
const topAlbum = ({ limit = 20, offset = 0, area = 'all', type = 'new', year = '', month = '' }) => { return api.get(`/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`, {}) }
// 热门歌手
const topArtists = ({ limit = 30, offset = 0 }) => { return api.get(`/top/artists?limit=${limit}&offset=${offset}`, {}) }
// 最新MV
const getNewMv = ({ limit = 30, area = '' }) => { return api.get(`/mv/first?limit=${limit}&area=${area}`, {}) }
// 热门电台
const getHotDj = ({ limit = 30, offset = 0 }) => { return api.get(`/dj/hot?limit=${limit}&offset=${offset}`, {}) } 

export {
    getBanner,
    search,
    serachHot,
    serachHotDetail,
    serachSuggest,
    serachMatch,
    cloudsearch,
    login,
    logout,
    getUserInfo,
    checkSong,
    hotList,
    playList,
    catlist,
    topRankList,
    playlistdetail,
    playlistSCollect,
    playlistRelated,
    playlistComment,
    subPlayList,
    playlistUser,
    addPlayList,
    songDetail,
    songUrl,
    likeSong,
    lyrics,
    simiSong,
    simiPlayList,
    commentSong,
    comment,
    commentLike,
    album,
    albumSub,
    albumDynamic,
    albumComment,
    artistDesc,
    artists,
    artistSub,
    artistAlbum,
    artistMv,
    artistList,
    mv,
    mvDetail,
    mvUrl,
    commentMv,
    simiMv,
    personalized,
    highquality,
    highqualitytag,
    videoUrl,
    videoDetail,
    simiVideo,
    commentVideo,
    hotTopic,
    topAlbum,
    toplist,
    topListDetail,
    listDetail,
    getNewMv,
    topArtists,
    subArtist,
    getHotDj
}
