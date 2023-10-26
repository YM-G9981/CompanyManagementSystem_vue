<template>
  <el-card>
    <LeaveSelectState v-model:leaves="leaves"/>
    <el-table :data="leaves" style="width: 100% " max-height="500px" @selection-change="handleSelection" >
      <el-table-column fixed type="selection" width="55" />
      <el-table-column prop="leaveId" label="序号" width="150" />
      <el-table-column prop="leaveBeginDate" :formatter="switchBeginDate" label="开始时间" width="250" />
      <el-table-column prop="leaveEndDate" :formatter="switchEndDate" label="结束时间" width="250" />
      <el-table-column prop="leavePersonal.name" label="名字" width="250" />
      <el-table-column fixed="right"  #default="scope"><el-button link type="primary" >
        <el-icon @click="deleteLeave(scope.$index)"><Delete /></el-icon></el-button></el-table-column> 
            
    </el-table>
    <div id = "dangerDiv">
        <el-button type="danger" id = "dangerButton"  v-show ="display" @click="dialogVisible = true"><el-icon><Delete /></el-icon></el-button>
    </div>
  </el-card> 
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
import LeaveSelectState from './LeaveSelectState.vue';
export default {
  components: { LeaveSelectState },
  data(){
    return {
      display : false,
      leaves :[],
      delLeaves:[],
      dialogVisible:false
    }
  },
  created(){
    this.loadLeaves()
  },
  methods:{
    switchBeginDate(row){
      return row.leaveBeginDate.split("T")[0];
    },
    switchEndDate(row){
      return row.leaveEndDate.split("T")[0];
    },
    handleSelection(val){
      this.delLeaves = val
      this.display = this.delLeaves.length>0
    },
    deleteLeave(index){
      this.delLeaves = [this.leaves[index]]
      this.dialogVisible = true
    },
    loadLeaves(){
      axios.post("/leave/getAllLeaves").then(
        (res)=>{
          this.leaves =  res.data
        }
      ).catch(e=>{
         alert("网络错误，请稍后重试")
      }
      )
    },
    deleteSelection(){
      var dropIds = []
      for(var i = 0;i<this.delLeaves.length;i++){
          dropIds.push(this.delLeaves[i].leaveId)
      }
      axios.post("/leave/delLeaves",dropIds).then(
          (res)=>{
              if(res.data){
                  alert("删除成功")
                  this.dialogVisible =false
                  this.loadLeaves()
              }else{
                  alert("删除失败")
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