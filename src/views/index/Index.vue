<template>
    <div class="home">
        <Banners />

        <div class="hot-list">
            <div class="h_title">
                <h3>热门推荐</h3>
                <span v-for="(item, index) in playlist_tags" :key="item.id" :class="index == playlist_index ? 'active' : ''" @click="choosePlayListType(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <play-list :playList="playlist_list" :loading="playlist_loading" :num="playlist_count"></play-list>
            </div>
        </div>

        <div class='album_list'>
            <div class="h_title">
                <h3>新碟上架</h3>
                <span v-for="(item, index) in album_area" :key="item.id" :class="index == album_index ? 'active' : ''" @click="chooseAlbumType(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <album-list :albumList="album_list" :loading="album_loading" :num="album_count"></album-list>
            </div>
        </div>

        <div class='top_list'>
            <rank-list />
        </div>

        <div class='mv_list'>
            <div class="h_title">
                <h3>最新MV</h3>
                <span v-for="(item, index) in mv_area" :key="item.id" :class="index == mv_index ? 'active' : ''" @click="chooseMvType(index)">{{item}}</span>
            </div>
            <div class="wrapper">
                <mv-list :mvList="mv_list" :loading="mv_loading" :num="mv_count"></mv-list>
            </div>
        </div>

        <div class="dj-artist">
            <div class="dj-list">
                <div class="h_title">
                    <h3>热门电台</h3>
                </div>
                <dj-list />
            </div>
            <div class="artist-list">
                <div class="h_title">
                    <h3>热门歌手</h3>
                </div>
                <artist-list />
            </div>
        </div>
    </div>
</template>

<script>
import Banners from '@views/index/Banner.vue';
import RankList from '@views/index/RankList.vue'
import PlayList from '@components/PlayList.vue';
import AlbumList from '@components/AlbumList.vue';
import MvList from '@components/MvList.vue';
import DjList from '@views/index/DjList.vue'
import ArtistList from '@views/index/ArtistList.vue'

import hot_recom from '@assets/js/index/hot_recom';
import new_album from '@assets/js/index/new_album';
import new_mv from '@assets/js/index/new_mv';

import { toRefs } from '@vue/reactivity';

export default {
    name:'Index',
    setup() {
        // -------------- 推荐歌单
        const { playlist_info, choosePlayListType } = hot_recom();

        // -------------- 新碟
        const { album_info, chooseAlbumType } = new_album();

        // -------------- MV
        const { mv_info, chooseMvType } = new_mv();

        return {
            ...toRefs(playlist_info),
            ...toRefs(album_info),
            ...toRefs(mv_info),
            choosePlayListType,
            chooseAlbumType,
            chooseMvType,
        }
    },
    components: {
        Banners,
        PlayList,
        AlbumList,
        RankList,
        MvList,
        DjList,
        ArtistList,
    }
}
</script>
<style lang="less" scoped>
.h_title {
    padding: 20px 0 10px;

    h3 {
        display: inline-block;
        padding-right: 50px;
        font-size: 28px;
        font-weight: 700;
    }

    span {
        display: inline-block;
        font-size: 16px;
        margin: 0 40px 0 0;
        color: var(--color-text-main);
        cursor: pointer;

        &.active {
            position: relative;
            z-index: 1;
            font-weight: 600;
            color: var(--color-text-main);

            &:after {
                position: absolute;
                content: "";
                left: 0;
                bottom: 1px;
                width: 100%;
                height: 6px;
                background: var(--color-text-height);
                z-index: -1;
            }
        }
    }
}

.hot-list, .album_list, .mv_list, .dj-list, .artist-list {
    padding: 0 20px;
    margin-bottom: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}

.top_list {
    margin-bottom: 25px;   
}
.dj-artist {
    display: flex;
}
.dj-list {
    flex: 1;
    margin-right: 20px;
}
.artist-list {
    width: 440px;
}
</style>