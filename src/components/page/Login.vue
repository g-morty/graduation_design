<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">辅助学习系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter.native="submitForm()">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="primary" @click="reg()">注册</el-button>
        </div>
        <p class="login-tips" @click="submitForm()">Tips : 学生注册</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data: function () {
        return {
            param: {
                username: 'admin',
                password: '123123'
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },

    methods: {
        async login() {
            console.log(this.param.username);
            console.log(this.param.password);
            if (this.param.username == '' || this.param.password == '') {
                this.$message.error('请输入账号和密码');
                return;
            }
            const res = await axios.post('/api/bigData/user/login', {
                userName: this.param.username, //用户名
                passWord: this.param.password //密码
            });
            console.log(res);
            if (res.status === 200) {
                if (res.data.code == 200) {
                    this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.param.username);
                    localStorage.setItem('ms_type', res.data.user.role);
                    this.$router.push('/');
                } else {
                    this.$message.error(res.data.msg);
                }

            }
        },
        async reg() {
            console.log(this.param.username);
            console.log(this.param.password);
            if (this.param.username == '' || this.param.password == '') {
                this.$message.error('请输入账号和密码');
                return;
            }
            const res = await axios.post('/api/bigData/user/regist', {
                userName: this.param.username, //用户名
                passWord: this.param.password, //密码
                role: 'student'
            });
            console.log(res.status);
            console.log(res.data);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    this.$message.success('注册成功');
                    localStorage.setItem('ms_username', this.param.username);
                    localStorage.setItem('ms_type', 'student');
                    this.$router.push('/');
                } else {
                    this.$message.error(res.data.msg);
                }
            }
        },
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.param.username);
                    this.$router.push('/');
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
    display: flex;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>