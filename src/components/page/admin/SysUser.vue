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
                <el-table-column prop="createTime" label="日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="mobile" label="电话" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增用户" :visible.sync="addVisible" width="35%">
            <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-position="left">
                <el-form-item label="用户名:" prop="username" required>
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password" required>
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="mobile" required>
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email" required>
                    <el-input v-model="form.email"></el-input>
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
            return {
                tableData: [],
                current: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                addVisible: false,
                form: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ""
                },
                idx: -1,
                rules: {}
            }
        },
        created:function () {
            this.getData();
            let rules =
                this.initValidate([
                    "mobile",
                    "email",
                    "password",
                ]);
            rules.username = {required: true, message: '用户名不能为空', trigger: 'blur'};
            this.$data.rules = rules;
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
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                this.$axios.get("/api/sys-user", {params: {current: 1, size: 5}})
                    .then((res) => {
                        this.tableData = res.data.data.records;
                    })
            },

            handleAdd() {
                this.addVisible = true;
            },
            // 保存编辑
            saveAdd() {
                if (this.form.username == "" ||
                        this.form.password == "" ||
                        this.form.email == "" ||
                        this.form.mobile == ""){
                    return;
                }
                this.$axios.post("/api/sys-user", this.form).then((res) => {
                    console.log(res)
                })
            },
            search() {
                this.is_search = true;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
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
