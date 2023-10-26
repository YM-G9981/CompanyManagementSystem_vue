<template>
    <el-card id="addDepartmentCard">
        <el-form :model="mission" label-width="120px"> 
            <el-form-item label="任务标题">
                <el-input class="input" v-model="mission.missionTitle" placeholder="部门描述建议不为空"  clearable />
            </el-form-item>
            <el-form-item label="任务类型">
                <el-select class="input" v-model="mission.missionType" @focus="getAllMissionType" clearable>
                        <el-option
                            v-for="missionType in missionTypeList"
                            :key="missionType.missionTypeId"
                            :label="missionType.missionTypeTitle"
                            :value="missionType"
                        />
                    </el-select>
            </el-form-item>
            <el-form-item label="任务内容">
                <el-input class="input" :rows="5" v-model="mission.missionContext" placeholder="任务内容不为空" clearable />
            </el-form-item>
            <el-form-item label="任务时间">
                <el-date-picker
                    v-model="mission.missionTime"
                    type="date"
                    class="input"
                    style="width:100%" 
                    />
            </el-form-item>
            <el-form-item label="截止时间">
                <el-date-picker
                    v-model="mission.deadlineTime"
                    type="date"
                    style="width:100%"
                    class="input" 
                    />
            </el-form-item>
            <el-transfer v-model="mission.missionUser" :data="personalItems" />
            <el-button type="primary" round @click="summit">提交</el-button>
        </el-form>
    </el-card>
</template>
<script>
import axios from 'axios'
var newMission = {'missionTitle':'','missionTime':'','missionType':'','deadlineTime':'','missionContext':null,'missionUser':""};
export default {
    props :{
        mode:String
    },
    data(){
        return{
            mission : newMission,
            missionTypeList :[],
            personals:[],
            personalItems:[]
        }
    },
    created(){
        this.getAllPersonals()
    },
    methods :{
        getAllPersonal(){
            axios.post("/getPersonal/getAllPersonals").then(
                (res)=>{
                    this.personals =  res.data
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })},
      getAllMissionType(){
            axios.post("/missionType/getAllMissionType").then(
                (res)=>{
                    this.missionTypeList =  res.data
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
          })
        },
        getAllPersonals(){
            var personals = []
            this.personalItems = []
            axios.post("getPersonal/getAllPersonals").then( (res) => {
               personals = res.data
               for(var i = 0;i<personals.length;i++){
                delete personals[i].department
                this.personalItems.push({
                    key:personals[i].user,
                    label:personals[i].name,
                    disabled:personals[i].user==null
                })
            }
            }).catch(e=>{
         alert("网络错误，请稍后重试")
      });
            
        },
        summit(){
            axios.post("/mission/saveMission",this.mission).then(
                (res)=>{
                    if(res.data){
                        alert("提交成功")
                        this.department = this.newDepartment
                    }else{
                        alert("提交失败")
                    }
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
            })
        }
    }
}
</script>

<style>
</style>