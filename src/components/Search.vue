<template>
    <div class="search">
        <el-select
            v-model="keyVal"
            class="keyVal"
            clearable
            filterable
            remote
            placeholder="请输入歌名、歌词、歌手或专辑"
            :remote-method="remoteMethod"
            :fit-input-width="true"
            :loading="loading"
            loading-text="搜索中..."
            @focus="handleFocus"
        >
            <div class="hot-search" v-if="!keyVal">
                <h5>热门搜索</h5>
                <el-option
                    v-for="(item, index) in serachHot"
                    :key="index"
                    :label="item.first"
                    :value="item.first"
                    @click="jumpSearch(item)"
                >
                    <span :class="[ index < 3 ? 'top-' + index : '']">{{(index + 1) + '.'}}</span>
                    {{item.first}}
                </el-option>
            </div>
            <el-option-group
                v-else
                v-for="list in suggestInfo"
                :key="listType[list.label]"
                :label="listType[list.label]"
                class="aaa"
            >
                <el-option
                    v-for="(item, index) in list.info"
                    :key="list.label + index"
                    :label="item.name"
                    :value="list.label + item.name"
                    class="item"
                    @click="jumpPage(item, list.label)"
                >
                    {{item.name}}
                    <template v-if="list.label === 'songs'">
                        -  <span class="artists" v-for="(a, i) in item.artists" :key="i">{{(i !== 0 ? ' / ' : '') + a.name}}</span>
                    </template>
                    <template v-else-if="list.label === 'albums'">
                        -  <span class="artists">{{item.artist.name}}</span>
                    </template>
                </el-option>
            </el-option-group>
        </el-select>
    </div>
</template>
<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const info = reactive({
            keyVal: '',
            serachHot: [],
            suggestInfo: [],
            loading: false,
            listType: {
                songs: '单曲',
                artists: '歌手',
                albums: '专辑',
                playlists: '歌单'
            },
        });

        const remoteMethod = (query) => {
            info['keyVal'] = query;

            if (info['keyVal']) {
                info['loading'] = true;
                info['suggestInfo'] = [];
                
                getSerachSuggest();
            }
        };

        //搜索框，获取焦点时，请求热门搜索列表接口
        const handleFocus = () => {
            console.log(info['keyVal']);
            if (info['keyVal']) {
                info['loading'] = true;
                info['suggestInfo'] = [];
                
                getSerachSuggest();
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
            const { data: res } = await proxy.$http.serachSuggest({ keywords: info.keyVal });

            info['loading'] = false;
            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            if (res.result.order) {
                info['suggestInfo'] = res.result.order.map(item => {
                    return {
                        label: item,
                        info: res.result[item]
                    }
                })
            }
        };

        // 默认热门搜索列表，点击后台跳转到搜索结果页面
        const jumpSearch = (item) => {
            info.keyVal = item.first
            if (item.first === route.query.key) {
                return
            }
            router.push({ path: '/search', query: { key: item.first } })
        };

        // 搜索建议列表，点击后跳转到相对应的落地页
        const jumpPage = (item, type) => {
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
        };

        onMounted(() => {
            getSearchHot();
        });

        return {
            ...toRefs(info),
            remoteMethod,
            handleFocus,
            getSerachSuggest,
            jumpSearch,
            jumpPage,
        }
    },
})

</script>
<style>
.el-select-dropdown__wrap {
    max-height: 400px;
}
</style>
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
}
.hot-search {
    h5 {
        padding: 5px 0 5px 20px;
        font-size: 18px;
    }

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
}

.item {
    padding-right: 20px;

    .artists {
        font-size: 12px;
        color: var(--color-text);
    }

    &.selected {
        color: var(--color-text-height);

        .artists {
            color: var(--color-text-height);
        }
    }
}
</style>