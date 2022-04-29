<template>
  <section class="main">
    <div class="container">
      <div class="plugins-tips">
        将图库拖入右侧即可组卷
      </div>
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">题库</div>
          <draggable v-model="questionList" @remove="removeHandle" :options="dragOptions">
            <transition-group tag="div" id="todo" class="item-ul">
              <div v-for="item in questionList" class="drag-list" :key="item.id">
                {{item.topicContent}}
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="drag-box-item">
          <div class="item-title">组卷</div>
          <draggable v-model="questionListBeChoose" @remove="removeHandle" :options="dragOptions">
            <transition-group tag="div" id="doing" class="item-ul">
              <div v-for="item in questionListBeChoose" class="drag-list" :key="item.id">
                {{item.topicContent}}
              </div>
            </transition-group>
          </draggable>
          <el-button type="primary" class="zujuan" @click="ShowZuJuan">确认</el-button>
        </div>
      </div>
    </div>
    <el-drawer size="30%" title="组卷" :visible.sync="isShowZuJuan" direction="btt" :before-close="handleClose">
      <div class="zujuan-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="卷子名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="卷子分数">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item label="选择课程">
            <el-select v-model="form.class" placeholder="请选择课程">
              <el-option v-for="(item , index) in classList" :key="index" :label="item.courceName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="sure-zujuan" @click="ouloadZuJuan" :loading="isUpload">确认组卷</el-button>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import Axios from 'axios';

import draggable from 'vuedraggable';
export default {
    name: 'draglist',
    data() {
        return {
            dragOptions: {
                animation: 120,
                scroll: true,
                group: 'sortlist',
                ghostClass: 'ghost-style'
            },
            questionList: [],
            questionListBeChoose: [],
            classList: [],
            isShowZuJuan: false,
            form: {
                name: '',
                score: 100,
                class: ''
            },
            isUpload: false
        };
    },
    components: {
        draggable
    },
    created() {
        this.getQuestionList();
        this.getClassList();
    },

    methods: {
        removeHandle(event) {
            console.log(event);
            this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
        },
        async getQuestionList() {
            const res = await Axios.post('/api/bigData/bTopic/selectAll', {
                page: 0, //分页页码，数字类型
                limit: 100
            });
            if (res.status == 200 && res.data.code == 200) {
                this.questionList = res.data.data;
            }
            // console.log(res);
        },
        async getClassList() {
            const res = await Axios.post('/api/bigData/cource/selectFirstTitle');
            console.log(res);
            if (res.status == 200 && res.data.code == 200) {
                this.classList = res.data.data;
            }
        },
        ShowZuJuan() {
            console.log(this.questionListBeChoose);
            this.isShowZuJuan = true;
        },

        hideZuJuan() {
            this.isShowZuJuan = false;
        },

        handleClose(done) {
            this.$confirm('确认关闭？')
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        onSubmit() {
            console.log('submit!');
        },
        async ouloadZuJuan() {
            console.log(this.form);
            const uploadData = this.getUploadData();
            this.isUpload = true;
            const res = await Axios.post('/api/bigData/exam/makePaper', uploadData);
            this.isUpload = false;
            if (res.status == 200 && res.data.code == 200) {
                this.hideZuJuan();
                setTimeout(() => {
                    this.$message({
                        type: 'success',
                        message: '组卷成功'
                    });
                }, 0);
            } else {
                this.$message({
                        type: 'warning',
                        message: '组卷失败，请重试'
                    });
            }
            console.log(res);
        },
        getUploadData() {
            const topicNum = this.questionListBeChoose.map((v) => v.id);
            const cId = this.form.class;
            const examName = this.form.name;
            const examScore = Number(this.form.score.toString());
            console.log({
                topicNum,
                cId,
                examName,
                examScore
            });
            return {
                topicNum,
                cId,
                examName,
                examScore
            };
        }
    }
};
</script>

<style scoped>
.drag-box {
    display: flex;
    user-select: none;
}
.drag-box-item {
    flex: 1;
    max-width: 330px;
    min-width: 300px;
    background-color: #eff1f5;
    margin-right: 16px;
    border-radius: 6px;
    position: relative;
    border: 1px #e1e4e8 solid;
}
.item-title {
    padding: 8px 8px 8px 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-weight: 600;
}
.item-ul {
    padding: 0 8px 8px;
    height: 500px;
    overflow-y: scroll;
}
.item-ul::-webkit-scrollbar {
    width: 0;
}
.drag-list {
    border: 1px #e1e4e8 solid;
    padding: 10px;
    margin: 5px 0 10px;
    list-style: none;
    background-color: #fff;
    border-radius: 6px;
    cursor: pointer;
    -webkit-transition: border 0.3s ease-in;
    transition: border 0.3s ease-in;
}
.drag-list:hover {
    border: 1px solid #20a0ff;
}
.drag-title {
    font-weight: 400;
    line-height: 25px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.ghost-style {
    display: block;
    color: transparent;
    border-style: dashed;
}
.zujuan {
    width: 100%;
}
.zujuan-box {
    padding: 0 40px;
}
.sure-zujuan {
    width: 100%;
}
/* .btn-group {
    display: flex;
    justify-content: space-between;
} */
</style>
