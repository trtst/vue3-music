<template>
    <el-skeleton
        :loading="loading"
        animated
        :count="num"
        :throttle="500"
        >
        <template #template>
            <div class="item">
                <el-skeleton-item class="ske-img" variant="h3" />
                <div class="ske-info">
                    <el-skeleton-item variant="h3" class="ske-name" />
                    <el-skeleton-item variant="text" class="ske-txt" style="width:50%" />
                    <el-skeleton-item variant="text" class="ske-txt" />
                </div>
            </div>
        </template>
        <template #default>
            <div class='mv'>
                <!-- 列表有重复的MV， 相同id的key会报错，加上字符串的index -->
                <div class="item" :key="'' + item.id + index" v-for="(item, index) in mvList">
                    <router-link :to="{ path: '/mvlist/mv', query: { id: item.id }}" class="faceImg">
                        <i class="iconfont icon-video-play"></i>
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
        </template>
    </el-skeleton>
</template>

<script>
export default {
    props: {
        mvList: Array,
        num: Number,
        loading: Boolean
    },
    setup() {
    }
}
</script>
<style scoped lang="less">
.mv {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    margin: 0 -10px;
    font-size: 0;

    .item {
        flex: 30%;
        max-width: calc(100% / 5 - 20px);
        margin: 20px 10px 0;
        border-radius: 4px;

        &:hover {
            .el-image {
                transform: scale(1.1);
            }

            .icon-video-play {
                opacity: 1;
                transform: scale(1);
            }
        }
    }

    .faceImg {
        display: block;
        position: relative;
        width: 100%;
        height: 123px;
        overflow: hidden;

    }

    .icon-video-play {
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
        transform: scale(.5);
        transition: all .4s linear;
        text-shadow: 2px 2px 10px #000;
    }

    .el-image {
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all .4s linear;

        :deep(img) {
            height: auto;
        }
    }

    .info {
        position: relative;
        padding: 15px 0;

        .mv-name {
            display: block;
            font-size: 14px;
            text-overflow: ellipsis;
            height: 20px;
            overflow: hidden;
            white-space: nowrap;
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

.el-skeleton {
    display: flex;
    width: auto;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    margin: 0 -10px;
    font-size: 0;

    .item {
        flex: 30%;
        max-width: calc(100% / 5 - 20px);
        margin: 20px 10px 0;
        border-radius: 4px;
    }

    .ske-img {
        display: block;
        position: relative;
        width: 100%;
        height: 123px;
        overflow: hidden;
    }

    .ske-info {
        position: relative;
        padding: 15px 0;
    }

    .ske-name {
        display: block;
        margin: 0 0 6px;
        line-height: 14px;
        height: 14px;
    }

    .ske-txt {
        display: block;
        margin: 0 0 8px 0;
        line-height: 16px;
        width: 10%;
    }
}
</style>
