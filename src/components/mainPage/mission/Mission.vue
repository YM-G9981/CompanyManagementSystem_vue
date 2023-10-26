<template>
    <el-card>
      <MissionSlelectType v-model:missions="missions"/>
      <el-table :data="missions" style="width: 100% " max-height="500px" @selection-change="handleSelection" >
        <el-table-column fixed type="selection" width="55" />
        <el-table-column prop="missionTitle" label="标题" width="200" />
        <el-table-column prop="missionType.missionTypeTitle" label="类型" width="150" />
        <el-table-column prop="missionTime" :formatter="switchMissionTime" label="开始时间" width="200" />
        <el-table-column prop="deadlineTime" :formatter="switchDeadlineTime" label="截止日期" width="200" />
        <el-table-column prop="missionInitiateUser.personal.name" label="任务发布人" width="200" />
        <el-table-column prop="missionState" :formatter="switchState" label="任务状态" width="200" />
        <el-table-column fixed="right"  #default="scope">
            <el-button link type="primary" >
                <el-icon @click="getShowMission(scope.$index)">
                    <Search />
                </el-icon>
            </el-button>
        </el-table-column> 
        <el-table-column fixed="right"  #default="scope">
            <el-button link type="primary" >
                <el-icon @click="deleteMission(scope.$index)">
                    <Delete />
                </el-icon>
            </el-button>
        </el-table-column> 
        
      </el-table>
      <div id ="addDiv">
            <el-button circle id = "addButtton"   @click="this.$emit('update:mainPage','addNewMission')"><el-icon><Plus /></el-icon></el-button>
        </div>
      <div id = "dangerDiv">
          <el-button type="danger" id = "dangerButton"  v-show ="display" @click="dialogVisible = true"><el-icon><Delete /></el-icon></el-button>
      </div>
    </el-card> 
    <el-dialog
        v-model="showVisible"
        width="70%"
    >
    <template #header>
    <el-descriptions :title="showMission.missionTitle" column="3">
      <el-descriptions-item label="类型">{{ showMission.missionType.missionTypeTitle }}</el-descriptions-item>
      <el-descriptions-item label="开始时间"   >{{ switchMissionTime(showMission) }}</el-descriptions-item>
      <el-descriptions-item label="截止日期"   >{{ switchDeadlineTime(showMission) }}</el-descriptions-item>
      <el-descriptions-item label="任务发布人"   >{{ showMission.missionInitiateUser.personal.name }}</el-descriptions-item>
      <el-descriptions-item label="任务发布状态"   >{{ switchState(showMission) }}</el-descriptions-item>
    </el-descriptions>
    <span>
      {{ showMission.missionContext }}
    </span>
    
    </template>
    <el-table :data="showMission.missionUser" max-height="500px" style="text-align: center;" >
      <el-table-column prop="personal.name" label="人员姓名" width="250" />
       <el-table-column prop="personal.jobNumber" label="工号" width="250" />
      <el-table-column  prop="personal.position.positionName" label="职位" width="250" /> 
     </el-table> 
    </el-dialog>
    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
    >
    <span>确认删除吗</span>
    <template #footer>
    <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteSelection">确认</el-button>
        </span>
        </template>
    </el-dialog>
  </template>
  
  <script>
  import axios from 'axios';
  import MissionSlelectType from './MissionSlelectType.vue';
  export default {
    components: {  MissionSlelectType },
    data(){
      return {
        display : false,
        missions :[],
        delMissions:[],
        dialogVisible:false,
        showVisible:false,
        showMission:{}
      }
    },
    created(){
      this.loadMissions()
    },
    methods:{
        switchMissionTime(row){
        return row.missionTime.split("T")[0];
      },
      switchDeadlineTime(row){
        return row.deadlineTime.split("T")[0];
      },
      handleSelection(val){
        this.delMissions = val
        this.display = this.delMissions.length>0
      },
      deleteMission(index){
        this.delMissions = [this.missions[index]]
        this.dialogVisible = true
      },
      switchState(state){
        if(state) return "未完成"
        else return "已完成"
      },
      loadMissions(){
        axios.post("/mission/getAllMissions").then(
          (res)=>{
            this.missions =  res.data
          }
        )
      },
      getShowMission(index){
        this.showMission = this.missions[index]
        this.showVisible = true
      },
      deleteSelection(){
        var dropIds = []
        for(var i = 0;i<this.delMissions.length;i++){
            dropIds.push(this.delMissions[i].missionId)
        }
        axios.post("/mission/delMissions",dropIds).then(
            (res)=>{
                if(res.data){
                    alert("删除成功")
                    this.dialogVisible =false
                    this.loadMissions()
                }else{
                    alert("删除失败")
                }
            }
        )
      }
    }
  }
  </script>
  
  <style>
  
  </style>