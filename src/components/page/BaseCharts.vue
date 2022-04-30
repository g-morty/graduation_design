<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-pie-chart"></i> 成绩图表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="schart-box">
        <div class="filter-box">
          <div class="content-title">柱状图</div>
          <div class="filter-1">
            <div style="margin-right: 10px">章节: </div>
            <el-select v-model="value" placeholder="请选择" @change="getScoreList">
              <el-option v-for="item in examList" :key="item.id" :label="item.examName" :value="item.examName">
              </el-option>
            </el-select>
          </div>
        </div>
        <schart class="schart" canvasId="bar" :options="options1" v-if="scoreList.length > 0"></schart>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import Schart from 'vue-schart';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            options1: {
                type: 'bar',
                title: {
                    text: '各个学生成绩汇总表'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '成绩',
                        fillColor: '#adcdff',
                        data: []
                    }
                ]
            },
            scoreList: [],
            value: '',
            classList: [],
            examList: []
        };
    },
    mounted() {
        this.getClassList();
    },
    methods: {
        async getClassList() {
            const res = await Axios.post('/api/bigData/exam/selectAll', {});
            console.log(res);
            if (res.status == 200 && res.data.code == 200) {
                this.classList = res.data.data;
                this.dealWithClass(res.data.data);
                // this.value = res.data.data[0].courceName;
                this.getScoreList();
            }
        },
        dealWithClass(classList) {
            console.log(classList);
            // this.examList = classList.map
            const temExamList = [];
            classList.map((v) => temExamList.push(...v.examList));
            console.log(temExamList);
            this.examList = temExamList;
            this.value = temExamList[0].examName;
        },
        changeType(e) {
            console.log(e);
        },
        async getScoreList() {
            console.log(this.value);
            const res = await Axios.post('/api/bigData/user/selectAll', {
                examName: this.value
            });
            console.log(res);
            if (res.status == 200 && res.data.code == 200) {
                this.scoreList = res.data.data;
                this.dealWithScore(res.data.data);
            }
        },
        dealWithScore(dealData) {
            console.log(dealData);
            const nameList = dealData.map((v) => v.userName);
            const scroeList = dealData.map((v) => {
                if (v.examSorces.length > 0) {
                    return parseFloat(v.examSorces[0].examScore);
                } else {
                    return 0;
                }
            });
            // console.log(nameList);
            // console.log(scroeList);
            this.options1.labels = nameList;
            this.options1.datasets[0].data = scroeList;
        }
    }
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.filter-box {
    display: flex;
    align-items: center;
}
.filter-1 {
    display: flex;
    align-items: center;
    margin-left: 30px;
    margin-right: 10px;
}
</style>