<template>
  <el-card>
    <template #header>
        <div class="card-header"  >
            <el-descriptions :title="showDepartment.departmentName" v-if="showMode == 'show'">
                <el-descriptions-item label="部门描述">{{ showDepartment.departmentDescribe }}</el-descriptions-item>
                <el-descriptions-item label="部门状态" v-if="showDepartment!=null">{{ switchDepartmentState(showDepartment.departmentState) }}</el-descriptions-item>
                <el-descriptions-item label="部门位置">{{ showDepartment.departmentLocation }}</el-descriptions-item>
                <el-descriptions-item label="上级部门" v-if=" showDepartment.superiorDepartment!=null">{{ showDepartment.superiorDepartment.departmentName }}</el-descriptions-item>
                <el-descriptions-item label="部门创建时间">{{ switchTime(showDepartment.departmentCreateTime) }}</el-descriptions-item>
                <el-descriptions-item label="部门管理者" v-if="showDepartment.departmentManager!=null">{{ showDepartment.departmentManager.name }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions  v-if="showMode == 'modify'">
                <el-descriptions-item label="部门名字"><el-input style="width:100%" v-model="showDepartment.departmentName" placeholder="部门名字不为空" clearable /></el-descriptions-item>
                <el-descriptions-item label="部门描述"><el-input style="width:100%" v-model="showDepartment.departmentDescribe" :rows="3" type="textarea"  clearable /></el-descriptions-item>
                <el-descriptions-item label="部门状态">
                    <el-select style="width:100%" v-model="showDepartment.departmentState">
                        <el-option label="开业" :value=1 />
                        <el-option label="暂时封存" :value=2 />
                        <el-option label="永久封存" :value=3 />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="部门位置"><el-input style="width:100%" v-model="showDepartment.departmentLocation" placeholder="部门名字不为空" clearable /></el-descriptions-item>
                <el-descriptions-item label="上级部门">
                    <el-select style="width:100%" v-model="showDepartment.superiorDepartment" clearable @clear="showDepartment.superiorDepartment=null">
                        <el-option
                        v-for="department in departmentList"
                        :key="department.departmentName"
                        :label="department.departmentName"
                        :value="department"
                        :disabled="department.departmentId==showDepartment.departmentId"
                        />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="部门创建时间">
                    <el-date-picker
                        style="width:100%" v-model="showDepartment.departmentCreateTime"
                        type="date"
                    />
                </el-descriptions-item>
                <el-descriptions-item label="部门管理者" >
                    <el-select style="width:100%" v-model="showDepartment.departmentManager" clearable>
                        <el-option
                        v-for="personal in showDepartment.personals"
                        :key="personal.name"
                        :label="personal.name"
                        :value="personal"
                        />
                    </el-select>
                </el-descriptions-item>
            </el-descriptions>
            <div> <el-button type="primary" round @click="confirm">{{ text }}</el-button></div>
        </div> 
    </template>
        <el-table :data="showDepartment.personals" style="text-align: center;" max-height="500px" @selection-change="handleSelection">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="name" label="人员姓名" width="150"/>
            <el-table-column prop="jobNumber" label="工号" width="150" />
            <el-table-column v-if="position!=null" prop="position.positionName" label="职位" width="150" />
            <el-table-column fixed="right"><el-button link type="primary" >修改</el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="(scope.$index)"><el-icon><Search /></el-icon></el-button></el-table-column>
        </el-table>
        <el-alert :title="errorAlert" type="error" v-show="errorAlertShow"/>
</el-card> 

</template>

<script>
import axios from 'axios';
export default {
    props :{
        showDepartmentId : String,
        mode :String,
    },
    data(){
        return{
           showDepartment : {},
           dropPersonals :[],
           deletePersonalsId:[],
           display:false,
           departmentList:[],
           text :"",
           showMode:this.mode
        }
    },
    methods :{
        getShowDepartment(){
            axios.post("/getDepartment/getDepartmentById/"+this.showDepartmentId).then(
            (res) =>{
                this.showDepartment = res.data[0]
            })
        }
        ,handleSelection(val){
            this.dropPersonals = val
            this.display = this.delDepartments.length>0
        }
        ,switchDepartmentState (row){
            switch(row){
                case 1: return "开业"
                case 2: return "暂时封存"
                case 3: return "永久封存"
            }
        }
        ,switchTime(time){
            return time.split("T")[0];
        }
        ,deleteSelectedSelection(){
            this.deletePersonalsId = [];
            for(var personal in this.dropPersonals){
                this.deletePersonalsId.push(personal.personalId)
            }
            this.dialogVisible = true
        },
        getAllDepartment(){
            axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departmentList =  res.data
                }
            )
        },
        confirm(){
            if(this.showMode =="show"){
                this.showMode = "modify"
            }else{
                axios.post("/modifyHrmResource/singleModifyDepartment",this.showDepartment).then(
                (res)=>{
                    if(res.data){
                        alert("修改成功")
                        this.showMode = "show"
                        this.getShowDepartment();
                    }else{
                        alert("修改失败")
                    }
                }
            ).catch(e=>{
                
            })
            }
        }
    },
    created(){
      this.getShowDepartment()
      this.getAllDepartment()
      if(this.showMode=="modify"){
                this.text= "提交"
            }else{
                this.text = "修改"
            }
    },
    watch:{
        showMode:function(){
            if(this.showMode=="modify"){
                this.text= "提交"
            }else{
                this.text = "修改"
            }
        }
    }
}
</script>
<style>

</style>