
<template>
    <div class='banner'>
        <el-skeleton :loading="loading" animated>
            <template #template>
                <el-skeleton-item class="skeleton-img" variant="image" />
                <el-skeleton-item class="skeleton-img" variant="image" />
                <el-skeleton-item class="skeleton-img" variant="image" />
                <el-skeleton-item class="skeleton-img" variant="image" />
            </template>
            <template #default>
                <swiper
                :slides-per-view="4"
                :space-between="30"
                :modules="modules"
                :autoplay="{ delay: 3000 }"
                :pagination="{ clickable: true }"
                v-if="lists" 
                ref="mySwiper"
                class="banner_wrap"
                >
                    <swiper-slide v-for="item of lists" :key="item.imageUrl">
                        <el-image :src="item.imageUrl" :alt="item.typeTitle" class="banner_img" @click="pathHandler(item)">
                            <template #placeholder>
                                <div class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </template>
                        </el-image>
                    </swiper-slide>
                </swiper>
            </template>
        </el-skeleton>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from "vue"
import { useRouter } from 'vue-router'

import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

export default {
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();

        let lists = ref([]);
        let loading = ref(true);
        
        const getBanner = async() => {
            try {
                const { data: res } = await proxy.$http.getBanner()

                if (res.code !== 200) {
                    return proxy.$msg.error('数据请求失败')
                }

                lists.value = res.banners;
                loading.value = false;
            } catch (error) {
                console.log(error)
            }
        }

        const pathHandler = (params) => {
            switch (params.targetType) {
                case 1: // 单曲
                    router.push({ path: '/song', query: { id: params.targetId } })
                    break
                case 10: // 专辑
                    router.push({ path: '/album', query: { id: params.targetId } })
                    break
                case 1000: // 歌单
                    router.push({ path: '/playlist', query: { id: params.targetId } })
                    break
                case 1004: // MV
                    router.push({ path: '/mvlist/mv', query: { id: params.targetId } })
                    break
                case 3000: // 外链
                    window.open(params.url, '_blank')
                    break
            }
        }

        onMounted(() => {
            getBanner();
        })

        return {
            lists,
            loading,
            pathHandler,
            modules: [Navigation, Pagination, Autoplay],
        }
    },
    components: {
      Swiper,
      SwiperSlide,
    }
}
</script>

<style lang="less" scoped>
// 轮播图的宽度
@w: calc((@mainWidth - 90px) / 4);

.banner {
    padding-bottom: 30px;
}
.banner_wrap {
    position: relative;
    padding: 40px 0;
    .calcHeight(@w, 1080, 400);
    font-size: 0;

    .banner_img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .swiper-slide, .el-image {
        .calcHeight(@w, 1080, 400);
    }
}

.el-skeleton {
    display: flex;
    justify-content: space-between;
    padding: 40px 0;

    .skeleton-img {
        flex: 1;
        .calcHeight(@w, 1080, 400);
        margin-right: 30px;

        &:last-child {
            margin: 0;
        }
    }
}
.swiper {
    // opacity: .1;

    .swiper-slide {
        border-radius: 12px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        overflow: hidden;
    }
    :deep(.swiper-pagination-bullet-active) {
        width: 15px;
        border-radius: 4px;
        background: var(--color-text-height);
    }
}
</style>
