<template>
    <div class='reply-comment'>
        <h3>我回复@{{params.user.nickname}}:</h3>
        <div class="comment_textarea">
            <div class="pre">{{msg}}</div>
            <textarea class="J_inpBox inp-paragraph" name="leave_msg" id="leave_msg" placeholder="期待你的神评论……" v-model="msg"></textarea>
        </div>
        <div class="comment_box_footer">
            <span class="comment_limit"><em class="num">{{msg.length}}</em>/{{maxLen}}</span>
            <el-button type="primary" color="#ff641e" @click="subReplyComment">评论</el-button>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
export default {
    name: 'replyComment',
    props: ['params'],
    setup(props, { emit }) {
        const info = reactive({
            msg: '',
            maxLen: 140
        });

        const subReplyComment = () => {
            emit('replyMsg', info['msg']);
        };

        watch(() => info['msg'], () => {
            info['msg'] = info['maxLen'] >= info['msg'] ? info['msg'] : info['msg'].substring(0, info['maxLen'])
        })

        return {
            ...toRefs(info),
            subReplyComment
        }
    }
}
</script>
<style scoped lang="less">
.reply-comment {
    padding: 10px 15px;
    background: #fafafa;
    border-radius: 6px;
    box-shadow: 0 0px 27px rgb(0 0 0 / 6%) inset;

    h3 {
        line-height: 14px;
        padding-bottom: 10px;
        font-size: 14px;
        font-weight: normal;
        color: #999;
    }
}
.comment_textarea {
    position: relative;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    background: #fff;
}

.pre {
    visibility: hidden;
}

.inp-paragraph {
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% - 20px);
    resize: none;
    width: auto;
    padding: 0;
    border: 0;
    margin: 0;
    font-family: inherit;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
}

.inp-paragraph, .pre {
    width: calc(100% - 30px);
    padding: 10px 15px;
    line-height: 24px;
    min-height: 24px;
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word
}
.comment_box_footer {
    padding: 15px 0 0;
    text-align: right;
}

.comment_limit {
    display: inline-block;
    line-height: 28px;
    padding: 0 20px;
    font-size: 14px;
    color: #666;

    em {
        font-style: normal;
    }
}
</style>
