<template>
    <div class="search">
        <el-popover placement="bottom" :width="230" trigger="click">
            <template #reference>
                <el-input
                    class="keyVal"
                    placeholder="请输入歌名、歌词、歌手或专辑"
                    v-model="keyVal"
                    @focus="handleFocus"
                    @input="handleInput"
                    clearable>
                </el-input>
            </template>
            <div class="hot-search" v-if="!keyVal">
                <h5>热门搜索</h5>
                <div class="hot-search-list">
                    <div class="hot-item" v-for="(item, index) in serachHot" :key="index" @click="jumpSearch(item)">
                        <span :class="[ index < 3 ? 'top-' + index : '']">{{(index + 1) + '.'}}</span>
                        {{item.first}}
                    </div>
                </div>
            </div>
            <div class="search-key-list" v-else>
                <div class="search-item" v-for="(item, index) in suggestInfo.order" :key="index">
                    <h6>{{listType[item]}}</h6>
                    <div class="item-main">
                        <div class="list" v-for="(val, k) in suggestInfo[item]" :key="k" @click="jumpPage(val, item)">
                            {{val.name}}
                            <template v-if="item === 'songs'">
                                -<span v-for="(a, i) in val.artists" :key="i">{{a.name + (i !== 0 ? ' / ' : '')}}</span>
                            </template>
                            <template v-else-if="item === 'albums'">
                                -<span>{{val.artist.name}}</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </el-popover>
        <i class="iconfont icon-search"></i>
    </div>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const info = reactive({
            keyVal: '',
            serachHot: [],
            suggestInfo: {},
            isShowSearch: false
        });

        //搜索框，获取焦点时，请求热门搜索列表接口
        const handleFocus = () => {
            showSearch()
            info.isShowSearch = true
        };

        // 搜索框文字实时获取搜索结果
        const handleInput = () => {
            if (info.keyVal) {
                showSearch()
                info.isShowSearch = true
            } else {
                info.isShowSearch = false
            }
        };

        const showSearch = () => {
            // 显示搜索列表 若有关键词显示搜索建议，否则显示默认热门搜索列表
            if (!info.keyVal) {
                info.serachHot = []
                getSearchHot()
            } else {
                info.suggestInfo = {}
                getSerachSuggest()
            }
        };

        // 热门搜索
        const getSearchHot = async() => {
            const { data: res } = await proxy.$http.serachHot()

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.serachHot = res.result.hots
        };

        // 搜索结果
        const getSerachSuggest = async() => {
            const { data: res } = await proxy.$http.serachSuggest({ keywords: info.keyVal })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.suggestInfo = res.result
        };

        // 默认热门搜索列表，点击后台跳转到搜索结果页面
        const jumpSearch = (item) => {
            info.isShowSearch = false
            info.keyVal = item.first
            if (item.first === route.query.key) {
                return
            }
            router.push({ path: '/search', query: { key: item.first } })
        };

        // 搜索建议列表，点击后跳转到相对应的落地页
        const jumpPage = (item, type) => {
            info.keyVal = item.name
            switch (type) {
                case 'songs':
                    router.push({ path: '/song', query: { id: item.id } })
                break
                case 'artists':
                    router.push({ path: '/singer', query: { id: item.id } })
                break
                case 'albums':
                    router.push({ path: '/album', query: { id: item.id } })
                break
                case 'playlists':
                    router.push({ path: '/playlist/detail', query: { id: item.id } })
                break
            }
            info.isShowSearch = false
        };

        return {
            ...toRefs(info),
            getSerachSuggest,
            handleFocus,
            handleInput,
            jumpSearch,
            jumpPage,
        }
    },
})

</script>

<style lang="less" scoped>
.search {
    position: relative;
    display: flex;
    text-align: right;
    align-items: center;
    border-bottom: 1px solid #999;
    background: #fff;

    .keyVal {
        width: 250px;
        border: 0;

        :deep(input) {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border: none;
        }
    }

    .icon-search {
        font-size: 20px;
        padding-top: 3px;
        margin: 0 10px;
        cursor: pointer;
    }
}
.hot-search {
    h5 {
        font-size: 18px;
    }

    .hot-search-list {
        padding: 10px 0 0;
    }
    .hot-item {
        line-height: 28px;
        cursor: pointer;

        .top-0 {
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
        }

        .top-1 {
            font-weight: bold;
            color: rgba(255, 0, 0, .6);
        }

        .top-2 {
            font-weight: bold;
            color: rgba(255, 0, 0, .4);
        }

        img {
            display: inline-block;
            width: auto;
            height: 16px;
            padding: 6px 0;
            vertical-align: top;
        }

        &:hover {
            color: #222;
        }
    }
}
.search-item {
    border-top: solid 1px #f2f2f2;
    margin: -1px -12px 0;

    h6 {
        font-size: 14px;
        line-height: 36px;
        color: #666;
        padding: 0 12px;
    }

    .list {
        line-height: 36px;
        color: #999;
        padding: 0 12px 0 40px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
            color: #fff;
            background: var(--color-text-height);
        }
    }

    &:first-child {
        border: 0;
    }
}
</style>