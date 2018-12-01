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
                    <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
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
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'Article',
        components: {Editor},
        data() {
            return {
                file: {},
                addVisible: false,
                tagList: [],
                article: {
                    title: "",
                    tagId: "",
                    picUrl: "",
                    author: "",
                    summary: "",
                    content: ""
                },
                rules: {},
                editorInit: {},
                defaultSrc: './static/img/img.jpg',
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
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
                const _this = this
                let formData = new FormData();
                formData.append('file', _this.file);
                formData.append('path', "1001");
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                _this.$axios.post("/api/file/upload", formData, config)
                    .then(res =>{
                        if (res.data.code = 200){
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


                this.addVisible = false;
            },
            setImage(e){
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
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
        },
        mounted(){
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
        created(){
            this.cropImg = this.defaultSrc;
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

    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
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
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>
