<template>
    <el-col :span="8">
        <el-select v-model="selectState" placeholder="请选择内容" 
            @change="handleChange()">
            <el-option selected label="部门名" value="name" />
            <el-option label="部门状态" value="state" />
            <el-option label="部门创建时间" value="createTime" />
        </el-select>
    </el-col>
    <el-col :span="14">
        <div 
            v-show="selectState == 'name'">
            <el-input
                v-model="value"
                placeholder="请输入部门名字"
                @change="saveValue()">
            </el-input>
        </div>
        <div
            v-show="selectState == 'state'">
            <el-select v-model="value" placeholder="请选择部门状态" @change="saveValue()">
                <el-option selected label="开业" value=1 />
                <el-option label="暂时封存" value=2 />
                <el-option label="永久封存" value=3 />
            </el-select>
        </div>
        <div
            v-show="selectState == 'createTime'">
            <el-date-picker
                v-model="value"
                type="datetimerange"
                range-separator="到"
                start-placeholder="范围开始时间"
                end-placeholder="范围结束时间"
                @calendar-change="saveValue()"
                />
        </div>
    </el-col>
    <el-col :span="2" v-show="selectState != ''">
        <el-button type="primary" circle :disabled="disabled" @click="getDepartments()  ">
            <el-icon>
                <Search/>
            </el-icon>
        </el-button>
    </el-col>
</template>

<script>

import axios from 'axios'
export default {
    props:{
        departments :String
    },
    data(){
        return {
            value : "",
            disabled : true,
            selectState :""
        }
    },
    methods :{
        saveValue(){
            if(this.value == ""){
                this.disabled = true
            }else{
                this.disabled = false
            }
        }
        ,handleChange(){
            this.value = ""
        }
        ,getDepartments(){
            var path = ""
            switch(this.selectState){
                case "name" : {path = "/getDepartmentsByDepartmentNameLike/" + this.value; break;}
                case "state" :{path = "/getDepartmentByDepartmentState/" + this.value; break;}
                case "createTime": {path = "/getDepartmentByDepartmentCreateTime/" + this.value; break;}
            }

            axios.post("/getDepartment" + path).then(
            response => (this.$emit("update:departments",response.data))
            )
            this.value = "";
        }
    }
}
</script>

<style>

</style>