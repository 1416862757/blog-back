<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 文章管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="handleAdd()">新增</el-button>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增文章" :visible.sync="addVisible" width="60%">
            <el-form :model="article" ref="form" :rules="rules" label-width="100px" label-position="left">
                <el-form-item label="标题:">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select v-model="article.tagId" placeholder="请选择">
                        <el-option
                            v-for="(item) in tagList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作者:">
                    <el-input v-model="article.author"></el-input>
                </el-form-item>
                <el-form-item label="摘要:">
                    <el-input v-model="article.summary"></el-input>
                </el-form-item>
                <quill-editor ref="form" v-model="article.content"></quill-editor>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        name: 'Article',
        components: {
            quillEditor
        },
        data() {
            return {
                addVisible: false,
                tagList: [],
                article: {
                    title: "",
                    tagId: "",
                    author: "",
                    summary: "",
                    content: ""
                },
                rules: {}
            }
        },
        methods: {
            handleAdd() {
                const _this = this;
                if (_this.tagList.length == 0) {
                    _this.$axios.get("/api/tag")
                        .then((res) => {
                            const data = res.data;
                            console.log(data)
                            if (data.code == 200) {
                                _this.tagList = data.data;
                            } else {
                                _this.$message.error('标签数据错误');
                            }
                        })
                }
                this.addVisible = true;
            },
            // 保存编辑
            saveAdd() {
                const _this = this;
                console.log(_this.article)
                _this.$axios.post("/api/article", _this.article)
                    .then((res) => {

                    })
                this.addVisible = false;
            },
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }
</style>
