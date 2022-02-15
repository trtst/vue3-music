<template>
    <div class='artist'>
        <div class="artist-container">
            <div class="artist-main">
                <div class="list-container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                    <div class="item" :key="item.id" v-for="item in list">
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
                    <template v-if="isLoading">
                        <Loading />
                    </template>
                </div>
            </div>
            <div class="aside-box">
                <el-affix :offset="140">
                    <div class="aside-menu">
                        <div class="filter">
                            <div class="filter-item">
                                <span v-for="(item, index) in initial" :key="index" :class=" index === initialIndex ? 'active' : ''" @click="selectType('initial', index)">{{item.label}}</span>
                            </div>
                            <div class="filter-item">
                                <span v-for="(item, index) in area" :key="index" :class=" index === areaIndex ? 'active' : ''" @click="selectType('area', index)">{{item.label}}</span>
                            </div>
                            <div class="filter-item">
                                <span v-for="(item, index) in type" :key="index" :class=" index === typeIndex ? 'active' : ''" @click="selectType('type', index)">{{item.label}}</span>
                            </div>
                        </div>
                    </div>
                </el-affix>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from '@components/Loading.vue'
import { onMounted, getCurrentInstance, watchEffect, reactive, toRefs } from '@vue/runtime-core';
export default {
    name: 'Artist',
    components: {
        Loading
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const info = reactive({
            type: [{ label: '全部', val: -1 }, { label: '男歌手', val: 1 }, { label: '女歌手', val: 2 }, { label: '乐队', val: 3 }],
            area: [{ label: '全部', val: -1 }, { label: '华语', val: 7 }, { label: '欧美', val: 96 }, { label: '日本', val: 8 }, { label: '韩国', val: 16 }, { label: '其他', val: 0 }],
            initial: [{ label: '热门', val: -1 }, { label: '#', val: 0 }],
            typeIndex: 0,
            areaIndex: 0,
            initialIndex: 0,
            params: {
                area: '',
                type: '',
                initial: '',
                limit: 30,
                offset: 0
            },
            list: [],
            isLoading: true,
            busy: true
        });

        const renderInitial = () => {
            const alphabet = []
            for (let i = 0; i < 26; i++) {
                alphabet.push({
                    label: String.fromCharCode(65 + i),
                    val: String.fromCharCode(97 + i)
                })
            }
            info.initial = [info.initial[0], ...alphabet, info.initial[1]]
        };

        const selectType = (type, index) => {
            info[type + 'Index'] = index
            info.list = []
            info.params.offset = 0
            info.params[type] = info[type][index].val
        };

        const getArtist = async(params) => {
            const { data: res } = await proxy.$http.artistList(params)

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.list = info.params.offset !== 0 ? [...info.list, ...res.artists] : res.artists
            info.busy = !res.more
            info.isLoading = res.more
        };

        const loadMore = () => {
            info.busy = true
            info.params.offset = info.list.length
        }

        onMounted(() => {
            info.params.area = info.area[info.areaIndex].val
            info.params.type = info.type[info.typeIndex].val
            info.params.initial = info.initial[info.initialIndex].val
            renderInitial();
        })

        watchEffect(() => {
            getArtist(info.params);
        });

        return {
            ...toRefs(info),
            selectType,
            getArtist,
            loadMore
        }
    }
}
</script>
<style scoped lang="less">
.artist-container {
    display: flex;
    padding-top: 40px;

    .artist-main {
        flex: 1;
    }
}
.aside-menu {
    padding: 20px 20px 1px;
    margin-bottom: 25px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
}

.filter-item {
    font-size: 0;
    padding-bottom: 20px;

    span {
        display: inline-block;
        padding: 0 12px;
        font-size: 14px;
        line-height: 30px;
        margin-right: 6px;
        vertical-align: top;
        cursor: pointer;
        border-radius: 3px;

        &.active {
            color: #fff;
            background: #ff641e;
        }
    }
}

.list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 40px;
    margin-right: -40px;

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
}

</style>
