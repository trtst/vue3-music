<template>
    <el-skeleton
        :loading="loading"
        animated
        :throttle="500"
        :count="count"
        >
        <template #template>
            <el-skeleton-item class="ske-img" variant="image" />
        </template>
        <template #default>
            <el-carousel class='artist' height="340px" :interval="8000" arrow="never" indicator-position="outside">
                <el-carousel-item class="box" :key="index" v-for="(list, index) in lists">
                    <router-link :to="{ path: '/artist', query: { id: item.id }}" :key="item.id" v-for="item in list" class="item">
                        <div class="faceImg">
                            <el-image :src="item.picUrl + '?param=100y100'">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="info">
                            <div class="artist-name" v-if="item.name">{{item.name}}</div>
                        </div>
                    </router-link>
                </el-carousel-item>
            </el-carousel>
        </template>
    </el-skeleton>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from '@vue/runtime-core';
export default {
    setup() {
        const { proxy } = getCurrentInstance();

        // 热门电台
        const info = reactive({
            lists: [],
            params: { limit: 36 },
            count: 12,
            loading: true
        })

        // 热门歌手
        const getArtists = async(params) => {
            const { data: res } = await proxy.$http.topArtists(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info['lists'] = splitGroup(res.artists, info.count);
            info['loading'] = false;
        }

        const splitGroup = (array, subGroupLength) => {
            let index = 0;
            let newArray = [];
            while(index < array.length) {
                newArray.push(array.slice(index, index += subGroupLength));
            }
            return newArray;
        }

        onMounted(() => {
            getArtists(info['params']);
        })

        return {
            ...toRefs(info),
        }
    }
}
</script>
<style lang="less" scoped>
.artist {
    display: block;
    height: 360px;
    font-size: 0;

    .box {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: space-between;
    }

    .item {
        // width: 100px;
        // height: 100px;
        border-radius: 4px;
        overflow: hidden;
    }
}

.el-skeleton {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: space-around;
    height: 340px;

    .ske-img {
        width: 100px;
        height: 100px;
    }
}
</style>