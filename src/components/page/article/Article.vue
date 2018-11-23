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

        <!-- 编辑弹出框 -->
        <el-dialog title="新增用户" :visible.sync="addVisible" width="35%">
            <el-form :model="form" ref="form" :rules="rules" label-width="80px" label-position="left">
                <!--<el-form-item label="手机号:" prop="mobile"-->
                <!--:rules="filter_rules({required:true,type:'mobile'})">-->
                <!--<el-input v-model="form.mobile"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="联系电话:" prop="mobile" required>
                    <el-input v-model="form.mobile"></el-input>
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
    export default {
        name: 'basetable',
        data() {
            var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
                if (!value) {
                    return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                    // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                    // 所以我就在前面加了一个+实现隐式转换

                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (phoneReg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式不正确'))
                        }
                    }
                }, 100)
            }
            return {
                addVisible: true,
                form: {
                    username: '',
                    password: '',
                    email: '',
                    mobile:""
                },
                idx: -1,
                rules:{
                    mobile: [
                        { validator: checkPhone, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleAdd() {
                this.addVisible = true;
            },
            // 保存编辑
            saveAdd() {
                this.$refs[this.form].validate()

                // this.$set(this.tableData, this.idx, this.form);
                // this.addVisible = false;
                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
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
