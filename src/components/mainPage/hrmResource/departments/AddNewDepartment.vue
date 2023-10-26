<template>
    <el-card id="addDepartmentCard">
        <el-form :model="department" label-width="120px" v-if="mode == 'single'"> 
            
            <el-form-item label="部门名">
                <el-input class="input" v-model="department.departmentName" placeholder="部门名字不为空" clearable />
            </el-form-item>
            <el-form-item label="部门描述">
                <el-input class="input" v-model="department.departmentDescribe" :rows="3" placeholder="部门描述建议不为空"  clearable />
            </el-form-item>
            <el-form-item label="部门状态">
                <el-select class="input" v-model="department.departmentState" placeholder="部门状态不为空">
                        <el-option label="开业" value="1" />
                        <el-option label="暂时封存" value="2" />
                        <el-option label="永久封存" value="3" />
                    </el-select>
            </el-form-item>
            <el-form-item label="部门位置">
                <el-input class="input" v-model="department.departmentLocation" placeholder="部门位置建议不为空" clearable />
            </el-form-item>
            <el-form-item label="上级部门">
                <el-select class="input" v-model="department.superiorDepartment" @focus="getAllDepartment" clearable>
                        <el-option
                            v-for="department in departmentList"
                            :key="department.departmentName"
                            :label="department.departmentName"
                            :value="department"
                        />
                    </el-select>
            </el-form-item>
            <el-form-item label="部门创建时间">
                <el-date-picker
                        v-model="department.departmentCreateTime"
                        type="date"
                        class="input" 
                    />
            </el-form-item>
            <el-button type="primary" round @click="summit">提交</el-button>
        </el-form>
        <div v-if="mode == 'batch'" >
            <el-row>
               <el-col :span="24"><el-button type="primary" @click="download">下载导入模板</el-button></el-col> 
            </el-row>
            <el-upload
                class="upload-demo"
                action="/importHrmResource/batchImportDepartments"
                multiple
                :limit="1"
                style="margin-top: 30px"
                accept=".xlsx"
                drag 
            >
            <el-button type="primary" >选择文件</el-button>
            <template #tip>
                <div class="el-upload__tip">
                请上传xlsx文件或拖拽上传
                </div>
            </template>
            </el-upload>
        </div>
    </el-card>
</template>
<script>
import axios from 'axios'
import { ref } from '@vue/reactivity'
import fileDownload from 'js-file-download';
const config = {
  headers:{
    "Content-Type":"multipart/form-data"
  }
};
var newDepartment = {'departmentName':'','departmentDescribe':'','departmentState':'','departmentLocation':'','superiorDepartment':null,'departmentCreateTime':'','departmentManager':null};
export default {
    props :{
        mode:String
    },
    data(){
        return{
            department : newDepartment,
            departmentList :[],
            file: {}
        }
    },
    methods :{
        getAllDepartment(){
            axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departmentList =  res.data
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        },
        summit(){
            if(this.department.departmentManager!=null){
                this.department.departmentManager = {"personalId":this.department.departmentManager.personalId}
            }
            axios.post("/modifyHrmResource/singleModifyDepartment",this.department).then(
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
        },
        download(){
            axios.get("/importHrmResource/batchImportDepartmentsTemple",{
        responseType: 'blob',
      }).then(
                (res)=>{
                    fileDownload(res.data, '部门导入模板.xlsx');
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        }
    }
}
</script>

<style>
.input{
    width: 100%;
}
#addDepartmentCard{
    padding: 15%;
    padding-top: 50px;
    padding-bottom: 0px;
}
</style>