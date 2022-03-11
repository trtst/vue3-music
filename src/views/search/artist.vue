<template>
    <div class="list-container">
        <template v-for="item in list">
            <artist-item :item="item"></artist-item>
        </template>
        <template v-if="loading">
            <Loading />
        </template>
    </div>
</template>
<script>
import Loading from '@components/Loading.vue';
import ArtistItem from '@components/ArtistItem.vue'
import { defineComponent, reactive } from "vue";

export default defineComponent({
    name: 'searchArtist',
    props: {
        list: { // 歌手信息
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Loading,
        ArtistItem
    },
})
</script>
<style lang="less" scoped>
.list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 40px;
    margin-right: -40px;

    &::after {
        content: '';
        width: 30%;
    }
}
</style>