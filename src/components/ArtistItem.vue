<template>
    <div class="item">
        <em class="circle"></em>
        <router-link :to="{ path: '/singer', query: { id: item.id }}" class="faceImg">
            <el-image :src="item.picUrl + '?param=120y120'">
                <div slot="placeholder" class="image-slot">
                    <i class="iconfont icon-placeholder"></i>
                </div>
            </el-image>
        </router-link>
        <div class="info">
            <div class="info-header">
                <router-link :to="{ path: '/singer', query: { id: item.id }}" class="name">{{item.name}}</router-link>
                <i class="iconfont icon-collect" :class="{active: item.followed}"></i>
            </div>
            <div class="info-num">
                <span class="albumSize"><em>专辑</em>{{item.albumSize}}</span>
                <span class="musicSize"><em>单曲</em>{{item.musicSize}}</span>
                <span class="fansSize"><em>粉丝</em>{{$utils.formartNum(item.fansCount)}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
    name: 'ArtistItem',
    props: {
        item: { // 歌手信息
            type: Object,
            required: true
        },
    }
})
</script>
<style lang="less" scoped>
.item {
    position: relative;
    display: flex;
    width: calc(100% / 3 - 80px);
    padding: 10px 0;
    margin: 0 40px 20px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    transition: all .3s ease-in-out;

    &:hover {
        margin-left: 0;
        width: calc(100% /3 - 40px);
        border-radius: 60px 12px 12px 60px;
        transition: all .3s ease-in-out;
        background: -moz-linear-gradient(-45deg,  #ffffff 20%, #ffb08e 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(-45deg,  #ffffff 20%,#ffb08e 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(135deg,  #ffffff 20%,#ffb08e 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */  

        .faceImg {
            margin-left: 10px;
            border-radius: 100%;
            transition: all .3s ease-in-out;
        }
    }

    .circle {
        position: absolute;
        right: 10px;
        display: inline-block;
        padding: 10px;
        border-radius: 100%;
        border: 1px solid transparent;
        background: #fafafa;
        box-shadow: 0 2px 7px rgb(0 0 0 / 10%) inset;

        &::before {
            position: absolute;
            top: 6px;
            left: 6px;
            display: inline-block;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #ddd;
            box-shadow: 0 2px 7px rgb(0 0 0 / 10%);
        }
    }
}
.faceImg {
    display: block;
    width: 100px;
    margin-left: -40px;
    font-size: 0;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    transition: all .3s ease-in-out;
}

.info {
    flex: 1;
    padding: 0 20px;

    .name {
        display: inline-block;
        white-space: nowrap;
        max-width: 80%;
        margin-right: 10px;
        line-height: 40px;
        font-size: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
    }

    .info-num {
        display: flex;
        padding-top: 10px;
        color: var(--color-text);

        span {
            flex: 1;
            display: inline-block;
            font-weight: 600;
            color: var(--color-text-main);

            em {
                display: block;
                font-style: normal;
                font-size: 12px;
                font-weight: 300;
                color: var(--color-text);
            }
        }
    }

    .icon-collect {
        cursor: pointer;

        &.active {
            color: var(--color-text-height);
        }
    }
}
</style>