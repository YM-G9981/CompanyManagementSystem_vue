<template>
    <el-row>
        <el-col :span="4">
            <el-select v-model="selectState" placeholder="请选择内容" 
                @change="handleChange()">
                <el-option  label="部门" value="department" />
                <el-option label="职位" value="position" />
                <el-option label="人员" value="personal" />
                <el-option label="名字" value="name" />
                <el-option label="性别" value="sex" />
                <el-option label="人员状态" value="state" />
            </el-select>
        </el-col>
        
        <el-col :span="10">
            <div 
                v-show="selectState == 'department'">
                <el-select
                    v-model="value"
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
                            :value="department.departmentId"
                        />
                </el-select>
            </div>
            <div 
                v-show="selectState == 'position'">
                <el-select 
                    class="input" 
                    v-model="value"  
                    clearable 
                    placeholder="请选择职位">
                    <el-option
                        v-for="position in positions"
                        :key="position.positionId"
                        :label="position.positionName"
                        :value="position.positionId"
                    />
                </el-select>
            </div>
            <div 
                v-show="selectState == 'personal'">
                <el-select 
                    v-model="value"
                    filterable
                    remote
                    reserve-keyword
                    remote-show-suffix
                    :remote-method="loadPersonals"
                    style="width:100%"
                    placeholder="请选择人员"
                    >
                    <el-option
                        v-for="personal in personals"
                        :key="personal.personalId"
                        :label="personal.name"
                        :value="personal.personalId"
                    />
                </el-select>
            </div>
            <div 
                v-show="selectState == 'name'">
                <el-input
                    v-model="value"
                    placeholder="请输入名字"
                   >
                </el-input>
            </div>
            <div 
                v-show="selectState == 'sex'">
                <el-select v-model="value" placeholder="请选择性别">
                    <el-option label="男" value=1 />
                    <el-option label="女" value=2 />
                </el-select>
            </div>
            <div 
                v-show="selectState == 'state'">
                <el-select v-model="value" placeholder="请选择人员状态">
                    <el-option label="在职" :value=1 />
                    <el-option label="离职" :value=2 />
                    <el-option label="实习生" :value=3 />
                    <el-option label="临时工" :value=4 />
                </el-select>
            </div>
        </el-col>
        <el-col :span="8">
            <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="To"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-if="selectState !=''"
            />
        </el-col>
        <el-col :span="2" >
            <el-button type="primary" circle :disabled="disabled" @click="getSigns()" v-if="selectState !=''">
                <el-icon>
                    <Search/>
                </el-icon>
            </el-button>
        </el-col>
</el-row>
</template>

<script>

import axios from 'axios'
import { watch } from '@vue/runtime-core'
export default {
props:{
},
data(){
    return {
        value : "",
        disabled : true,
        selectState :"",
        departments :[],
        positions:[],
        personals:[],
        signs:[],
        date :[new Date(),new Date()]
        }
    },
    created(){
        this.created()
    },
    methods :{
        saveValue(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        },
        created(){
            this.loadPositions()
            this.loadPersonals()
            this.loadDepartments()
        }
        ,handleChange(){
            this.value = ""
        },
        loadPositions(){
            axios.post("/getPosition/getAllPositions").then(
                    (res)=>{
                        this.positions =  res.data
                    }
                ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        },
        loadPersonals(val){
            if(val == ""){
                axios.post("/getPersonal/getAllPersonals").then(
                    (res)=>{
                        this.personals =  res.data
                    }
                ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }
            else{
                axios.post("/getPersonal/getPersonalLikeName/"+val).then(
                    (res)=>{
                        this.personals =  res.data
                    }
                ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }
        },
        loadDepartments(val){
            if(val ==""){
                axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departments =  res.data
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }else{
                axios.post("/getDepartment/getDepartmentsByDepartmentNameLike/"+val).then(
                (res)=>{
                    this.departments =  res.data
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
            }
        },
        getSigns(){
            var path = "/leave"
            switch(this.selectState){
                case "department":{
                    path = path + "/getLeavesByDepartmentId/" + this.value
                    break
                }
                case "position":{
                    path = path + "/getLeavesByPositionId/" + this.value
                    break
                }
                case "personal":{
                    path = path + "/getLeavesByPersonalId/"+ this.value
                    break
                }
                case "name":{
                    path = path +"/getLeavesLikeName/"+ this.value
                    break
                }
                case "sex":
                    path = path + "/getLeavesBySex/" + this.value
                    break
                case "state":
                    path = path + "/getLeavesByState/" + this.value
                    break
            }
            path = path + "/" + this.date
            axios.post(path).then(
                (res)=>{
                    this.$.emit("update:leaves",res.data)
                }
            ).catch(e=>{
         alert("网络错误，请稍后重试")
      })
        }
    },
    watch:{
        value :function(){
            if(this.value == "") {
                this.disabled= true
            }else{
                this.disabled = false
            }
        }
    }
}
</script>

<style>

</style>