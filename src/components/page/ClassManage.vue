<template>
  <div class="the-box">
    <!-- 章 -->
    <div v-for="(item, index) in tuPu" :key="index">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="item-class">
              第{{index + 1}}章：{{item.educationName}}
            </div>
          </template>
          <!-- 节 -->
          <div class="sub-class-box" v-for="(theItem) in item.courceList" :key="theItem.id">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  <div class="item-class-sub">
                    {{theItem.courceName}}
                    <el-button type="success" @click.stop="showAddClass(theItem)">增加课程</el-button>
                  </div>
                </template>
                <div v-for="(inItem, inIndex) in theItem.cources" :key="inIndex">
                  <div class="last-class">
                    {{inItem.courceName}}
                    <div class="btn-group">
                      <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showUploadPpt(inItem)"></el-button>

                      <!-- <el-upload class="upload-demo" action="https://morty.xiaomy.net/api/bigData/cource/videoPush"  multiple :limit="1" >
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                      </el-upload> -->
                      <el-button @click="deleteClass(inItem)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </div>

                  </div>
                </div>
              </el-collapse-item>

            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-drawer size="50%" title="增加课程" :visible.sync="isShowAddClass" direction="btt" :before-close="handleClose">
      <div class="add-class-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <div style="margin-left:14px;">
            <div style="font-size=14px;margin: 0 0 10px;">视频上传</div>
            <el-upload class="upload-demo" :limit="1" drag name="abc.mp4" action="https://morty.xiaomy.net/api/bigData/cource/videoPush" :before-upload="beforeAvatarUpload" :on-success="getAudioUrl">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip" v-if="!hasUpload">只能上传视频文件，且不超过100M</div>
              <div class="el-upload__tip" slot="tip" v-else>上传成功:{{form.fileName}}</div>
            </el-upload>
          </div>
        </el-form>
        <el-button class="add-btn" type="primary" @click="sureUploadClass">确定</el-button>
      </div>
    </el-drawer>
    <el-drawer size="57%" title="上传课件" :visible.sync="isShowUploadPpt" direction="btt" :before-close="handleClose">
      <div class="add-class-box">

        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="课件名称">
            <el-input v-model="ppt.name"></el-input>
          </el-form-item>
          <el-form-item label="课件描述">
            <el-input v-model="ppt.des"></el-input>
          </el-form-item>
          <div style="margin-left:14px;">
            <div style="font-size=14px;margin: 0 0 10px;">视频上传</div>
            <el-upload class="upload-demo" :limit="1" drag name="abc.mp4" action="https://morty.xiaomy.net/api/bigData/cource/videoPush" :before-upload="beforeAvatarUploadPpt" :on-success="getAudioUrl">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip" v-if="!ppt.hasUpload">只能上传ppt文件，且不超过10M</div>
              <div class="el-upload__tip" slot="tip" v-else>上传成功：{{ppt.url}}</div>
            </el-upload>
          </div>
        </el-form>
        <el-button class="add-btn" type="primary" @click="sureUploadPpt">确定</el-button>
      </div>
    </el-drawer>
  </div>

</template>

<script>
import Axios from 'axios';
export default {
    data() {
        return {
            tuPu: [],
            singleClass: {},
            singleSubClass: {},
            isShowAddClass: false,
            form: {
                name: '',
                fileName: ''
            },

            hasUpload: false,
            isShowUploadPpt: false,
            ppt: {
                name: '',
                des: '',
                url: '',
                hasUpload: false
            }
        };
    },
    mounted() {
        this.getTuPu();
    },
    methods: {
        async getTuPu() {
            const res = await Axios.post('/api/bigData/cource/selectAll');
            // console.log(res);
            if (res.status == 200 && res.data.code == 200) {
                console.log(res.data.data[0]);
                this.tuPu = res.data.data;
            }
        },
        handleClose(done) {
            done();
            // this.$confirm('确认关闭？')
            //     .then((_) => {

            //     })
            //     .catch((_) => {});
        },
        showAddClass(classInfo) {
            // console.log(classInfo);
            this.singleClass = classInfo;
            this.isShowAddClass = true;
        },
        hideAddClass() {
            this.isShowAddClass = false;
        },
        async beforeAdd() {
            // "id": null, //新增课程id 传null就行
            // "eId": null, //考试卷纸id 新增的时候传null
            // "educationId": 1, //这个固定写1就行
            // "courceName": "1.4.5大数据导论第一章第四节第五点", //课程名称
            // "courceLocation": "", //课程视频存储地址
            // "courceId": 35 //上一级标题id  通过下拉获得
        },
        getAudioUrl(a, b, c) {
            console.log(a);
            console.log(b);
            console.log(c);
        },
        beforeAvatarUploadPpt(file) {
            console.log(file);
            var fileSize = file.size / 1024 / 1024 < 10;

            if (file.type.substring(0, 15) != 'application/vnd') {
                this.$message.error('请上传正确的文件格式');
                return false;
            }
            if (!fileSize) {
                this.$message.error('文件大小不能超过10MB');
                return false;
            }

            this.uploadPpt(file);
            return false;
        },
        beforeAvatarUpload(file) {
            var fileSize = file.size / 1024 / 1024 < 100;
            if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
                this.$message.error('请上传正确的视频格式');
                return false;
            }
            if (!fileSize) {
                this.$message.error('视频大小不能超过100MB');
                return false;
            }

            this.uploadAudio(file);
            return false;
            // const isJPG = file.type === 'image/jpeg';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            // if (!isJPG) {
            //     this.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
        },
        async uploadAudio(file) {
            const formdata = new FormData();
            formdata.append('multipartFile', file);
            const res = await Axios.post('/api/bigData/cource/videoPush', formdata, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            if (res.status === 200 && res.data.code == 200) {
                this.hasUpload = true;
                this.form.fileName = res.data.msg;
            }
        },
        async sureUploadClass() {
            const classInfo = this.getClassInfo();
            const res = await Axios.post('/api/bigData/cource/insert', classInfo);
            console.log(res);
            if (res.status == 200 && res.data.code === 200) {
                this.hideAddClass();
                this.getTuPu();
            }
        },
        getClassInfo() {
            const courceName = this.form.name;
            const courceLocation = this.form.fileName;
            const educationId = 1;
            const courceId = this.singleClass.id;
            // console.log({
            //     courceName,
            //     courceLocation,
            //     educationId,
            //     courceId
            // });
            return {
                courceName,
                courceLocation,
                educationId,
                courceId
            };
        },
        async deleteClass(classInfo) {
            const formData = new FormData();
            formData.append('id', classInfo.id);
            const res = await Axios.post('/api/bigData/cource/delete', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            console.log(res);
            if (res.status == 200 && res.data.code == 200) {
                this.getTuPu();
            } else {
                this.$message.error('操作失败');
            }
        },
        showUploadPpt(subClass) {
            this.singleSubClass = subClass;
            console.log(subClass);
            this.isShowUploadPpt = true;
        },
        hideUploadPpt() {
            this.isShowUploadPpt = false;
        },
        async uploadPpt(file) {
            // console.log(file);
            const formdata = new FormData();
            formdata.append('multipartFile', file);
            const res = await Axios.post('/api/bigData/cource/videoPush', formdata, {
                headers: { 'content-type': 'multipart/form-data' }
            });
            // console.log(res);
            if (res.status === 200 && res.data.code == 200) {
                this.$message.success('上传成功');
                this.ppt.hasUpload = true;
                this.ppt.url = res.data.msg;
                // this.hideUploadPpt();
            }
        },
        async sureUploadPpt() {
            console.log(this.ppt);
            console.log(this.singleSubClass);
            const resourceName = this.ppt.name;
            const resourceDes = this.ppt.des;
            const cId = this.singleSubClass.id;
            const resourceLocation = this.ppt.url;
            const res = await Axios.post('/api/bigData/resource/insert', {
                resourceName,
                resourceDes,
                cId,
                resourceLocation
            });
            console.log(res);
            if (res.status === 200 && res.data.code === 200) {
                this.$message.success('添加课件成功');
                this.hideUploadPpt();
                this.ppt = {
                    name: '',
                    des: '',
                    url: '',
                    hasUpload: false
                };
            }
        }
    }
};
</script>

<style scoped>
.the-box {
    border-radius: 10px;
    overflow: hidden;
}
.item-class {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 30%;
    margin-left: 20px;
}
.item-class-sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-left: 20px;
    padding-right: 40px;
}
.item-class-content {
    margin-left: 30px;
    margin-right: 30px;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dffaff;
}
.sub-class-box {
    margin: 0 20px;
}
.last-class {
    margin: 0 40px;
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    /* width: 100%; */
    justify-content: space-between;
}
.add-class-box {
    margin: 0 30px;
}
.add-btn {
    width: 100%;
    margin-top: 40px;
}
.btn-group {
    display: flex;
    justify-content: center;
    transform: scale(0.8);
}
</style>