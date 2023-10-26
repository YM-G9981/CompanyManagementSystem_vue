<template>
    <div>
        <el-alert :title="successAlert" type="success" v-show="successAlertShow"/>
        <el-alert :title="errorAlert" type="error" v-show="errorAlertShow"/>
    </div>
    <el-card class="box-card">
        <div class="mt-4" style="width :100%">
            <el-row >
                <DepartmentSelectState v-model:departments = "this.departments" />
            </el-row>
        </div>
    </el-card>
    <el-card class="box-card">
        <el-table :data="departments" style="text-align: center;" max-height="500px" @selection-change="handleSelection">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="departmentName" label="部门名" width="150"/>
            <el-table-column prop="departmentState" :formatter = "switchDepartmentState" label="部门状态" width="150" /> 
            <el-table-column prop="departmentManager.name" label="部门领导" width="150"  />
            <el-table-column prop="departmentLocation" label="部门位置" width="150" />
            <el-table-column prop="superiorDepartment.departmentName" label="上级部门" width="150" />
            <el-table-column prop="departmentCreateTime" :formatter="switchTime" label="部门创建日期" width="150" /> 
            <el-table-column fixed="right"  #default="scope"><el-button link type="primary" ><el-icon @click="modifyDepartment(scope.$index)"><Edit /></el-icon></el-button></el-table-column> 
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="showDepartment(scope.$index)"><el-icon><Search /></el-icon></el-button></el-table-column>
            <el-table-column fixed ="right" #default="scope"><el-button link type="primary" @click="deleteOneSelection(scope.$index)"><el-icon><Delete /></el-icon></el-button></el-table-column> 
    </el-table>
    <div id ="addDiv">
        <el-button circle id = "addButtton"   @click="showDailog = true"><el-icon><Plus /></el-icon></el-button>
    </div>
    <div id ="export" style="margin-top: 30px;">
            <el-button circle id = "exportButtton"   @click="exportDepartments"><el-icon><Folder /></el-icon></el-button>
        </div>
    <el-dialog 
        width="30%"
        v-model="showDailog" 
        :before-close="closeDailog"
        center>
        <span>请选择添加部门的方式</span>
        <template #footer>
                <el-row>
                    <el-col :span="12"><el-button type="primary" @click="addNewDepartment(true)">单个添加</el-button></el-col>
                    <el-col :span="12"><el-button type="primary" @click="addNewDepartment(false)">批量添加</el-button></el-col>
                </el-row>
        </template>
    </el-dialog>

    <div id = "dangerDiv">
        <el-button type="danger" id = "dangerButton"  v-show ="display" @click="deleteSelectedSelection"><el-icon><Delete /></el-icon></el-button>
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
import axios from 'axios'

import fileDownload from 'js-file-download';
import DepartmentSelectState from './DepartmentSelectState.vue'
export default {
    props :{
    },
  components: { DepartmentSelectState },
    data (){
        return {
            departments:[],
            display : false,
            successAlert:"",
            errorAlert:"",
            successAlertShow:false,
            errorAlertShow:false,
            dialogVisible : false,
            delDepartmentIds : [],
            page : "showDepartmentList",
            showDailog:false
        }
    },
    created(){
        
        
        this.created()
    },
    
    methods :{
        exportDepartments(){
            axios.get("/exportHrmResource/getDepartmentsExcel",{
        responseType: 'blob',
      }).then(
                (res)=>{
                    fileDownload(res.data, '部门导出.xlsx');
                }
            )
        },
        created(){
            this.departments=[]
            this.display = false
            this.successAlert=""
            this.errorAlert=""
            this.successAlertShow=false
            this.errorAlertShow=false
            this.dialogVisible = false
            this.delDepartmentIds = [],
            this.page = "showDepartmentList",
            this.showDailog=false
            this.getAllDepartments()
        },
        getAllDepartments(){
            axios.post("/getDepartment/getAllDepartments").then(
            response => (this.departments = response.data)
            )
            
        },
        switchDepartmentState (row){
            
            switch(row.departmentState){
                case 1: return "开业"
                case 2: return "暂时封存"
                case 3: return "永久封存"
            }
        },
        handleSelection(val){
            this.delDepartments = val
            this.display = this.delDepartments.length>0
        },
        deleteOneSelection(index){
            this.delDepartmentIds = [this.departments[index].departmentId]
            this.dialogVisible = true
        },
        deleteSelectedSelection(){
            this.delDepartmentIds = [];
            for(var department in this.delDepartments){
                this.delDepartmentIds.push(department.departmentId)
            }
            this.dialogVisible = true
        }
        ,showDepartment(index){
            this.$emit("update:showPage","showDepartment")
            this.$emit("update:departmentId",this.departments[index].departmentId)
            this.$emit("update:mode","show")
        }
        ,deleteSelection(){
            this.dialogVisible = false
            var data = JSON.stringify(this.delDepartmentIds)
            axios.post("/dropHrmResource/dropDepartments",data).then(
            (res) =>{
                if(res.data){
                    this.successAlert = "删除成功！"
                    this.successAlertShow = true;
                    
                }else{
                    this.errorAlert  = "删除失败"
                    this.errorAlertShow = true;
                }
            } ).catch((e)=>{
                this.errorAlert  = "网络请求错误"
                    this.errorAlertShow = true;
            })
        },modifyDepartment(index){
            this.$emit("update:showPage","showDepartment")
            this.$emit("update:departmentId",this.departments[index].departmentId)
            this.$emit("update:mode","modify")
            
        }
        ,switchTime(row){
            return row.departmentCreateTime.split("T")[0];
        },
        addNewDepartment(b){
            if(b){
                this.$emit("update:mode","single")
                this.$emit("update:showPage","addNewDepartment")
                
            }
            else{
                this.$emit("update:mode","batch") 
               this.$emit("update:showPage","addNewDepartment")
            }
        },
        closeDailog(){
            this.showDailog = false;
        }
       
    }
        
    
}
</script>

<style>
#dangerButton {
    margin-top :15px;
    margin-left: 55px;
}
#dangerDiv {
    text-align: left;
}
#addDiv{
    margin-top: 20px;
}
</style>