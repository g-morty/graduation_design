<template>
  <div class="paper-box">
    <el-upload class="upload-demo" drag action="https://morty.xiaomy.net/api/bigData/exam/submit" multiple :before-upload="beforeAvatarUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传word文件，且不超过50Mb</div>
    </el-upload>
    <!-- <el-upload class="upload-demo" :limit="1" drag name="abc.mp4" action="https://morty.xiaomy.net/api/bigData/cource/videoPush" :before-upload="beforeAvatarUpload" :on-success="getAudioUrl">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip" v-if="!hasUpload">只能上传视频文件，且不超过100M</div>
              <div class="el-upload__tip" slot="tip" v-else>上传成功:{{form.fileName}}</div>
            </el-upload> -->
  </div>
</template>

<script>
import Axios from 'axios';
export default {
    methods: {
        beforeAvatarUpload(file) {
            var fileSize = file.size / 1024 / 1024 < 10;
            if (
                file.name.split('.')[file.name.split('.').length - 1] != 'docx' &&
                file.name.split('.')[file.name.split('.').length - 1] != 'doc'
            ) {
                this.$message.error('请上传正确的文件格式');
                return false;
            }
            if (!fileSize) {
                this.$message.error('文件大小不能超过10MB');
                return false;
            }
            this.uploadPaper(file);
            return false;
        },
        async uploadPaper(file) {
            console.log(file);
            const formdata = new FormData();
            formdata.append('multipartFile', file);
            const res = await Axios.post('/api/bigData/exam/submit', formdata, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            console.log(res);
            if (res.status === 200 && res.data.code == 200) {
                this.$message.success('交卷成功');
            } else {
                this.$message.error(res.data.msg);
            }
        }
    }
};
</script>

<style scoped>
.paper-box {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 50px;
}
</style>