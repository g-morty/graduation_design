<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-submenu :index="index.toString()" v-for="(item ,index) in knowledgeList" :key="index">
            <template slot="title">
              <span>{{item.educationName}}</span>
            </template>
            <el-menu-item-group v-for="(subItem , subIndex) in item.courceList" :key="subIndex">
              <template slot="title">
                <h2>{{subItem.courceName}}</h2>
              </template>
              <div v-if="subItem.cources.length > 0">
                <el-menu-item :index="index + '-' + subIndex +'-' + k" v-for="(v,k) in subItem.cources" :key="k" @click="showClassDetail(v)">
                  {{v.courceName}}
                </el-menu-item>
              </div>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>

    <el-drawer size="50%" :title="classDetail.title" v-loading="true" :visible.sync="isShowClassDetail" direction="btt" :before-close="hideClassDetail">
      <div class="class-box">
        <el-table v-loading="isShowClassFile" :data="classFile">
          <el-table-column label="视频" width="180" v-if="classDetail.audio">
            <el-button type="primary" @click="audioDown">下载</el-button>
          </el-table-column>
          <el-table-column label="课件" width="180" v-if="classDetail.ppt">
            <el-button type="primary" @click="pptDown">下载</el-button>
          </el-table-column>
          <el-table-column label="卷子" v-if="classDetail.paper">
            <el-button type="primary" @click="paperDown">下载</el-button>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn-group">
        <el-button class="pinglun" type="primary" @click="open">评论</el-button>
      </div>
      <div class="class-box class-box-comment">
        <!-- commentList: [],
            isGetCommentList: false -->
        <el-table :data="commentList" style="width: 100%" v-loading="isGetCommentList">
          <el-table-column prop="userName" label="姓名" width="180"> </el-table-column>
          <el-table-column prop="time" label="评价时间" width="180"> </el-table-column>
          <el-table-column prop="messageContent" label="评价内容"> </el-table-column>
          <el-table-column label="操作" width="120" fixed="right" v-if="isTeacher">
            <template slot-scope="scope">
              <el-button type="primary" @click="deleteComment(scope.row)" :loading="isDeleteComment">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  
    <!-- <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2019-11-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>东莞</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
                    <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                
            </el-col>
        </el-row> -->
    <!-- <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row> -->
  </div>
</template>

<script>
import Axios from 'axios';
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            },
            knowledgeList: [],
            isShowClassDetail: false,
            classDetail: {
                title: '',
                id: ''
            },
            classFile: [
                // {
                //     audio: '',
                //     ppt: '',
                //     pager: ''
                // }
                // {
                //     date: '2016-05-03',
                //     name: '王小虎',
                //     address: '上海市普陀区金沙江路 1518 弄'
                // }
            ],
            isShowClassFile: true,
            isDown: false,
            commentList: [],
            isGetCommentList: false,
            isTeacher: false,
            isDeleteComment: false
        };
    },
    mounted() {
        this.getKnowledgeList();
        this.judgeIsTeacher();
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        judgeIsTeacher() {
            const ms_type = localStorage.getItem('ms_type');
            console.log(ms_type);
            this.isTeacher = ms_type === 'teacher';
        },
        async getKnowledgeList() {
            const res = await Axios.post('/api/bigData/cource/selectAll');
            if (res.data.code == 200) {
                this.knowledgeList = res.data.data;
            }
            console.log(res.data.data);
        },
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        showClassDetail(classInfo) {
            this.isShowClassDetail = true;
            console.log(classInfo);
            Object.assign(this.classDetail, {
                id: classInfo.id,
                title: classInfo.courceName,
                audio: classInfo.courceLocation
            });
            console.log(this.classDetail);
            this.getClassFile();
            this.getComment();
        },
        hideClassDetail() {
            this.isShowClassDetail = false;
        },
        async getClassFile() {
            this.isShowClassFile = true;
            const audio = this.classDetail.audio;
            let ppt = '';
            let paper = '';

            const pptRes = await Axios.post('/api/bigData/resource/selectAll', {
                cId: this.classDetail.id
            });
            if (pptRes.status == 200 && pptRes.data.code == 200 && pptRes.data.data.length > 0) {
                ppt = pptRes.data.data[0].resourceLocation;
            }

            const paperRes = await Axios.post('/api/bigData/exam/selectAll', {
                courceName: this.classDetail.title, //课程名称  做筛选
                page: 0, //分页页码，数字类型
                limit: 1
            });
            if (paperRes.status == 200 && paperRes.data.code == 200 && paperRes.data.data.length > 0) {
                paper = paperRes.data.data[0].examList[0].id;
            }
            this.classFile = [
                {
                    audio,
                    ppt,
                    paper
                }
            ];
            this.classDetail.ppt = ppt;
            this.classDetail.paper = paper;
            this.isShowClassFile = false;
        },
        async downFile(filePath) {
            const format = new FormData();
            format.append('path', filePath);
            const res = await Axios.get('/api/bigData/cource/videoPull', format, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        async audioDown() {
            const audioUrl = this.classDetail.audio;
            if (audioUrl === '') return;
            const a = document.createElement('a');
            a.href = `https://morty.xiaomy.net/api/bigData/cource/videoPull?path=${audioUrl}`;
            a.click();
        },
        async pptDown() {
            const pptUrl = this.classDetail.ppt;
            if (pptUrl === '') return;
            const a = document.createElement('a');
            a.href = `https://morty.xiaomy.net/api/bigData/cource/videoPull?path=${pptUrl}`;
            a.click();
        },
        async paperDown() {
            const paperUrl = this.classDetail.paper;
            if (paperUrl === '') return;
            const a = document.createElement('a');
            a.href = `https://morty.xiaomy.net/api/bigData/exam/examPull?id=${paperUrl}`;
            a.click();
        },
        async getComment() {
            const cId = this.classDetail.id;
            this.isGetCommentList = true;
            const res = await Axios.post('/api/bigData/message/selectMyMessage', {
                cId
            });
            this.isGetCommentList = false;
            // console.log(res);
            if (res.status === 200 && res.data.code === 200) {
                this.commentList = this.getNewArr(res.data.data);
                console.log(this.commentList);
            }
        },
        getNewArr(oldArr) {
            const newArr = [];
            oldArr.map((v) => {
                console.log(v);
                newArr.push(...v);
            });
            return newArr;
        },
        open() {
            this.$prompt('请输入评论', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputErrorMessage: '评论不能为空'
            })
                .then(({ value }) => {
                    this.uploadComment(value);
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
        },
        async uploadComment(com) {
            console.log(com);
            const commentData = this.getCommentData(com);
            const res = await Axios.post('/api/bigData/message/insert', commentData);
            if (res.status == 200 && res.data.code == 200) {
                this.getComment();
            }
        },
        getCommentData(com) {
            const messageContent = com;
            const uId = Number(localStorage.getItem('user_id'));
            const date = new Date();
            const time = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                .getDay()
                .toString()
                .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
                .getSeconds()
                .toString()
                .padStart(2, '0')}`;
            const cId = this.classDetail.id;
            return {
                messageContent,
                uId,
                time,
                cId
            };
        },
        async deleteComment(commentInfo) {
            this.isDeleteComment = true;
            const res = await Axios.post('/api/bigData/message/delete', {
                id: commentInfo.id
            });
            this.isDeleteComment = false;
            if (res.status == 200 && res.data.code == 200) {
                this.getComment();
            }
        }

        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
.el-menu {
    overflow: hidden;
}
.class-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 40px;
    padding-right: 40px;
}
.btn-group {
    padding: 0 40px;
}
.pinglun {
    display: block;
    width: 100%;
    margin-top: 40px;
}
.class-box-comment {
    margin-top: 20px;
    margin-bottom: 80px;
}
</style>
