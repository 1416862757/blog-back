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
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="author" label="作者" align="center" sortable width="150">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center" sortable width="200">
                </el-table-column>
                <el-table-column prop="summary" label="摘要" align="center" sortable width="200">
                </el-table-column>
                <el-table-column prop="browse" label="流量" align="center" sortable width="80">
                </el-table-column>
                <el-table-column prop="create_date" label="创建时间" align="center" sortable>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleAdd(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                        @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增文章" :visible.sync="addVisible" width="60%">
            <el-form :model="article" ref="form" :rules="rules" label-width="100px" label-position="left">
                <el-form-item label="标题:">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="标签:">
                    <el-select v-model="article.tagId" placeholder="请选择">
                        <el-option
                            v-for="(item) in tagList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="图片:">
                    <div class="crop-demo">
                        <img :src="cropImg" class="pre-img"><br/>
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </el-form-item>
                <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                                 style="width:100%;height:300px;"></vue-cropper>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
                </el-dialog>

                <el-form-item label="作者:">
                    <el-input v-model="article.author"></el-input>
                </el-form-item>
                <el-form-item label="摘要:">
                    <el-input v-model="article.summary"></el-input>
                </el-form-item>
                <el-form-item label="内容:">
                    <Editor id="tinymce" v-model="article.content" :init="editorInit"></Editor>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/modern/theme'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'
    import VueCropper from 'vue-cropperjs';

    export default {
        name: 'Article',
        components: {Editor},
        data() {
            return {
                tableData: [],
                del_list: [],
                current: 1,
                multipleSelection: [],
                del_list: [],
                file: {},
                addVisible: false,
                tagList: [],
                article: {
                    title: "",
                    tagId: "",
                    picUrl: "./static/img/img.jpg",
                    author: "",
                    summary: "",
                    content: ""
                },
                rules: {},
                editorInit: {},
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                isAdd: true,
                idx: -1,
                delVisible: false,
            }
        },
        created() {
            this.getData();
            this.cropImg = this.article.picUrl;
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    // if (!is_del) {
                    //     if (d.address.indexOf(this.select_cate) > -1 &&
                    //         (d.name.indexOf(this.select_word) > -1 ||
                    //             d.address.indexOf(this.select_word) > -1)
                    //     ) {
                    return d;
                    // }
                    // }
                })
            }
        },
        methods: {
            handleDelete(index, row) {
                this.idx = index;
                this.del_list.push(row.id)
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            // 确定删除
            deleteRow(){
                let _this = this;
                let url = "/api/article"
                if (_this.del_list.length > 0){
                    url = "/api/article?" + _this.qs.stringify({ids: _this.del_list}, { arrayFormat: 'repeat' })
                }
                _this.$axios.delete(url).then(
                    res => {
                        console.log(res)
                        if (res.data.code == 200){
                            this.tableData.splice(this.idx, 1);
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error('删除出错');
                        }
                    }
                )
                this.delVisible = false;
            },
            // 获取文章列表
            getData() {
                this.$axios.post("/api/article/list", {params: {current: 1, size: 5}})
                    .then((res) => {
                        this.tableData = res.data.data.records;
                    })
            },
            // 分页导航
            handleCurrentChange(val) {
                this.current = val;
                this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAdd(index, row) {
                const _this = this;
                // 获取标签列表
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
                if (row != null) {
                    _this.idx = index;
                    _this.article = {
                        id: row.id,
                        title: row.title,
                        picUrl: row.pic_url,
                        author: row.author,
                        summary: row.summary,
                        content: row.content
                    };
                    _this.cropImg = row.pic_url;
                    _this.isAdd = false;
                } else {
                    _this.article = {
                        title: "",
                        tagId: "",
                        picUrl: "",
                        author: "",
                        summary: "",
                        content: ""
                    };
                    _this.cropImg = "./static/img/img.jpg";
                    _this.isAdd = true;
                }

                this.addVisible = true;
            },
            // 保存编辑
            saveAdd() {
                const _this = this
                if (_this.isAdd) {
                    let formData = new FormData();
                    formData.append('file', _this.file);
                    formData.append('path', "1001");
                    let config = {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                    _this.$axios.post("/api/file/upload", formData, config)
                        .then(res => {
                            if (res.data.code = 200) {
                                _this.$message.success('图片上传成功');
                                _this.article.picUrl = res.data.data;
                                console.log(_this.article)
                                _this.$axios.post("/api/article", _this.article)
                                    .then((res) => {
                                        if (res.data.code == 200) {
                                            _this.$message.success('新增文章成功');
                                        }
                                    })
                            }
                        })
                } else {
                    if (_this.cropImg == _this.article.picUrl) {
                        _this.$axios.put("/api/article", _this.article).then(
                            res => {
                                if (res.data.code == 200) {
                                    _this.$message.success(`修改第 ${_this.idx+1} 行成功`);
                                }
                            }
                        )
                    } else {
                        let formData = new FormData();
                        formData.append('file', _this.file);
                        formData.append('path', "1001");
                        let config = {
                            headers: {'Content-Type': 'multipart/form-data'}
                        }
                        _this.$axios.post("/api/file/upload", formData, config).then(
                            res => {
                                if (res.data.code = 200) {
                                    _this.$message.success('图片上传成功');
                                    _this.article.picUrl = res.data.data;
                                    _this.$axios.put("/api/article", _this.article).then(
                                        (res) => {
                                            if (res.data.code == 200) {
                                                _this.$message.success(`修改第 ${_this.idx+1} 行成功`);
                                            }
                                        })
                                }
                            }
                        )
                    }
                }

                _this.$set(_this.tableData, _this.idx, _this.article);
                _this.addVisible = false;
            },
            setImage(e) {
                this.file = e.target.files[0];
                if (!this.file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(this.file);
            },
            cropImage() {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop() {
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
        },
        mounted() {
            this.editorInit = {
                language_url: '/static/tinymce/zh_CN.js',
                language: 'zh_CN',
                skin_url: '/static/tinymce/skins/lightgray',
                height: 300,
                plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                toolbar:
                    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                branding: false

            };
            tinymce.init({});
        },

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

    .pre-img {
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }

    .crop-demo {
        display: flex;
        align-items: flex-end;
    }

    .crop-demo-btn {
        position: relative;
        width: 110px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
    }

    .crop-input {
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>
