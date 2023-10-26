<template>
    <el-col :span="8">
        <el-select v-model="selectState" placeholder="请选择内容" 
            @change="handleChange()">
            <el-option selected label="标题" value="title" />
            <el-option label="创建时间" value="createTime" />
            <el-option label="状态" value="state" />
            <el-option label="部门" value="department"/>
        </el-select>
    </el-col>
    <el-col :span="14">
        <div
            v-show="selectState == 'title'">
            <el-input
                v-model="value"
                placeholder="请输入标题"
                @change="saveValue()">
            </el-input>
        </div>



        <div
            v-show="selectState == 'createTime'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="生日结束时间"
                @change="saveValue()"
                />
        </div>
        <div
            v-show="selectState == 'state'">
            <el-select v-model="value" placeholder="请选择状态" @change="saveValue()">
            <el-option label="已发布" value=2 />
            <el-option label="未发布" value=1 />
        </el-select>
        </div>
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
    </el-col>
    <el-col :span="2" v-show="selectState != ''">
        <el-button type="primary" :disabled="disabled" circle @click="getPersonals()  ">
            <el-icon>
                <Search/>
            </el-icon>
        </el-button>
    </el-col>
</template>

<script>
import axios from 'axios'
export default {
    data (){
        return{
            value:"",
            disabled:true,
            selectState:"",
            departments:[]
        }
    },
    created(){

    },
    methods :{
        created(){
            this.loadDepartments()            
        }
        ,
        loadDepartments(val){
            if(val ==""){
                axios.post("/getDepartment/getAllDepartments").then(
                (res)=>{
                    this.departments =  res.data
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
        saveValue(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        },
        handleChange(){
            this.value = ""
            this.disabled = true
        },
        getPersonals(){
            var path  = "/announcement"
            switch(this.selectState){
                case "title":{
                    path = path + "/getAnnouncementsByAnnouncementTitleLike/"+this.value
                    break
                }
                case "createTime":{
                    path = path + "/getAnnouncementsByAnnouncementDateBetween/"+this.value 
                    break
                }
                case "state":{
                    path = path + "/getAnnouncementsByAnnouncementState/"+this.value 
                    break
                }
                case "department":{
                    path = path + "/getAnnouncementsByAnnouncementDepartment/"+this.value
                    break
                }
            }
            axios.post(path).then(
                (res)=>{
                    this.$emit("update:announcements",res.data)
                }
            )

        }
    }
}
</script>

<style>

</style>