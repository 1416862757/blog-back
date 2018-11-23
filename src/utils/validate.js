exports.install = function (Vue, options) {
    Vue.prototype.initValidate = function (rules) {//全局函数1
        const object = new Object();
        for (let i = 0; i < rules.length; i++) {
            switch (rules[i]) {
                case "mobile":
                    object.mobile = [
                        {required: true, message: '手机号不能为空', trigger: 'blur'},
                        {type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur'},
                        {
                            validator: function (rule, value, callback) {
                                if (value != null && value != "") {
                                    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                                    if (!reg.test(value)) {
                                        callback(new Error('您输入的手机号不正确!'))
                                    } else {
                                        callback()
                                    }
                                }
                                else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ];
                    break;
                case "email":
                    object.email = [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {
                            validator: function (rule, value, callback) {
                                if (value != null && value != "") {
                                    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                                    if (!reg.test(value)) {
                                        callback(new Error('您输入的邮箱不正确!'))
                                    } else {
                                        callback()
                                    }
                                }
                                else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ];
                    break;
            }
        }
        return object;
    };
};
