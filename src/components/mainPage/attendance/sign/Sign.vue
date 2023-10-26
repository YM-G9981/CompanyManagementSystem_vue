<template>
  <el-card style="padding: auto;">
    <SignSelectState v-model:signs="signs"/>
    <el-row style="margin-top: 30px;">
      <el-col :span="6">
        <el-button class="statistic" :style="elStatistic" type="primary" plain @click="show(0)">
          <el-statistic title="全部签到" :value="state1+state2+state3"   />
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button class="statistic" :style="elStatistic" type="primary" plain @click="show(1)">
          <el-statistic title="签到正常" :value="state1"  />
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button class="statistic" :style="elStatistic" type="primary" plain @click="show(2)">
          <el-statistic title="迟到" :value="state2" />
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-button class="statistic" :style="elStatistic" type="primary" plain @click="show(3)">
          <el-statistic title="早退" :value="state3" />
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="signs" style="width: 100% ;margin-top: 15px;" max-height="500px" @selection-change="handleSelection" >
        <el-table-column prop="signUser.personal.name" label="姓名" width="250" />
        <el-table-column prop="signStatus" :formatter="switchStatus" label="签到状态" width="250" />
        <el-table-column prop="signTime" :formatter="switchTime" label="签到时间" width="250" />
        <el-table-column prop="signPicture" label="签到图片" width="250" />
        <el-table-column prop="signLocation" label="签到位置" width="250" />

      </el-table>
  </el-card>
</template>
<script>
import axios from 'axios'
import SignSelectState from './SignSelectState.vue'
  export default {
  components: { SignSelectState },
    data (){
      return {
        value : "",
        signs :[],
        state1 : 0,
        state2 : 0,
        state3 : 0,
        signs1 :[],
        signs2 :[],
        signs3 :[],
        signsAll:[],
        elStatistic :{
          width: "50%" , 
          height : "fit-content"
        }
      }
    },
    created(){
      this.getAllSigns()
    }
    ,methods:{
      watchSigns(){
        this.state1 = 0
        this.state2 = 0
        this.state3 = 0
        this.signs1 = []
        this.signs2 = []
        this.signs3 = []
        for(var i =0; i<this.signs.length;i++){
          switch(this.signs[i].signStatus){
            case 1: {
              this.state1++
              this.signs1.push(this.signs[i])
              break
            }
            case 2:{
              this.state2++
              this.signs2.push(this.signs[i])
              break
            }
            case 3:{
              this.state3++
              this.signs3.push(this.signs[i])
              break
            }
          }
          Object.assign(this.signsAll,this.signs)
        }
      },
      switchStatus(row){
        switch(row.signStatus){
                case 1: return "签到正常"
                case 2: return "迟到"
                case 3: return "早退"
            }

      },
      switchTime(row){
            return row.signTime.split("T")[0];
      },
      show(state){
        switch(state){
            case 1: {
              this.signs = this.signs1
              break
            }
            case 2:{
              this.signs = this.signs2
              break
            }
            case 3:{
              this.signs = this.signs3
              break
            }
            case 0:{
              this.signs = this.signsAll
              break
            }
          }
      },
      getAllSigns(){
        axios.post("/getSignRecord/getAllSignRecord").then(
          (res) => this.signs = res.data
        )
      }
    }

    ,watch:{
      signs : function(){
        this.watchSigns()
      }
    }
  }
</script>

<style>
</style>