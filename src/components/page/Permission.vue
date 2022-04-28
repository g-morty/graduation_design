<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-warn"></i> 权限不足</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <h1>提示</h1>
      <p>只有教师才有此权限显示改页面</p>
      <p>如需更换账号，请<router-link to="/login" class="logout">退出登录</router-link>。并登录教师账号
      </p>
    </div>

  </div>
</template>

<script>
export default {
    data: function () {
        return {};
    }
};
</script>

<style scoped>
h1 {
    text-align: center;
    margin: 30px 0;
}
p {
    line-height: 30px;
    margin-bottom: 10px;
    text-indent: 2em;
}
.logout {
    color: #409eff;
}
</style>