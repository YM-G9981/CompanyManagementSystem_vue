<template>
    <el-row>
    <el-col :span="8">
        <el-select v-model="selectState" placeholder="请选择内容" 
            @change="handleChange()">
            
            <el-option label="任务标题" value="title"/>
            <el-option  label="任务类型" value="missionType" />
            <el-option label="任务创建时间" value="createTime" />
            <el-option label="任务截止时间" value="deadLineTime" />
            <el-option label="任务发布者" value="missionUser"/>
        </el-select>
    </el-col>
    <el-col :span="14">
        <div
            v-show="selectState == 'createTime'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="范围开始时间"
                end-placeholder="范围结束时间"
                />
        </div>
        <div 
            v-show="selectState == 'title'">
            <el-input
                v-model="value"
                placeholder="请输入标题">
            </el-input>
        </div>
        <div 
            v-show="selectState == 'missionUser'">
            <el-select
                v-model="value"
                filterable
                remote
                reserve-keyword
                placeholder="请选择用户"
                remote-show-suffix
                :remote-method="loadUsers"
                style="width:100%"
                >
                    <el-option
                        v-for="user in users"
                        :key="user.userId"
                        :label="user.personal.name"
                        :value="user.userId"
                    />
                </el-select>
        </div>
        <div 
            v-show="selectState == 'missionType'">
            <el-select 
                class="input" 
                v-model="value"  
                clearable 
                placeholder="请选择类型">
                <el-option
                    v-for="missionType in missionTypes"
                    :key="missionType.missionTypeId"
                    :label="missionType.missionTypeTitle"
                    :value="missionType.missionTypeId"
                />
            </el-select>
        </div>
        <div
            v-show="selectState == 'deadLineTime'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="范围开始时间"
                end-placeholder="范围结束时间"
                />
        </div>
    </el-col>
    <el-col :span="2" v-show="selectState != ''">
        <el-button type="primary" circle :disabled="disabled" @click="getMissions()  ">
            <el-icon>
                <Search/>
            </el-icon>
        </el-button>
    </el-col>
</el-row>
</template>

<script>

import axios from 'axios'
export default {
    props:{
        users :String
    },
    data(){
        return {
            value : "",
            disabled : true,
            selectState :"",
            missionTypes :[],
            users:[]
        }
    },
    created(){
        this.loadMissionTypes()
        this.loadUsers()
    },
    watch :{
        value : function(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        }
    },
    methods :{
        handleChange(){
            this.value = ""
        }
        ,getMissions(){
            var path = ""
            switch(this.selectState){
                case "deadLineTime" : {path = "/getMissionsByDeadlineTimeBetween/" + this.value; break;}
                case "title" : {path = "/getMissionsByMissionTitle/" + this.value; break;}
                case "missionType" :{path = "/getMissionsByMissionType/" + this.value; break;}
                case "createTime": {path = "/getMissionsByMissionTimeBetween/" + this.value; break;}
                case "missionUser" :{path = "/getMissionsByMissionInitiateUser/" + this.value; break;}
            }

            axios.post("/mission" + path).then(
            response => (this.$emit("update:missions",response.data))
            )
            this.value = "";
        },
        loadUsers(val){
            if(val ==""){
                axios.post("/getUser/getAllUsers").then(
                (res)=>{
                    this.users =  res.data
                }
            )
            }else{
                axios.post("/getUser/getUserByPersonalName/"+val).then(
                (res)=>{
                    this.users =  res.data
                }
            )
            }
        }
        ,loadMissionTypes(){
            axios.post("/missionType/getAllMissionType").then(
                res => this.missionTypes = res.data
            )
        }
    }
}
</script>

<style>

</style>