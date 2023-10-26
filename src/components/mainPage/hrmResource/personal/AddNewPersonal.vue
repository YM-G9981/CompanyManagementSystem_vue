<template>
    <el-card id="addPersonalCard" >
        <el-form :model="personal" label-width="120px" v-if="mode == 'single'"> 
            <el-form-item label="工号">
                <el-input class="input" v-model="personal.jobNumber" placeholder="工号不为空" clearable />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input class="input" v-model="personal.name" :rows="3" placeholder="名字不为空"  clearable />
            </el-form-item>
            
            <el-form-item label="性别">
                <el-select class="input" v-model="personal.sex" placeholder="人员性别不为空">
                    <el-option label="男" value=1 />
                    <el-option label="女" value=2 />
                </el-select>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker
                    v-model="personal.birthday"
                    type="date"
                    class="input" 
                    clearable
                    @change="personal.age = parseInt((new Date()-personal.birthday)/31536000000,10)"
                    style="width:100%"
                    />
            </el-form-item>
            <el-form-item label="年龄">
                <el-input class="input" v-model="personal.age"  placeholder="年龄不为空" clearable disabled/>
            </el-form-item>
              
            <el-form-item label="电话">
                <el-input class="input" v-model="personal.phone"  placeholder="电话不为空" clearable />
            </el-form-item>
            <el-form-item label="入职日期">
                <el-date-picker
                    v-model="personal.hireDate"
                    type="date"
                    class="input" 
                    clearable
                    style="width:100%"
                    />
            </el-form-item> 
            <el-form-item label="身份证号">
                <el-input class="input" v-model="personal.idnumber"  placeholder="身份证不为空" clearable  />
            </el-form-item> 
            
            <el-form-item label="人员状态">
                <el-select class="input" v-model="personal.state" placeholder="人员状态不为空">
                    <el-option label="在职" value=1 />
                    <el-option label="离职" value=2 />
                    <el-option label="实习生" value=3 />
                    <el-option label="临时工" value=4 />
                </el-select>
            </el-form-item>

            <el-form-item label="部门">
                <el-select
                    v-model="personal.department"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请选择部门"
                    remote-show-suffix
                    :remote-method="loadDepartments"
                    style="width:100%"
                >
                    <el-option
                        v-for="department in departments"
                        :key="department.departmentId"
                        :label="department.departmentName"
                        :value="department"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="直接上级">
                <el-select
                    v-model="personal.superior"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请选择人员"
                    remote-show-suffix
                    :remote-method="loadPersonals"
                    style="width:100%"
                >
                    <el-option
                        v-for="personal in superiors"
                        :key="personal.personalId"
                        :label="personal.name"
                        :value="personal"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="职位">
                <el-select class="input" v-model="personal.position"  clearable placeholder="请选择职位">
                        <el-option
                            v-for="position in positions"
                            :key="position.positionId"
                            :label="position.positionName"
                            :value="position"
                        />
                    </el-select>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="addNewUser" label="添加用户名密码" size="large" />
            </el-form-item>
            <div v-if="addNewUser==true">
                <el-form-item label="用户名">
                    <el-input class="input" v-model="personal.user.username" placeholder="用户名不为空" clearable />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input class="input" v-model="personal.user.password" type="password" :rows="3" placeholder="密码不为空"  clearable />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input class="input" v-model="personal.user.email" placeholder="邮箱不为空" clearable />
                </el-form-item>
            </div>
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
                :before-upload="beforeUpload"
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
var newPersonal = {"age":null,"personalId":null,"sex":null,"state":null ,"position":null,"superior" :null,"department":null,"idnumber":null,"hireDate":null,"phone":null,
                   user :  {"username":"","password":"","email":""}}
import axios from 'axios'
import { ref } from '@vue/reactivity'
import fileDownload from 'js-file-download';
var newDepartment = {'departmentName':'','departmentDescribe':'','departmentState':'','departmentLocation':'','superiorDepartment':null,'departmentCreateTime':'','departmentManager':null};
export default {
    props :{
        mode:String
    },
    data(){
        return{
            personal :newPersonal,
            departments :[],
            superiors :[],
            positions :[],
            addNewUser : false
        }
    },
    created(){
        this.created()
    },
    methods :{
        created(){
            this.loadPositions()
            this.loadDepartments("")
            this.loadPersonals("")
        },
        addUser(){
            this.addNewUser = !this.addNewUser
            if(this.addNewUser==true){
                newPersonal.user = this.newUser
            }else{
                newPersonal.user = null
            }
        },
        
        download(){
            axios.get("/importHrmResource/batchImportPersonalsTemple",{
        responseType: 'blob',
      }).then(
                (res)=>{
                    fileDownload(res.data, '人员导入模板.xlsx');
                }
            )
        },
        loadDepartments(val){
            if(val ==""){
                axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departments =  res.data
                    for(var i = 0;i<this.departments.length;i++){
                        this.departments[i] = {"departmentId":this.departments[i].departmentId,"departmentName":this.departments[i].departmentName}
                    }
                }
            )
            }else{
                axios.post("/getDepartment/getDepartmentsByDepartmentNameLike/"+val).then(
                (res)=>{
                    this.departments =  res.data
                }
            )
            }
        },
        loadPositions(){
            axios.post("/getPosition/getAllPositions").then(
                (res)=>{
                    this.positions = res.data
                }
            )
        },
        loadPersonals(val){
            if(val ==""){
                axios.post("/getPersonal/getAllPersonals").then(
                (res)=>{
                    this.superiors = res.data
                    for(var i = 0;i<this.superiors.length;i++){
                        this.superiors[i] = {"personalId":this.superiors[i].personalId,"personalName":this.superiors[i].personalName}
                    }
                }
            )
            }else{
                axios.post("/getPersonal/getPersonalLikeName/"+val).then(
                (res)=>{
                    this.superiors =  res.data
                }
                )
            }
        },
        summit(){
            delete this.personal.department.personals
            if(!this.addNewUser) delete this.personal.user
            axios.post("/importHrmResource/singleImportPersonal",this.personal).then(
                (res)=>{
                    if(res.data){
                        alert("添加成功")
                    }else{
                        alert("添加失败")
                    }
                    
                }).catch((e)=>{alert("系统发生错误或资料不按要求填写")})
        }
    }
}
</script>

<style>
    #addPersonalCard{
        padding: 15%;
        padding-top: 50px;
        padding-bottom: 0px;
    }
</style>